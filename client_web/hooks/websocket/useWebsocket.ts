import { useCallback, useRef, useState } from "react";
import { BoardState } from "@/context/gameContext";

export default function useWebSocket(
  onBoardUpdate: (board: BoardState) => void,
  onLegalMovesUpdate?: (moves: [number, number][]) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // -------------------------------
  // CONNECT WHEN USER DECIDES
  // -------------------------------
  const connect = useCallback((url: string) => {
    if (socketRef.current) {
      console.warn("WebSocket already connected");
      return;
    }

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WS Connected:", url);
      ws.send(JSON.stringify({ type: "board_update" }));
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("WS Disconnected");
      socketRef.current = null;
      setConnected(false);
    };

    ws.onerror = (err) => console.error("WS Error:", err);

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return console.error("Invalid JSON from server:", event.data);
      }

      if (data.type === "board_update") onBoardUpdate(data.board);
      if (data.type === "legal_moves" && onLegalMovesUpdate) {
        onLegalMovesUpdate(data.moves);
      }
    };
  }, [onBoardUpdate, onLegalMovesUpdate]);

  // -------------------------------
  // SEND FUNCTIONS
  // -------------------------------
  function sendMove(start: [number, number], end: [number, number]) {
    socketRef.current?.send(
      JSON.stringify({ type: "move", start, end })
    );
  }

  function requestBoard() {
    socketRef.current?.send(JSON.stringify({ type: "board_state" }));
  }

  function requestLegalMoves(from: [number, number]) {
    socketRef.current?.send(
      JSON.stringify({ type: "legal_moves", start: from })
    );
  }

  // -------------------------------
  // CLEANUP
  // -------------------------------
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  return {
    connect,
    disconnect,
    connected,
    sendMove,
    requestBoard,
    requestLegalMoves,
  };
}
