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
	"io"
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
	Track        map[string]interface{} `json:"track"`
	Train        map[string]interface{} `json:"train"`
}

var globalChan = make(chan Msg, 100)

var (
	//go:embed frontend/out/*
	embeddedFiles embed.FS
	wsClients     = make(map[string]*websocket.Conn)
	brokenTracks  = make(map[string]bool)
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})
	if ListenPort == "" {
		ListenPort = "80"
	}
	if BackendHost == "" {
		BackendHost = "localhost"
	}
	println(fmt.Sprintf("Listening on port %s", ListenPort))
	println(fmt.Sprintf("Backend host %s", BackendHost))
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
	e.POST("/breakTrack", handleBreakTrack)
	e.POST("/repairTrack", handleRepairTrack)
	e.GET("/ws", handleWebSocket)
	return e
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
			globalChan <- Msg{Track: map[string]interface{}{"ip": clientIP}}
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
						var msgMap map[string]interface{}
						err = json.Unmarshal([]byte(msg), &msgMap)
						if err != nil {
							logger.Error(err)
							continue
						}

						if _, ok := msgMap["train"]; ok {
							var trainMsg = msgMap["train"].(map[string]interface{})
							globalChan <- Msg{Train: trainMsg, Track: map[string]interface{}{"ip": clientIP}}
						}

						if _, ok := msgMap["track"]; ok {
							var trackMsg = msgMap["track"].(map[string]interface{})
							if _, ok := trackMsg["breakPoint"]; ok {
								if trackMsg["breakPoint"] == nil {
									brokenTracks[clientIP] = false
								} else {
									brokenTracks[clientIP] = true
								}
							} else {
								brokenTracks[clientIP] = false
							}
							trackMsg["ip"] = clientIP
							globalChan <- Msg{Track: trackMsg}
						}
					}
				}(wsClients[ip], clientIP)
			}
		}
		time.Sleep(500 * time.Millisecond)
	}
}

func handleStartTrain(c echo.Context) error {
	speed := c.FormValue("speed")
	id := c.FormValue("id")
	ips, err := net.LookupHost(BackendHost)
	if err != nil {
		log.Err(err).Msg("error looking up host")
		return err
	}
	log.Info().Strs("ips", ips).Msg("found ips for start train")

	var selectedIP string
	var i = 0
	for {
		// select one ip at random
		selectedIP = ips[rand.Intn(len(ips))]
		println(brokenTracks[selectedIP])
		if !brokenTracks[selectedIP] {
			c.Logger().Info(fmt.Sprintf("selected ip %s", selectedIP))
			break
		}
		c.Logger().Info(fmt.Sprintf("track at ip %s is broken", selectedIP))
		i++
		if i > 20 {
			c.Response().WriteHeader(http.StatusInternalServerError)
			return fmt.Errorf("no working brokenTracks found")
		}
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", fmt.Sprintf("http://[%s]:3300/startTrain?speed=%s&id=%s", selectedIP, speed, id), nil)
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

	respBody, err := io.ReadAll(resp.Body)
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write(respBody)

	return nil
}

func handleBreakTrack(c echo.Context) error {
	ip := c.FormValue("ip")
	client := &http.Client{}
	req, err := http.NewRequest("POST", fmt.Sprintf("http://[%s]:3300/breakTrack", ip), nil)
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

	respBody, err := io.ReadAll(resp.Body)
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write(respBody)

	return nil
}

func handleRepairTrack(c echo.Context) error {
	ip := c.FormValue("ip")
	client := &http.Client{}
	req, err := http.NewRequest("POST", fmt.Sprintf("http://[%s]:3300/repairTrack", ip), nil)
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

	respBody, err := io.ReadAll(resp.Body)
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write(respBody)

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
