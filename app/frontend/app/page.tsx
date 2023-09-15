"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import { Gage } from "@/components/Gage";
import Title from "@/components/Title";
import Track from "@/components/Track";
import Station from "@/components/Station";
import Status from "@/components/Status";
import { Msg, NUM_TRAINS, TrainInfo } from "@/types/types";
import "../styles/app.css";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "localhost"
    : "horizontal-scaling.up.railway.app";
const WS_PROTOCOL = process.env.NODE_ENV === "development" ? "ws" : "wss";
const HTTP_PROTOCOL = process.env.NODE_ENV === "development" ? "http" : "https";

export default function Home() {
  const startTrain = async () => {
    const response = await axios.post(
      `${HTTP_PROTOCOL}://${BACKEND_URL}/startTrain`
    );
    return response.data;
  };

  const mutation = useMutation(startTrain);

  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [trainsRemaining, setTrainsRemaining] = useState<number>(NUM_TRAINS);
  const [trainsInTransit, setTrainsInTransit] = useState<number>(0);

  useEffect(() => {
    if (trainsRemaining === 0 && timerStart) {
      setDuration(Date.now() - timerStart);
      setTimerStart(null);
    }
  }, [timerStart, trainsRemaining]);

  useEffect(() => {
    console.log("Connecting to WebSocket");
    let ws = new WebSocket(`${WS_PROTOCOL}://${BACKEND_URL}/ws`);
    // const ws = new WebSocket(`ws://localhost:${httpPort}/ws`);

    ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setTimeout(
        () => (ws = new WebSocket(`${WS_PROTOCOL}://${BACKEND_URL}/ws`))
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

      if (trainData.position === 100) {
        setTrainsRemaining((prev) => prev - 1);
      }

      setTimeout(() => {
        if (trainData.position === 100) {
          setTrains((prevTrains) => {
            return prevTrains.filter((train) => train.id !== trainData.id);
          });
        }
      }, 500);
    });

    return () => {
      ws.close();
    };
  }, []);

  const trainsBraking = trains.filter((t) => t.braking).length;

  return (
    <>
      <Head>
        <title>Railway Horizontal Scaling</title>
        <link rel="icon" href="/train1.svg" />
      </Head>

      <main
        className="app flex h-fit min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pt-8"
        style={{}}
      >
        <Title />

        <Status
          trainsRemaining={trainsRemaining}
          duration={duration}
          timerStart={timerStart}
        />

        <div className="mt-5 flex h-full min-h-[800px] w-full flex-col items-center gap-2 overflow-y-scroll text-white">
          <div className="flex items-center gap-4">
            {trainsRemaining > 0 ? (
              <>
                <button
                  className="flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
                  disabled={trainsInTransit >= NUM_TRAINS}
                  onClick={() => {
                    if (!timerStart) {
                      setTimerStart(Date.now());
                    }
                    if (NUM_TRAINS - trainsInTransit <= 0) {
                      return;
                    }
                    setTrainsInTransit((old) => old + 1);
                    mutation.mutate();
                  }}
                >
                  Start {Math.min(NUM_TRAINS - trainsInTransit, 1)} Train
                </button>
                <button
                  disabled={trainsInTransit >= NUM_TRAINS}
                  className="flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
                  onClick={() => {
                    if (!timerStart) {
                      setTimerStart(Date.now());
                    }

                    for (
                      let i = 0;
                      i < Math.min(NUM_TRAINS - trainsInTransit, 10);
                      i++
                    ) {
                      setTrainsInTransit((old) => old + 1);
                      mutation.mutate();
                    }
                  }}
                >
                  Start {Math.min(NUM_TRAINS - trainsInTransit, 10)} Trains
                </button>
              </>
            ) : null}
            <button
              className="flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
              disabled={trains.filter((t) => t.position < 100).length > 0}
              onClick={() => {
                setTimerStart(null);
                setDuration(null);
                setTrainsRemaining(NUM_TRAINS);
                setTrainsInTransit(0);
              }}
            >
              Try again!
            </button>
          </div>

          <div className="flex w-full justify-between gap-10 px-10 text-[#519ac6]">
            <Station trains={NUM_TRAINS - trainsInTransit} />
            <div className="flex h-full w-full flex-col">
              <div className="mt-9 flex h-10 w-full items-center justify-center">
                <div className="flex w-40">
                  <Gage
                    value={
                      trains.length && trainsInTransit
                        ? 100 - (trainsBraking / trains.length) * 100
                        : 0
                    }
                    refreshTime={Date.now()}
                  />
                </div>
              </div>

              <div className="mt-9 flex h-full w-full flex-col">
                {[
                  ...tracks,
                  // ...tracks,
                  // ...tracks,
                  // ...tracks,
                  // ...tracks,
                  // ...tracks,
                ]
                  .sort()
                  .map((track, index) => (
                    <Track
                      totalTracks={tracks.length}
                      ip={track}
                      trains={trains.filter((train) => train.track === track)}
                      key={track}
                      index={index}
                    />
                  ))}
              </div>
            </div>
            <Station trains={NUM_TRAINS - trainsRemaining} />
          </div>
        </div>
      </main>
    </>
  );
}
