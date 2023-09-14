import Train1 from "@/public/train2.svg";
import React from "react";
import StationIcon2 from "../public/station2.svg";

type Props = {
  trains: number;
};
export default function Station({ trains }: Props) {
  return (
    <div className="relative flex h-[300px] w-fit flex-col items-center gap-4">
      <StationIcon2
        style={{
          height: 120,
        }}
      />
      <div className="flex w-[140px] flex-wrap justify-center gap-1">
        {[...Array(Math.max(0, trains))].map(() => (
          <Train1 style={{ width: 40, height: 20 }} />
        ))}
      </div>
    </div>
  );
}
