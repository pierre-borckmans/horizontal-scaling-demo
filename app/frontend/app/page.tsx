"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import Track from "../components/Track";
import Station from "../public/station.svg";
import Watch from "../public/watch.svg";
import { Gage } from "@/components/Gage";
import Title from "@/components/Title";
import Rails from "@/public/rails.svg";

export type Msg = {
  removed?: string;
  track?: string;
  train?: TrainInfo;
};

export type TrainInfo = {
  id: string;
  position: number;
  speed: number;
  braking: boolean;
  track: string;
};

export default function Home() {
  // const backendUrl = "localhost";
  const backendUrl =
    process.env.NODE_ENV === "development"
      ? "localhost"
      : "horizontal-scaling.up.railway.app";
  const wsProtocol = process.env.NODE_ENV === "development" ? "ws" : "wss";
  const httpProtocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const queryClient = useQueryClient();

  const startTrain = async () => {
    const response = await axios.post(
      `${httpProtocol}://${backendUrl}/startTrain`
    );
    return response.data;
  };

  const mutation = useMutation(startTrain, {
    onSuccess: () => {
      queryClient.invalidateQueries(["trains"]);
    },
  });

  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (timerStart && Date.now() - timerStart > 800 && trains.length === 0) {
      setDuration(Date.now() - timerStart);
      setTimerStart(null);
    }
  }, [timerStart, trains.length]);

  useEffect(() => {
    console.log("Connecting to WebSocket");
    let ws = new WebSocket(`${wsProtocol}://${backendUrl}/ws`);
    // const ws = new WebSocket(`ws://localhost:${httpPort}/ws`);

    ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setTimeout(
        () => (ws = new WebSocket(`${wsProtocol}://${backendUrl}/ws`))
      );
    });

    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data) as Msg;

      if (msg.track) {
        setTracks((prevTracks) => {
          return [...prevTracks.filter((t) => t !== msg.track!), msg.track!];
        });
      }

      if (msg.removed) {
        setTracks((prevTracks) => {
          return [...prevTracks.filter((t) => t !== msg.removed!)];
        });
      }

      if (!msg.train) {
        return;
      }

      const trainData = msg.train as TrainInfo;
      trainData.track = msg.track!;

      setTrains((prevTrains) => {
        const existingTrainIndex = prevTrains.findIndex(
          (train) => train.id === trainData.id
        );

        if (existingTrainIndex >= 0) {
          const updatedTrains = [...prevTrains];
          updatedTrains[existingTrainIndex] = trainData;
          return updatedTrains;
        }

        return [...prevTrains, trainData];
      });

      setTimeout(() => {
        if (trainData.position === 100) {
          console.log("TRAIN ARRIVED");
          setTrains((prevTrains) => {
            return prevTrains.filter((train) => train.id !== trainData.id);
          });
        }
      }, 1000);
    });

    return () => {
      ws.close();
    };
  }, []);

  const trainsInTransit = trains.filter((t) => t.position < 100).length;
  const trainsBraking = trains.filter((t) => t.braking).length;

  return (
    <>
      <Head>
        <title>Railway Horizontal Scaling</title>
        <link rel="icon" href="/train1.svg" />
      </Head>

      <main
        className="flex h-fit min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pb-8 pt-8"
        style={{
          backgroundColor: "rgb(19, 17, 28)",
          backgroundImage: `linear-gradient(
              327.21deg, 
              rgba(33, 0, 75, 0.24) 3.65%, 
              rgba(60, 0, 136, 0) 40.32%
            ), 
            linear-gradient(
              245.93deg, 
              rgba(209, 21, 111, 0.16) 0%, 
              rgba(209, 25, 80, 0) 36.63%
            ), 
            linear-gradient(
              147.6deg, 
              rgba(58, 19, 255, 0) 29.79%, 
              rgba(98, 19, 255, 0.01) 85.72%
            )`,
        }}
      >
        <Title />
        <div className="flex h-full min-h-[800px] w-full flex-col items-center gap-4 overflow-y-scroll text-white">
          <div className="flex items-center gap-4">
            <button
              className="flex w-fit rounded border border-[#3e7698] px-2 py-1 text-[#3e7698] transition-all duration-100 hover:bg-gray-700 hover:text-[#4f98c4] hover:text-white"
              onClick={() => {
                if (trains.filter((t) => t.position < 100).length === 0) {
                  setTimerStart(Date.now());
                }
                setDuration(null);
                mutation.mutate();
              }}
            >
              Start 1 Train
            </button>
            <button
              className="flex w-fit rounded border border-[#3e7698] px-2 py-1 text-[#3e7698] transition-all duration-100 hover:bg-gray-700 hover:text-[#4f98c4] hover:text-white"
              onClick={() => {
                if (trains.filter((t) => t.position < 100).length === 0) {
                  setTimerStart(Date.now());
                }
                setDuration(null);
                for (let i = 0; i < 10; i++) {
                  mutation.mutate();
                }
              }}
            >
              Start 10 Trains
            </button>
          </div>
          <div className="text-lg text-white/80">
            {trainsInTransit === 0 && !duration && !timerStart ? (
              <div>
                <span className="italic text-white/70">
                  Let's move some trains!
                </span>
              </div>
            ) : duration ? (
              <div className="flex items-center gap-1">
                <Watch style={{ height: 20 }} />
                <span>{`Duration: ${(duration / 1000).toFixed(
                  3
                )} seconds`}</span>
              </div>
            ) : (
              <div>
                <span>
                  {`Waiting for ${trainsInTransit} trains to arrive...`}
                </span>
              </div>
            )}
          </div>

          <div className="mb-[-30px] flex w-32 items-center gap-1">
            <Gage
              value={
                trainsInTransit
                  ? 100 - (trainsBraking / trains.length) * 100
                  : 0
              }
              refreshTime={Date.now()}
            />
          </div>

          <div className="flex w-full items-center text-[#3e7698]">
            <div className="flex w-fit flex-col items-center pl-10 pr-20">
              <div className="relative ml-[-8px] mt-2 flex">
                <Station
                  style={{
                    height: 80,
                    opacity: 0.7,
                  }}
                  className="absolute left-0 top-0 scale-110 blur-[12px]"
                />
                <Station
                  style={{
                    height: 80,
                  }}
                />
              </div>
            </div>
            <div className="flex h-full w-full flex-col">
              {tracks.sort().map((track, index) => (
                <Track
                  totalTracks={tracks.length}
                  ip={track}
                  trains={trains.filter((train) => train.track === track)}
                  key={track}
                  index={index}
                />
              ))}
            </div>
            <div className="flex w-fit flex-col items-center pl-10 pr-20">
              <div className="relative ml-[-8px] mt-2 flex">
                <Station
                  style={{
                    height: 80,
                    opacity: 0.7,
                  }}
                  className="absolute left-0 top-0 scale-110 blur-[16px]"
                />
                <Station
                  style={{
                    height: 80,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
