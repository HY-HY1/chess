"use client";

import React, { createContext, useContext, useState } from "react";
import useWebSocket, {
  ChatMessage,
  MoveLogEntry,
} from "@/hooks/websocket/useWebsocket"


export type Tile = string | null;
export type BoardState = Tile[][];

interface GameContextValue {
  board: BoardState;
  legalMoves: [number, number][];
  moveLog: MoveLogEntry[];
  playerRole: "w" | "b" | "spectator" | null;
  gameOver: { winner: string; reason: string } | null;

  chatMessages: ChatMessage[];
  chatError: string | null;

  sendMove: (s: [number, number], e: [number, number]) => void;
  requestLegalMoves: (from: [number, number]) => void;
  sendChatMessage: (message: string) => void;
  resign: () => void;

  startConnection: (path: string) => void;
  disconnect: () => void;
  connected: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<BoardState>([]);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
  const [playerRole, setPlayerRole] =
    useState<"w" | "b" | "spectator" | null>(null);
  const [gameOver, setGameOver] =
    useState<{ winner: string; reason: string } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);

  const {
    connect,
    disconnect,
    connected,
    sendMove,
    requestLegalMoves,
    sendChatMessage,
    resign,
  } = useWebSocket({
    onBoardUpdate: setBoard,
    onMoveLogUpdate: setMoveLog,
    onLegalMovesUpdate: setLegalMoves,
    onChatMessage: (m) => setChatMessages((p) => [...p, m]),
    onChatHistory: setChatMessages,
    onChatError: setChatError,
    onRoleAssignment: setPlayerRole,
    onGameOver: (winner, reason) => setGameOver({ winner, reason }),
  });

    function startConnection(path: string) {
    // reset all states when joining a new game.
    
    setBoard([]);
    setLegalMoves([]);
    setMoveLog([]);
    setPlayerRole(null);
    setGameOver(null);
    setChatMessages([]);
    setChatError(null);

    connect(`ws://${process.env.NEXT_PUBLIC_SERVER_ADDRESS}:8765${path}`);
  }

  // Faulty function could be used in development
  // function startConnection(path: string) {
  //   connect(`ws://${process.env.NEXT_PUBLIC_SERVER_ADDRESS}:8765${path}`);
  // }

  return (
    <GameContext.Provider
      value={{
        board,
        legalMoves,
        moveLog,
        playerRole,
        gameOver,
        chatMessages,
        chatError,
        sendMove,
        requestLegalMoves,
        sendChatMessage,
        startConnection,
        resign,
        disconnect,
        connected,
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
