import { type NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Track from "~/components/Track";

const httpPort = 3300;
const wsPort = 3333;
export interface TrainInfo {
  id: string;
  position: number;
  speed: number;
}

const Home: NextPage = () => {
  const backendUrl = process.env.BACKEND_HOST || "backend.railway.internal";
  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const queryClient = useQueryClient();

  console.log(process.env);
  const startTrain = async () => {
    const response = await axios.post(
      `http://${backendUrl}:${httpPort}/startTrain`
    );
    return response.data;
  };

  const mutation = useMutation(startTrain, {
    onSuccess: () => {
      queryClient.invalidateQueries(["trains"]);
    },
  });

  useEffect(() => {
    const ws = new WebSocket(`ws://${backendUrl}:${wsPort}`);

    ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.addEventListener("message", (event) => {
      const trainData = JSON.parse(event.data) as TrainInfo;

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
        <div className="flex h-full w-full flex-col gap-4 text-white">
          <h1>Train Status</h1>
          <button
            className="flex w-fit border px-2 py-1"
            onClick={() => {
              mutation.mutate();
            }}
          >
            Start Train
          </button>
          <Track trains={trains} />
        </div>
      </main>
    </>
  );
};

export default Home;
