import Train1 from "../public/train1.svg";
import React from "react";
import { TrainInfo } from "@/app/page";

type Props = {
  ip: string;
  trains: TrainInfo[];
  totalTracks: number;
  index: number;
};

export default function Track({ index, trains, ip, totalTracks }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 pt-10">
      <div
        className="relative flex h-[1vw] w-full border-b-2 border-t-2 border-[#5bade0cc]"
        style={{
          background: `linear-gradient(90deg,
          rgb(255 255 255/0) 0%,
          hsla(220, 62%, 25%, .5) 15%,
          hsla(220, 62%, 25%, .5) 85%,
          rgb(255 255 255/0) 100%)`,
        }}
      >
        <div
          className="flex h-full w-full"
          style={{
            background: `linear-gradient(
              to right,
              #0000 1px,
              #305973 3px,
              #0000 0px
              )`,
            backgroundSize: "3% 100%",
          }}
        ></div>
        {trains.map((train) => {
          const distToCenterY = ((totalTracks + 1) / 2 - index!) * 80;
          return (
            <div
              key={train.id}
              className="absolute h-full w-full items-center justify-center transition-all"
              style={{
                top:
                  train.position === 100 || train.position < 8
                    ? distToCenterY
                    : "calc(50% - 12.5px)",
                left:
                  train.position < 5
                    ? "calc(0% - 400px)"
                    : train.position === 100
                    ? `calc(100% + 76px)`
                    : `${train.position}%`,
                transformOrigin: "center left",
                transitionDuration: `${
                  train.position < 5 || train.position === 100 ? 0.8 : 0.3
                }s`,
                opacity: train.position === 100 ? 0 : 1,
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
                    ? "lightblue"
                    : "white",
                }}
              />
            </div>
          );
        })}
      </div>
      <span className="flex items-center gap-2 text-[#4f98c4]">
        <span className="font-bold">Track {index + 1}</span>
        <span className="text-xs"> [{ip}]</span>
      </span>
    </div>
  );
}
