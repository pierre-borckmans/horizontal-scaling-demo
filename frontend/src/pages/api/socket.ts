import { NextApiRequest, NextApiResponse } from "next";
import { TrainInfo } from "~/pages";

export let wss: any;

const clients = {};
const wsPort = 3333;

export default async function socket(
  req: NextApiRequest,
  res: NextApiResponse<{} | { error: string }>
) {
  if (wss) {
    console.log("Websocket already exists");
  } else {
    wss = new WebSocket.Server({ port: 4444 });
    console.log("Websocket created");
  }
  res.end();
}

export function updateClients(ips: string[]) {
  ips.forEach((ip) => {
    if (!clients[ip]) {
      const ws = new WebSocket(`ws://${ip}:${wsPort}`);
      clients[ip] = ws;

      ws.addEventListener("open", () => {
        console.log("WebSocket connection opened", ip);
      });

      ws.addEventListener("close", () => {
        delete clients[ip];
        console.log("WebSocket connection closed");
      });

      ws.addEventListener("message", (event) => {
        const trainData = JSON.parse(event.data) as TrainInfo;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(trainData));
          }
        });
      });
    }
  });
}
