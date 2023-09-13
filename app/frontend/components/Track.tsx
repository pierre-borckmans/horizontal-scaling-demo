import Train1 from "../public/train1.svg";
import React from "react";
import { TrainInfo } from "@/app/page";

type Props = {
  trains: TrainInfo[];
};
export default function Track({ trains }: Props) {
  return (
    <div
      className="relative flex h-8 w-full"
      style={{
        background: `linear-gradient(0deg,
          rgb(255 255 255/0) 0%,
          hsla(220, 62%, 25%, .5) 15%,
          hsla(220, 62%, 25%, .5) 85%,
          rgb(255 255 255/0) 100%)`,
      }}
    >
      {trains.map((train) => (
        <div
          className="absolute flex transition-all"
          style={{
            top: 0,
            left: `${train.position}%`,
          }}
        >
          <Train1
            style={{
              width: 200,
              height: 32,
            }}
          />
        </div>
      ))}
    </div>
  );
}
