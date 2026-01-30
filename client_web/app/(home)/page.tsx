"use client";

import React, { useEffect } from "react";
import Board from "./components/board";
import { useGame } from "@/context/gameContext";
import PregamePanel from "./components/pregamePanel";
import GamePanel from "./components/gamePanel";

const Page = () => {
  const { startConnection, connected } = useGame();

  const hasAutoJoined = React.useRef(false);

  useEffect(() => {
    if (hasAutoJoined.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const gameCode = urlParams.get("code");

    if (!gameCode) return;

    if (!/^[A-Z0-9]{6}$/.test(gameCode)) {
      console.error("[CLIENT] Invalid game code:", gameCode);
      return;
    }

    hasAutoJoined.current = true;
    startConnection(`/game/${gameCode}`);
  }, []); // 🚨 EMPTY deps on purpose

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-2 sm:p-4 lg:p-6 w-full">
      <div className="w-full lg:w-[85vw] xl:w-[75vw] mx-auto">
        {/* Header */}
        <header className="text-center mb-4 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-1 lg:mb-2">
            Chess
          </h1>
          {/* <p className="text-sm sm:text-base text-slate-600">Play chess with friends online</p> */}
        </header>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {/* Left Column - Game Board */}
          <div className="xl:col-span-8">
            <div className="w-full aspect-square max-h-[85vh] mx-auto">
              <Board />
            </div>
          </div>

          {/* Right Column - Game Controls */}
          <div className="xl:col-span-4">
            {connected ? <GamePanel /> : <PregamePanel />}
            {/* TODO: Add GamePanel component here when game is active */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
