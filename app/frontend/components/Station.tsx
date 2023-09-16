import Train2 from "@/public/train2.svg";
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
      <div className="flex">
        <StationIcon2
          className="hidden lg:flex"
          style={{
            height: 120,
          }}
        />
      </div>
      <div className="mt-[122px] flex w-[35px] flex-wrap justify-center gap-x-2 transition-all duration-1000 lg:mt-0 lg:w-[140px]">
        {[...Array(Math.max(0, NUM_TRAINS))].map((_, i) => (
          <Train2
            className="h-[18px] w-[28px] transition-all duration-1000 lg:h-[20px] lg:w-[40px]"
            style={{
              color: i < trains ? "#62abd9" : "#fff2",
              scale: i < trains ? 1.1 : 1,
            }}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
