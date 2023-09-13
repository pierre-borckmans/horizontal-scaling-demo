import Train1 from "../public/train1.svg";
import React from "react";
import { TrainInfo } from "@/app/page";

type Props = {
  ip: string;
  trains: TrainInfo[];
  index: number;
};

export default function Track({ trains, ip, index }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 px-40">
      <div
        className="relative flex h-[1vw] w-full"
        style={{
          background: `linear-gradient(90deg,
          rgb(255 255 255/0) 0%,
          hsla(220, 62%, 25%, .5) 15%,
          hsla(220, 62%, 25%, .5) 85%,
          rgb(255 255 255/0) 100%)`,
        }}
      >
        {trains.map((train) => (
          <div
            key={train.id}
            className="absolute h-full w-full items-center justify-center transition-all"
            style={{
              top:
                train.position === 100
                  ? -140 - 50 * index
                  : "calc(50% - 12.5px)",
              left: `${
                train.position === 100
                  ? 130
                  : train.position === 0
                  ? -10
                  : train.position
              }%`,
              transform: `rotate(-${
                train.position === 100 ? 80 + index * 5 : 0
              }deg)`,
              transformOrigin: "center left",
              transitionDuration: `${train.position === 100 ? 2 : 0.3}s`,
              opacity: train.position === 100 || train.position === 0 ? 0 : 100,
              scale: train.position === 100 ? 0.1 : 1,
              transitionTimingFunction:
                train.position === 100 ? "ease-out" : "linear",
            }}
          >
            <Train1
              className="transition-all"
              style={{
                width: "12%",
                height: 25,
                color: train.braking
                  ? "red"
                  : train.position === 100
                  ? "lime"
                  : "white",
              }}
            />
          </div>
        ))}
      </div>
      <span className="font-bold text-purple-600">
        Track {index + 1} : [{ip}]
      </span>
    </div>
  );
}
