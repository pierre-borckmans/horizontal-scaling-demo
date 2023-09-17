import React, { useEffect, useState } from "react";
import { BACKEND_URL, HTTP_PROTOCOL, TrainInfo } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import TrainOnTrack from "@/components/TrainOnTrack";

type Props = {
  ip: string;
  trains: TrainInfo[];
  totalTracks: number;
  index: number;
  onBreak?: (index: number) => void;
  onRepair?: (index: number) => void;
  breakPoint?: number;
};

export default function Track({
  index,
  trains,
  ip,
  onBreak,
  onRepair,
  breakPoint,
}: Props) {
  const breakRef = React.useRef(breakPoint);
  const [repairing, setRepairing] = useState(false);
  useEffect(() => {
    if (breakRef.current && !breakPoint) {
      setRepairing(true);
      setTimeout(() => {
        breakRef.current = breakPoint;
        setRepairing(false);
      }, 750);
    } else {
      breakRef.current = breakPoint;
    }
  }, [breakPoint]);

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
      className="flex h-full w-full select-none flex-col items-center justify-center gap-2 pt-7 lg:px-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative flex h-[14px] w-full border-b-2 border-t-2 border-[#5bade0cc]"
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
            className="absolute right-0 top-[-40px] cursor-pointer text-xl transition-all hover:scale-125 lg:text-2xl"
            onClick={() => {
              breakTrackMutation.mutate();
            }}
          >
            💣
          </div>
        )}
        {hovered && breakPoint && (
          <div
            className="absolute right-0 top-[-40px] cursor-pointer text-xl transition-all hover:scale-125 lg:text-2xl"
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
              className="absolute top-[-12px] animate-shake text-3xl"
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

        <div
          className="absolute top-0 flex h-full bg-emerald-500/50 px-4"
          style={{
            transitionProperty: "opacity",
            transitionTimingFunction: "ease-out",
            transitionDuration: "0.5s",
            opacity: repairing ? 1 : 0,
            left: `${breakRef.current! + 1}%`,
            width: `${100 - 1 - breakRef.current!}%`,
          }}
        ></div>
        {repairing && (
          <>
            <div
              className="z-3 absolute top-[-38px] animate-left text-[40px]"
              style={{
                left: `${breakRef.current!}%`,
              }}
            >
              🚜
            </div>
          </>
        )}

        {trains.map((train) => (
          <TrainOnTrack train={train} trackIndex={index} key={train.id} />
        ))}
      </div>
      <span className="flex items-center gap-2 text-[#4f98c4]">
        <span className="font-bold">Track {index + 1}</span>
        <span className="text-xs"> [{ip}]</span>
      </span>
    </div>
  );
}
