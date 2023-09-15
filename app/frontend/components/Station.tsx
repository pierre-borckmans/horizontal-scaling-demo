import Train1 from "@/public/train2.svg";
import React from "react";
import StationIcon2 from "../public/station2.svg";
import { NUM_TRAINS } from "@/types/types";

type Props = {
  trains: number;
};
export default function Station({ trains }: Props) {
  return (
    <div
      className={`relative flex h-[300px] w-fit flex-col items-center gap-4
    ${trains === NUM_TRAINS ? "animate-poke" : trains > 0 ? "" : "    "}
    `}
    >
      <StationIcon2
        style={{
          height: 120,
        }}
      />
      <div className="flex w-[140px] flex-wrap justify-center gap-2 transition-all duration-1000">
        {[...Array(Math.max(0, NUM_TRAINS))].map((_, i) => (
          <Train1
            className="transition-all duration-1000"
            style={{
              width: 40,
              height: 20,
              color: i < trains ? "#62abd9" : "#fff2",
              scale: i < trains ? 1.1 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
