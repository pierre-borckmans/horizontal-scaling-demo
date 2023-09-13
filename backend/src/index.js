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
const minSpeed = 35;
const maxSpeed = 60;

// HTTP endpoint to add a train
app.post("/startTrain", (req, res) => {
  console.log("New train");
  const id = uuidv4();
  const speed =
    (req.body && req.body.speed) ||
    Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const newTrain = {
    id,
    speed,
    position: 0,
  };
  console.log("New train", newTrain.id);
  trains.push(newTrain);
  res.json(newTrain);
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
      trains[i].position = Math.min(
        100,
        trains[i].position + currentSpeed / timeFactor,
      );
    }

    if (trains[i].position >= 100) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              id: trains[i].id,
              position: 100,
              speed: 0,
              braking: false,
            }),
          );
        }
      });
      trains[i] = null;
      continue;
    }

    // Send position updates as JSON
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            id: trains[i].id,
            position: trains[i].position,
            speed: currentSpeed,
            braking,
          }),
        );
      }
    });
  }
}, refreshInterval);
