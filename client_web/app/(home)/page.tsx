"use client";

import React from "react";
import Board from "./components/board";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/gameContext";

const Page = () => {
  const { startConnection, disconnect } = useGame(); // <-- get it from context

  return (
    <div className="w-[70%] m-auto max-h-[85vh] align-middle self-center">
      <div className="grid grid-cols-3 gap-4">

        <div className="w-full col-span-2 max-h-[70vh]">
          <Board />
        </div>

        {/* SIDE PANEL */}
        <div className="w-full h-[70vh] bg-slate-50 rounded-xl shadow">
          <div className="w-full p-8 flex flex-col py-2">
            <header>
              <h1 className="text-center text-2xl border-b pb-2">
                Play a game
              </h1>
            </header>

            <section className="w-full py-4">

              {/* CREATE GAME BUTTON */}
              <Button
                variant="default"
                className="w-full"
                onClick={() => startConnection("/game/1")}
              >
                Create Game
              </Button>

              <div className="w-full py-1" />

              {/* JOIN GAME — you can change path */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => startConnection("/game/1")}
              >
                Join Game 
              </Button>
                            <Button
                variant="outline"
                className="w-full"
                onClick={() => startConnection("/game/2")}
              >
                Join Game2
              </Button>
                            <Button
                variant="outline"
                className="w-full"
                onClick={() => {disconnect()}}
              >
                Disconnect
              </Button>

            </section>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
