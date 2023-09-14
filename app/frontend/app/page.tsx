"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import Track from "../components/Track";

const httpPort = 4000;
const backendPort = 3300;

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

  return (
    <>
      <Head>
        <title>Railway Horizontal Scaling</title>
        <link rel="icon" href="/train1.svg" />
      </Head>

      <main
        className="flex min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pb-8 pt-4 lg:h-screen"
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
        <div className="flex w-full flex-col gap-4 text-white">
          <button
            className="flex w-fit border px-2 py-1"
            onClick={() => {
              setTimerStart(Date.now());
              setDuration(null);
              mutation.mutate();
            }}
          >
            Start 1 Train
          </button>
          <button
            className="flex w-fit border px-2 py-1"
            onClick={() => {
              setTimerStart(Date.now());
              setDuration(null);
              for (let i = 0; i < 10; i++) {
                mutation.mutate();
              }
            }}
          >
            Start 10 Trains
          </button>
          <div>Duration: {duration ? `${duration}ms` : "waiting..."}</div>
          <div className="flex w-full flex-col gap-10">
            {tracks.sort().map((track, index) => (
              <Track
                ip={track}
                trains={trains.filter((train) => train.track === track)}
                key={track}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
