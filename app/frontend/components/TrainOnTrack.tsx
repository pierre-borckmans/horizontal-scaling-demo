import Train from "@/public/train.svg";
import React, { useEffect, useRef, useState } from "react";
import { TrainInfo } from "@/types/types";

const START_THRESHOLD = 3;
const START_LEFT = "-100px";

type Props = {
  train: TrainInfo;
  trackIndex: number;
};
export default function TrainOnTrack({ train, trackIndex }: Props) {
  const distToCenterY = -4 - trackIndex * 92;
  return (
    <div
      key={train.id}
      className="absolute h-full w-full items-center justify-center transition-all"
      style={{
        top:
          train.position === 100
            ? distToCenterY
            : train.position < START_THRESHOLD
            ? -trackIndex * 80
            : "calc(50% - 12px)",
        left:
          train.position < START_THRESHOLD
            ? "calc(0% - 120px)"
            : train.position === 100
            ? `calc(100% + 76px)`
            : `${train.position}%`,
        transformOrigin: "center left",
        transitionDuration: `${
          train.position < START_THRESHOLD || train.position === 100 ? 0.8 : 0.3
        }s`,
        opacity:
          train.position < START_THRESHOLD || train.position === 100 ? 0 : 1,
        transitionTimingFunction:
          train.position === 100 ? "ease-out" : "linear",
        scale:
          train.position < START_THRESHOLD || train.position === 100 ? 0.5 : 1,
      }}
    >
      <Train
        className="relative mt-[4px] h-[16px] transition-all lg:mt-0 lg:h-[25px]"
        style={{
          preserveAspectRatio: "none",
          width: "12%",
          color: train.braking
            ? "red"
            : train.position === 100
            ? "lightblue"
            : train.rerouted && train.speed < 0
            ? "#fad002"
            : "white",
        }}
      />
      {train.rerouted && (
        <span className="text:sm absolute left-[8px] top-[-12px] lg:left-[50px] lg:top-[-20px] lg:text-xl">
          ⤵️
        </span>
      )}
    </div>
  );
}
