const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const httpPort = 3300;
const wsPort = 3333;

const app = express();
app.use(cors());
const server = http.createServer(app);
server.listen(httpPort, () => {
  console.log(`Server started on http://0.0.0.0:${httpPort}/`);
});

const wss = new WebSocket.Server({ port: wsPort });
let wsClient = null;
wss.on("connection", (ws) => {
  if (wsClient) {
    console.log("A client is already connected, closing new connection");
    ws.close();
    return;
  }
  console.log("New client connected");
  wsClient = ws;
  ws.on("close", () => {
    console.log("Client disconnected");
    wsClient = null;
  });
});

let trainsStartQueue = [];
let trains = [];
const trainLength = 12; // in % of the track
const refreshInterval = 50; // Refresh rate in milliseconds
const timeFactor = 1000 / refreshInterval; // Factor to adjust speed
const minSpeed = 15;
const maxSpeed = 60;

let breakPoint = undefined;

const notifyTrack = () => {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(
      JSON.stringify({
        track: {
          breakPoint,
        },
      }),
    );
  }
};

app.post("/startTrain", (req, res) => {
  if (!wsClient) {
    res.status(500).send("No client connected");
    return;
  }
  console.log("New train", req.query);
  const id = (req.query && req.query.id) || uuidv4();
  const speed =
    (req.query && req.query.speed) ||
    Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const newTrain = {
    id,
    speed,
    position: -1,
    rerouted: !!req.query.id,
    braking: false,
  };
  console.log("New train", newTrain.id);
  trainsStartQueue.push(newTrain);
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(
      JSON.stringify({
        train: newTrain,
      }),
    );
  }
  res.json(newTrain);
});

app.post("/breakTrack", (req, res) => {
  if (!wsClient) {
    res.status(500).send("No client connected");
    return;
  }
  console.log("Track is broken");
  breakPoint = 70;
  notifyTrack();
});

app.post("/repairTrack", (req, res) => {
  if (!wsClient) {
    res.status(500).send("No client connected");
    return;
  }
  console.log("Track is repaired");
  breakPoint = null;
  notifyTrack();
});

// Simulation
setInterval(() => {
  if (trainsStartQueue.length) {
    if (!trains.some((t) => t && t.position <= trainLength + 1.5)) {
      trains.push(trainsStartQueue.shift());
    }
  }

  for (let i = 0; i < trains.length; i++) {
    if (!trains[i]) continue;

    let currentSpeed = trains[i].speed;
    let braking = false;

    const collidingTrain = trains.find(
      (t) =>
        t &&
        t.id !== trains[i].id &&
        t.position - trains[i].position > 0 &&
        t.position - trains[i].position <= trainLength + 1.5,
    );

    if (collidingTrain) {
      // Match speed and position of the train in front
      trains[i].position = Math.max(
        0,
        collidingTrain.position - trainLength - 0.5,
      );
      currentSpeed = trains[i].position === 0 ? 0 : collidingTrain.speed;
      braking = true;
    } else {
      // Move the train
      trains[i].position = Math.max(
        0,
        Math.min(100, trains[i].position + currentSpeed / timeFactor),
      );
    }

    if (
      breakPoint &&
      trains[i].position >= breakPoint - 0.5 &&
      trains[i].position < breakPoint + 1
    ) {
      trains[i].rerouted = true;
      trains[i].position = breakPoint - trainLength;
      trains[i].speed *= -1;
      for (let j = i + 1; j < trains.length; j++) {
        if (!trains[j]) continue;
        trains[j].rerouted = true;
        trains[j].speed *= -1;
      }
    }

    // Send position updates as JSON
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(
        JSON.stringify({
          train: {
            id: trains[i].id,
            position: trains[i].position,
            speed: currentSpeed,
            braking,
            rerouted: trains[i].rerouted,
          },
        }),
      );
    }

    if (trains[i].position >= 100) {
      trains[i] = null;
      continue;
    }

    if (trains[i].position === 0 && trains[i].rerouted) {
      trains[i] = null;
      continue;
    }
  }
}, refreshInterval);

setInterval(() => {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(
      JSON.stringify({
        track: {
          breakPoint,
        },
      }),
    );
  }
}, 200);
