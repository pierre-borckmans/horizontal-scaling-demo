import Title from "@/components/Title";
import Train from "@/public/train.svg";
import React from "react";

export default function Connecting() {
  return (
    <>
      <Title />
      <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-white">
        <span>Connecting to the backend...</span>
        <span
          className="flex w-full items-center justify-center text-center text-sm text-white/60 lg:text-lg"
          style={{ textWrap: "balance" }}
        >
          Make sure there are no other instances of this app running.
        </span>
        <div className="mt-4 flex animate-wiggle items-center justify-center gap-4">
          <Train className="h-4 lg:h-6" />
          <Train className="h-4 lg:h-6" />
          <Train className="h-4 lg:h-6" />
        </div>
      </div>
    </>
  );
}
