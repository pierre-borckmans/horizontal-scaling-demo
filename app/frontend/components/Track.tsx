import Train1 from "../public/train1.svg";
import React from "react";
import { TrainInfo } from "@/app/page";

type Props = {
  ip: string;
  trains: TrainInfo[];
};

export default function Track({ trains, ip }: Props) {
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
              top: "calc(50% - 12.5px)",
              left: `${train.position * 0.9}%`,
              transitionTimingFunction: "linear",
            }}
          >
            <Train1
              className="transition-all duration-[2000ms]"
              style={{
                width: "8%",
                height: 25,
                opacity: train.position === 100 ? 0 : 100,
              }}
            />
          </div>
        ))}
      </div>
      Track {ip}
    </div>
  );
}
