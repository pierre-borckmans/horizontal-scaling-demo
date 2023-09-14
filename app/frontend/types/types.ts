export const NUM_TRAINS = 12;

export type Msg = {
  removed?: string;
  track?: string;
  train?: TrainInfo;
};

export type TrainInfo = {
  id: string;
  position: number;
  speed: number;
  braking: boolean;
  track: string;
};
