import { useCallback, useRef, useState } from "react";
import { BoardState } from "@/context/gameContext";
import { useRouter } from "next/navigation";

// Chat message type definition
export interface ChatMessage {
  sender: "w" | "b" | "spectator";
  message: string;
  timestamp: number;
}

interface UseWebSocketCallbacks {
  onBoardUpdate: (board: BoardState) => void;
  onMoveLogUpdate: (moves: MoveLogEntry[]) => void;
  onLegalMovesUpdate?: (moves: [number, number][]) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onChatHistory?: (messages: ChatMessage[]) => void;
  onChatError?: (error: string) => void;
  onRoleAssignment?: (role: "w" | "b" | "spectator") => void;
  onGameOver?: (winner: string, reason: string) => void;
}

export interface MoveLogEntry {
  piece: string;
  from: [number, number];
  to: [number, number];
  algebraicFrom: string;
  algebraicTo: string;
  capture: boolean;
  captured_piece: string | null;
  check: boolean;
  checkmate: boolean;
  stalemate: boolean;
  promotion?: boolean;
  special?: string | null;
}

export default function useWebSocket(callbacks: UseWebSocketCallbacks) {
  const {
    onBoardUpdate,
    onMoveLogUpdate,
    onLegalMovesUpdate,
    onChatMessage,
    onChatHistory,
    onChatError,
    onRoleAssignment,
    onGameOver,
  } = callbacks;

  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  const isDisconnectingRef = useRef(false);

  // -------------------------------
  // CONNECT WHEN USER DECIDES
  // -------------------------------
  const connect = useCallback(
    (url: string) => {
      if (socketRef.current) {
        console.warn("[WS] WebSocket already connected");
        return;
      }

      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] Connected:", url);
        ws.send(JSON.stringify({ type: "board_update" }));
        ws.send(JSON.stringify({ type: "chat_history" }));
        setConnected(true);
      };

      ws.onclose = () => {
        console.log("[WS] Disconnected");
        socketRef.current = null;
        setConnected(false);
      };

      ws.onerror = (err) => console.error("[WS] Error:", err);

      ws.onmessage = (event) => {
        if (isDisconnectingRef.current) return; 
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return console.error("[WS] Invalid JSON from server:", event.data);
        }

        console.log("[WS] Message received:", data.type);

        // Route messages to appropriate callbacks
        switch (data.type) {
          case "board_update":
            onBoardUpdate(data.board);
            onMoveLogUpdate(data.movelog ?? []);
            break;

          case "legal_moves":
            if (onLegalMovesUpdate) {
              onLegalMovesUpdate(data.moves);
            }
            break;

          case "chat_message":
            // Single chat message broadcast
            if (onChatMessage) {
              onChatMessage({
                sender: data.sender,
                message: data.message,
                timestamp: data.timestamp,
              });
            }
            break;


          case "chat_history":
            // Chat history on connection
            if (onChatHistory) {
              onChatHistory(data.messages);
            }
            break;

          case "chat_error":
            // Chat validation error
            if (onChatError) {
              onChatError(data.error);
            }
            break;

          case "role":
            // Player role assignment
            if (onRoleAssignment) {
              onRoleAssignment(data.role);
            }
            break;

          case "game_over":
            // Game ended
            if (onGameOver) {
              onGameOver(data.winner, data.reason);
            }
            break;

          default:
            console.warn("[WS] Unknown message type:", data.type);
        }
      };
    },
    [
      onBoardUpdate,
      onMoveLogUpdate,
      onLegalMovesUpdate,
      onChatMessage,
      onChatHistory,
      onChatError,
      onRoleAssignment,
      onGameOver,
    ],
  );

  // -------------------------------
  // SEND FUNCTIONS - GAME
  // -------------------------------
  function sendMove(start: [number, number], end: [number, number]) {
    if (!socketRef.current) {
      console.error("[WS] Cannot send move: not connected");
      return;
    }
    socketRef.current.send(JSON.stringify({ type: "move", start, end }));
  }

  function requestBoard() {
    if (!socketRef.current) {
      console.error("[WS] Cannot request board: not connected");
      return;
    }
    socketRef.current.send(JSON.stringify({ type: "board_update" }));
  }

  function requestLegalMoves(from: [number, number]) {
    if (!socketRef.current) {
      console.error("[WS] Cannot request legal moves: not connected");
      return;
    }
    socketRef.current.send(
      JSON.stringify({ type: "legal_moves", start: from }),
    );
  }

  function resign() {
    if (!socketRef.current) {
      console.error("[WS] Cannot resign: not connected");
      return;
    }
    socketRef.current.send(JSON.stringify({ type: "resign" }));
  }

  // -------------------------------
  // SEND FUNCTIONS - CHAT
  // -------------------------------
  function sendChatMessage(message: string) {
    if (!socketRef.current) {
      console.error("[WS] Cannot send chat: not connected");
      return;
    }

    console.log("[WS] Sending chat message:", message);
    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        message: message,
      }),
    );
  }

  // -------------------------------
  // CLEANUP
  // -------------------------------
  const disconnect = useCallback(() => {
    console.log("[WS] Disconnecting...");
    isDisconnectingRef.current = true;

    socketRef.current?.close();
    socketRef.current = null;
  }, []);



  return {
    connect,
    disconnect,
    connected,
    sendMove,
    requestBoard,
    requestLegalMoves,
    sendChatMessage,
    resign
  };
}
