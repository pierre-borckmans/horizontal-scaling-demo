package main

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/ziflex/lecho/v3"
	"golang.org/x/net/websocket"
	"golang.org/x/sync/errgroup"
	"io/fs"
	"math/rand"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"
)

var (
	ListenPort  = os.Getenv("PORT")
	BackendHost = os.Getenv("BACKEND_HOST")
)

type Msg struct {
	RemovedTrack string                 `json:"removed"`
	Track        string                 `json:"track"`
	Train        map[string]interface{} `json:"train"`
}

var globalChan = make(chan Msg, 100)

var (
	//go:embed frontend/out/*
	embeddedFiles embed.FS
	wsClients     = make(map[string]*websocket.Conn)
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})
	if ListenPort == "" {
		ListenPort = "80"
	}
	if BackendHost == "" {
		BackendHost = "localhost"
	}
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	e := newServer()

	go watchReplicas(e.Logger)

	// start the server
	errg := errgroup.Group{}
	errg.Go(func() error {
		return e.Start(":" + ListenPort)
	})

	<-ctx.Done()
	if err := e.Shutdown(context.Background()); err != nil {
		log.Err(err).Msg("error shutting down server")
	}
	errg.Wait()

}

func watchReplicas(logger echo.Logger) {
	for {
		ips, err := net.LookupHost(BackendHost)
		if err != nil {
			log.Err(err).Msg("error looking up host")
			continue
		}
		for ip := range wsClients {
			found := false
			for _, backendIP := range ips {
				if ip == backendIP {
					found = true
					break
				}
			}
			if !found {
				globalChan <- Msg{RemovedTrack: ip}
				delete(wsClients, ip)
			}
		}
		log.Info().Strs("ips", ips).Msg("found ips")
		for _, ip := range ips {
			clientIP := ip
			globalChan <- Msg{Track: clientIP}
			if _, ok := wsClients[ip]; !ok || !wsClients[ip].IsClientConn() {
				wsClients[ip], err = websocket.Dial(fmt.Sprintf("ws://[%s]:3333", ip), "", "http://localhost:4000")
				if err != nil {
					log.Err(err).Str("ip", ip).Msg("error dialing websocket for ip")
					continue
				}

				go func(ws *websocket.Conn, ip string) {
					for {
						msg := ""
						err := websocket.Message.Receive(ws, &msg)
						if err != nil {
							log.Err(err).Str("ip", ip).Msg("error receiving message from backend")
							delete(wsClients, clientIP) // Remove the broken socket from the map
							return                      // Attempt to reconnect on the next iteration
						}
						var trainMsg map[string]interface{}
						err = json.Unmarshal([]byte(msg), &trainMsg)
						if err != nil {
							logger.Error(err)
							continue
						}
						globalChan <- Msg{Track: ip, Train: trainMsg}
					}
				}(wsClients[ip], clientIP)
			}
		}
		time.Sleep(500 * time.Millisecond)
	}
}

func newServer() *echo.Echo {
	e := echo.New()
	e.Logger = lecho.From(log.Logger)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowMethods: []string{"*"},
	}))

	fsys, err := fs.Sub(embeddedFiles, "frontend/out")
	if err != nil {
		panic(err)
	}

	hfsys := http.FS(fsys)

	e.GET("/*", echo.WrapHandler(http.FileServer(hfsys)))

	e.POST("/startTrain", handleStartTrain)
	e.GET("/ws", handleWebSocket)
	return e
}

func handleStartTrain(c echo.Context) error {
	ips, err := net.LookupHost(BackendHost)
	if err != nil {
		log.Err(err).Msg("error looking up host")
		return err
	}
	log.Info().Strs("ips", ips).Msg("found ips for start train")

	// select one ip at random
	ip := ips[rand.Intn(len(ips))]
	c.Logger().Info(fmt.Sprintf("selected ip %s", ip))

	client := &http.Client{}
	req, err := http.NewRequest("POST", fmt.Sprintf("http://[%s]:3300/startTrain", ip), nil)
	if err != nil {
		c.Logger().Error(err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		c.Logger().Error(err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("received non-OK status code: %d", resp.StatusCode)
		c.Logger().Error(err)
		return err
	}

	return nil
}

func handleWebSocket(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Read from the global channel and forward to the client WebSocket
			msg := <-globalChan
			b, err := json.Marshal(msg)
			if err != nil {
				c.Logger().Error(err)
				c.Logger().Info("Error marshalling message")
				break
			}
			err = websocket.Message.Send(ws, string(b))
			if err != nil {
				c.Logger().Error(err)
				c.Logger().Info("Error sending message")
				break // or attempt to reconnect
			}
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
