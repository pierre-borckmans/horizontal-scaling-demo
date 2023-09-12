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
  console.log("Server started on http://localhost:6000/");
});

let trains = [];
const trainLength = 2; // Train length set to 2%
const refreshInterval = 5; // Refresh rate in milliseconds
const timeFactor = 1000 / refreshInterval; // Factor to adjust speed
const minSpeed = 5;
const maxSpeed = 20;

// HTTP endpoint to add a train
app.post("/startTrain", (req, res) => {
  const id = uuidv4();
  const speed =
    (req.body && req.body.speed) ||
    Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const newTrain = {
    id,
    speed,
    position: 0,
  };
  trains.push(newTrain);
  res.json(newTrain);
});

// Simulation
setInterval(() => {
  for (let i = 0; i < trains.length; i++) {
    let currentSpeed = trains[i].speed;

    if (i > 0 && trains[i - 1].position - trainLength <= trains[i].position) {
      // Match speed and position of the train in front
      trains[i].position = Math.max(0, trains[i - 1].position - trainLength);
      currentSpeed = trains[i].position === 0 ? 0 : trains[i - 1].speed;
    } else {
      // Move the train
      trains[i].position += currentSpeed / timeFactor;
    }

    if (trains[i].position >= 100) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ id: trains[i].id, position: 100, speed: 0 }),
          );
        }
      });

      // Remove the train
      trains.splice(i, 1);
      i--;
    } else {
      // Send position updates as JSON
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              id: trains[i].id,
              position: trains[i].position,
              speed: currentSpeed,
            }),
          );
        }
      });
    }
  }
}, refreshInterval);
