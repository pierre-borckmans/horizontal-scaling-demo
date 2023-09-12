import { type NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const backendUrl = "localhost";
const httpPort = 3300;
const wsPort = 3333;
interface TrainInfo {
  id: string;
  position: number;
  speed: number;
}
const startTrain = async () => {
  const response = await axios.post(
    `http://${backendUrl}:${httpPort}/startTrain`
  );
  return response.data;
};
const Home: NextPage = () => {
  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const queryClient = useQueryClient();

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
        <title>Railway World Trip</title>
        <link rel="icon" href="/international.png" />
      </Head>

      <main
        className="flex min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pb-8 pt-4 lg:h-screen"
        style={{
          backgroundImage: `linear-gradient(
            140deg,
            hsl(240deg 46% 37%) 0%,
            hsl(280deg 49% 38%) 36%,
            hsl(311deg 56% 41%) 59%,
            hsl(328deg 63% 50%) 76%,
            hsl(342deg 87% 59%) 87%,
            hsl(358deg 100% 67%) 94%,
            hsl(17deg 100% 64%) 99%,
            hsl(33deg 100% 59%) 101%,
            hsl(46deg 100% 51%) 101%,
            hsl(55deg 100% 50%) 100%
        )`,
        }}
      >
        {" "}
        <div className="App">
          <h1>Train Status</h1>
          <button
            className="border px-2 py-1"
            onClick={() => mutation.mutate()}
          >
            Start Train
          </button>
          <ul>
            {trains.map((train) => (
              <li key={train.id}>
                ID: {train.id}, Position: {train.position}%, Speed:{" "}
                {train.speed}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;
