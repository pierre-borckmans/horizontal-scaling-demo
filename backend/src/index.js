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
const wss = new WebSocket.Server({ port: wsPort });
server.listen(httpPort, () => {
  console.log(`Server started on http://0.0.0.0:${httpPort}/`);
});

let trains = [];
const trainLength = 12; // in % of the track
const refreshInterval = 50; // Refresh rate in milliseconds
const timeFactor = 1000 / refreshInterval; // Factor to adjust speed
const minSpeed = 15;
const maxSpeed = 60;

let breakPoint = undefined;

app.post("/startTrain", (req, res) => {
  console.log("New train", req.query);
  const id = (req.query && req.query.id) || uuidv4();
  const speed =
    (req.query && req.query.speed) ||
    Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const newTrain = {
    id,
    speed,
    position: 0,
    rerouted: !!req.query.id,
  };
  console.log("New train", newTrain.id);
  trains.push(newTrain);
  res.json(newTrain);
});

app.post("/breakTrack", (req, res) => {
  console.log("Track is broken");
  breakPoint = 70;
});

app.post("/repairTrack", (req, res) => {
  console.log("Track is repaired");
  breakPoint = null;
});

// Simulation
setInterval(() => {
  for (let i = 0; i < trains.length; i++) {
    if (!trains[i]) continue;

    let currentSpeed = trains[i].speed;
    let braking = false;

    if (
      i > 0 &&
      trains[i - 1] &&
      trains[i - 1].position - trainLength - 1 <= trains[i].position
    ) {
      // Match speed and position of the train in front
      trains[i].position = Math.max(
        0,
        trains[i - 1].position - trainLength - 1,
      );
      currentSpeed = trains[i].position === 0 ? 0 : trains[i - 1].speed;
      braking = true;
    } else {
      // Move the train
      trains[i].position = Math.max(
        0,
        Math.min(100, trains[i].position + currentSpeed / timeFactor),
      );
    }

    if (breakPoint && trains[i].position >= breakPoint) {
      trains[i].rerouted = true;
      trains[i].position = breakPoint - trainLength;
      trains[i].speed *= -1;
      for (let j = i + 1; j < trains.length; j++) {
        trains[j].rerouted = true;
        trains[j].speed *= -1;
      }
    }

    // Send position updates as JSON
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
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
    });

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
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          track: {
            breakPoint,
          },
        }),
      );
    }
  });
}, 500);
