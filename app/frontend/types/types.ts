export const NUM_TRAINS = 12;
export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "localhost"
    : "horizontal-scaling-demo.up.railway.app";
export const WS_PROTOCOL =
  process.env.NODE_ENV === "development" ? "ws" : "wss";
export const HTTP_PROTOCOL =
  process.env.NODE_ENV === "development" ? "http" : "https";

export type Msg = {
  removed?: string;
  track?: TrackInfo;
  train?: TrainInfo;
};

export type TrainInfo = {
  id: string;
  position: number;
  speed: number;
  braking: boolean;
  track: string;
  rerouted?: boolean;
};

export type TrackInfo = {
  ip: string;
  breakPoint?: number;
};
