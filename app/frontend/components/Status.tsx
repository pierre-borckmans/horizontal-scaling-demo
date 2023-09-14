import Watch from "@/public/watch.svg";
import React from "react";
import { NUM_TRAINS } from "@/types/types";

type Props = {
  trainsRemaining: number;
  duration: number | null;
  timerStart: number | null;
};
export default function Status({
  trainsRemaining,
  duration,
  timerStart,
}: Props) {
  return (
    <div className="text-lg text-white/80">
      {trainsRemaining === NUM_TRAINS && !duration && !timerStart ? (
        <div>
          <span className="text-[17px] text-white/60">
            Let's move all trains across as fast as we can...
          </span>
        </div>
      ) : duration ? (
        <div className="flex items-center gap-1 text-emerald-500">
          <Watch style={{ height: 20 }} />
          <span>{`All ${NUM_TRAINS} trains reached their destination in ${(
            duration / 1000
          ).toFixed(3)} seconds!`}</span>
        </div>
      ) : (
        <div>
          <span>{`Waiting for ${trainsRemaining} trains to arrive...`}</span>
        </div>
      )}
    </div>
  );
}
