"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import useWebSocket from "@/hooks/websocket/useWebsocket";
import { ur } from "zod/v4/locales";

export type Tile = string | null;
export type BoardState = Tile[][];

interface GameContextValue {
  board: BoardState;
  legalMoves: [number, number][];
  sendMove: (s: [number, number], e: [number, number]) => void;
  requestBoard: () => void;
  requestLegalMoves: (from: [number, number]) => void;
  startConnection: (path: string) => void;
  wsUrl: string | null;
  connected: boolean;
  disconnect: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<BoardState>([]);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [wsUrl, setWsUrl] = useState<string | null>(null);

  // Give websocket callbacks ONCE
  const {
    connect,
    disconnect,
    connected,
    sendMove,
    requestBoard,
    requestLegalMoves,
  } = useWebSocket(setBoard, setLegalMoves);

  // Called when user clicks "Join Game" or "Create Game"
  function startConnection(path: string) {
    const url = `ws://31.127.38.182:8765${path}`;
    console.log("Starting WS at: ", url)
    setWsUrl(url);
    connect(url); // Connect only now (no callbacks needed)
  }

  return (
    <GameContext.Provider
      value={{
        board,
        legalMoves,
        sendMove,
        requestBoard,
        requestLegalMoves,
        startConnection,
        wsUrl,
        connected,
        disconnect
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
