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
	embeddedFiles         embed.FS
	frontendWsConnected   = false
	replicasWsConnections = make(map[string]*websocket.Conn)
	frontendWsConnection  *websocket.Conn
	tracksBreakpoints     = make(map[string]float64)
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

	e.POST("/reset", handleReset)
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
			log.Err(err).Msg("error looking up host watch replicas")
			continue
		}
		for ip := range replicasWsConnections {
			found := false
			for _, backendIP := range ips {
				if ip == backendIP {
					found = true
					break
				}
			}
			if !found {
				logger.Printf("removing ip %s", ip)
				globalChan <- Msg{RemovedTrack: ip}
				delete(replicasWsConnections, ip)
			}
		}
		log.Info().Strs("ips", ips).Msg("found ips")
		for _, ip := range ips {
			clientIP := ip
			if _, ok := tracksBreakpoints[ip]; ok {
				globalChan <- Msg{Track: map[string]interface{}{"ip": clientIP, "breakPoint": tracksBreakpoints[ip]}}
			} else {
				globalChan <- Msg{Track: map[string]interface{}{"ip": clientIP}}
			}
			if _, ok := replicasWsConnections[ip]; !ok || !replicasWsConnections[ip].IsClientConn() {
				replicasWsConnections[ip], err = websocket.Dial(fmt.Sprintf("ws://[%s]:3333", ip), "", "http://localhost:4000")
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
							delete(replicasWsConnections, clientIP) // Remove the broken socket from the map
							return                                  // Attempt to reconnect on the next iteration
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
									delete(tracksBreakpoints, clientIP)
								} else {
									tracksBreakpoints[clientIP] = trackMsg["breakPoint"].(float64)
								}
							} else {
								delete(tracksBreakpoints, clientIP)
							}
							trackMsg["ip"] = clientIP
							globalChan <- Msg{Track: trackMsg}
						}
					}
				}(replicasWsConnections[ip], clientIP)
			}
		}
		time.Sleep(500 * time.Millisecond)
	}
}

func handleReset(c echo.Context) error {
	ips, err := net.LookupHost(BackendHost)
	if err != nil {
		log.Err(err).Msg("error looking up host reset")
		return err
	}
	log.Info().Strs("ips", ips).Msg("found ips for reset")

	client := &http.Client{}
	for _, ip := range ips {
		req, err := http.NewRequest("POST", fmt.Sprintf("http://[%s]:3300/reset", ip), nil)
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		defer resp.Body.Close()
		if err != nil || resp.StatusCode != http.StatusOK {
			c.Logger().Error(err)
			c.Response().WriteHeader(http.StatusInternalServerError)
			c.Response().Write([]byte(fmt.Sprintf("failed to reset replica %s", ip)))
			return err
		}
		err = replicasWsConnections[ip].Close()
		if err != nil {
			log.Err(err).Msg("error closing websocket")
		}
		delete(replicasWsConnections, ip)
		globalChan <- Msg{RemovedTrack: ip}
	}

	err = frontendWsConnection.Close()
	if err != nil {
		log.Err(err).Msg("error closing websocket")
	}
	tracksBreakpoints = make(map[string]float64)
	return nil
}

func handleStartTrain(c echo.Context) error {
	speed := c.FormValue("speed")
	id := c.FormValue("id")
	ips, err := net.LookupHost(BackendHost)
	if err != nil {
		log.Err(err).Msg("error looking up host start train")
		return err
	}
	log.Info().Strs("ips", ips).Msg("found ips for start train")

	var selectedIP string
	var i = 0
	for {
		// select one ip at random
		selectedIP = ips[rand.Intn(len(ips))]
		if _, ok := tracksBreakpoints[selectedIP]; !ok {
			c.Logger().Info(fmt.Sprintf("selected ip %s", selectedIP))
			break
		}
		c.Logger().Info(fmt.Sprintf("track at ip %s is broken", selectedIP))
		i++
		if i > 20 {
			c.Response().WriteHeader(http.StatusInternalServerError)
			c.Response().Write([]byte("no working brokenTracks found"))
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
	if frontendWsConnected {
		c.Logger().Info("Websocket connection already established")
		return nil
	}
	c.Logger().Info("Websocket connection established")
	websocket.Handler(func(ws *websocket.Conn) {
		frontendWsConnection = ws
		frontendWsConnected = true
		defer func() {
			c.Logger().Info("Websocket connection closed")
			ws.Close()
			frontendWsConnected = false
			frontendWsConnection = nil
		}()
		for {
			if !frontendWsConnected {
				c.Logger().Info("Websocket connection closed, stopping read loop")
				break
			}
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
