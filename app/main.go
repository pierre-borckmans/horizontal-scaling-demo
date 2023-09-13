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

var globalChan = make(chan string)

var (
	//go:embed frontend/out/*
	embeddedFiles embed.FS
	wsClients     = make(map[string]*websocket.Conn)
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})
	if ListenPort == "" {
		ListenPort = "4000"
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
		log.Info().Strs("ips", ips).Msg("found ips")
		for _, ip := range ips {
			if _, ok := wsClients[ip]; !ok {
				wsClients[ip], err = websocket.Dial(fmt.Sprintf("ws://[%s]:3333", ip), "", "http://localhost:4000")
				if err != nil {
					log.Err(err).Str("ip", ip).Msg("error dialing websocket for ip")
					continue
				}

				go func(ws *websocket.Conn) {
					for {
						msg := ""
						err := websocket.Message.Receive(ws, &msg)
						if err != nil {
							log.Err(err).Str("ip", ip).Msg("error receiving message from backend")
							return
						}
						var jsonMsg map[string]interface{}
						err = json.Unmarshal([]byte(msg), &jsonMsg)
						if err != nil {
							logger.Error(err)
							continue
						}
						jsonMsg["track"] = ip
						enrichedMsg, err := json.Marshal(jsonMsg)
						if err != nil {
							logger.Error(err)
							continue
						}
						println(msg)
						globalChan <- string(enrichedMsg)
					}
				}(wsClients[ip])
			}
		}
		time.Sleep(5 * time.Second)
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

	// select one ip at random
	ip := ips[rand.Intn(len(ips))]

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
			err := websocket.Message.Send(ws, msg)
			if err != nil {
				c.Logger().Error(err)
			}
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
