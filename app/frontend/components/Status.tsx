import Watch from "@/public/watch.svg";
import React, { useEffect } from "react";
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
  const [time, setTime] = React.useState<number>(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerStart) {
      interval = setInterval(() => {
        setTime(Date.now() - timerStart!);
      }, 20);
    }
    return () => clearInterval(interval);
  }, [timerStart]);

  return (
    <div className="h-8 text-lg text-white/80">
      {trainsRemaining === NUM_TRAINS && !duration && !timerStart ? (
        <div>
          <span className="text-[17px] text-white/60">
            Let's move all trains across as fast as we can...
          </span>
        </div>
      ) : duration ? (
        <div className="flex items-center justify-center gap-1 text-emerald-500">
          <Watch style={{ height: 20 }} />
          <span>{`All ${NUM_TRAINS} trains reached their destination in `}</span>
          <span className="mt-1 font-mono">{(duration / 1000).toFixed(3)}</span>
          <span> seconds!</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{`Waiting for ${trainsRemaining} trains to arrive...`}</span>
          <div className="flex items-center justify-center gap-0">
            <Watch style={{ height: 20 }} />
            <span className="mt-1 font-mono">{(time / 1000).toFixed(1)}s</span>
          </div>
        </div>
      )}
    </div>
  );
}
