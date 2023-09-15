import Train1 from "../public/train1.svg";
import React, { useState } from "react";
import { BACKEND_URL, HTTP_PROTOCOL, TrainInfo } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  ip: string;
  trains: TrainInfo[];
  totalTracks: number;
  index: number;
  onBreak?: (index: number) => void;
  onRepair?: (index: number) => void;
  breakPoint?: number;
};

const START_THRESHOLD = 3;

export default function Track({
  index,
  trains,
  ip,
  onBreak,
  onRepair,
  breakPoint,
}: Props) {
  const breakTrack = async () => {
    const response = await axios.post(
      `${HTTP_PROTOCOL}://${BACKEND_URL}/breakTrack?ip=${ip}`
    );
    return response.data;
  };
  const repairTrack = async () => {
    const response = await axios.post(
      `${HTTP_PROTOCOL}://${BACKEND_URL}/repairTrack?ip=${ip}`
    );
    return response.data;
  };

  const [hovered, setHovered] = useState(false);
  const breakTrackMutation = useMutation(breakTrack, {
    onSuccess: () => {
      onBreak && onBreak(index);
    },
  });
  const repairTrackMutation = useMutation(repairTrack, {
    onSuccess: () => {
      onRepair && onRepair(index);
    },
  });

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 pt-7"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
        {hovered && !breakPoint && (
          <div
            className="absolute right-0 top-[-40px] cursor-pointer text-2xl transition-all hover:scale-125"
            onClick={() => {
              breakTrackMutation.mutate();
            }}
          >
            💣
          </div>
        )}
        {hovered && breakPoint && (
          <div
            className="absolute right-0 top-[-40px] cursor-pointer text-2xl transition-all hover:scale-125"
            onClick={() => {
              repairTrackMutation.mutate();
            }}
          >
            🦺
          </div>
        )}
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

        {breakPoint && (
          <>
            <div
              className="absolute top-[-12px] text-2xl"
              style={{ left: `${breakPoint}%` }}
            >
              💥
            </div>
            <div
              className="absolute top-0 flex h-full bg-red-300/50 px-4"
              style={{
                left: `${breakPoint + 1}%`,
                width: `${100 - 1 - breakPoint}%`,
              }}
            />
          </>
        )}

        {trains.map((train) => {
          const distToCenterY = -4 - index * 92;
          return (
            <div
              key={train.id}
              className="absolute h-full w-full items-center justify-center transition-all"
              style={{
                top:
                  train.position === 100
                    ? distToCenterY
                    : train.position < START_THRESHOLD
                    ? -index * 80
                    : "calc(50% - 12.5px)",
                left:
                  train.position < START_THRESHOLD
                    ? "calc(0% - 120px)"
                    : train.position === 100
                    ? `calc(100% + 76px)`
                    : `${train.position * 1.0}%`,
                transformOrigin: "center left",
                transitionDuration: `${
                  train.position < START_THRESHOLD || train.position === 100
                    ? 0.8
                    : 0.3
                }s`,
                opacity:
                  train.position < START_THRESHOLD || train.position === 100
                    ? 0
                    : 1,
                transitionTimingFunction:
                  train.position === 100 ? "ease-out" : "linear",
                scale:
                  train.position < START_THRESHOLD || train.position === 100
                    ? 0.5
                    : 1,
              }}
            >
              {train.rerouted && (
                <span className="absolute left-[28px] top-[-7px] text-2xl">
                  ⚠️
                </span>
              )}
              <Train1
                className="transition-all"
                style={{
                  width: "12%",
                  height: "25",
                  color: train.braking
                    ? "red"
                    : train.position === 100
                    ? "lightblue"
                    : train.rerouted && train.speed < 0
                    ? "#fad002"
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
