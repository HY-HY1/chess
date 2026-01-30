import { Button } from "@/components/ui/button";
import { useGame } from "@/context/gameContext";
import React from "react";
import GameChat from "./gamechat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sword, Plus, ChessQueen } from "lucide-react";
import { useRouter } from "next/navigation";

const GamePanel = () => {
  const { disconnect, moveLog, resign } = useGame();
  const lastMove = moveLog[moveLog.length - 1];
  const router = useRouter()
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            disconnect();
            router.push("/");
          }}
        >
          Disconnect
        </Button>
      </div>
      <div className="w-full h-[40vh] p-4 border rounded-lg">
        <h4 className="mb-2 text-sm font-medium">Movelog</h4>

        <ScrollArea className="h-[35vh] pr-2">
          <div className="space-y-1 text-sm grid grid-cols-2 gap-2">
            {/* Headers */}
            <p className="font-mono text-xs">
              White <Separator className="mt-1" />
            </p>
            <p className="font-mono text-xs">
              Black <Separator className="mt-1" />
            </p>

            {/* Moves */}
            {moveLog.map((m, i) => (
              <div key={i} className="flex gap-2 font-mono text-xs">
                <span className="text-gray-400 w-6">
                  {i % 2 === 0 ? `${i / 2 + 1}.` : ""}
                </span>

                <span>{m.piece.toUpperCase()}</span>
                <span>{m.algebraicFrom}</span>
                <span>→</span>
                <span>{m.algebraicTo}</span>

                {m.capture && <Sword size={14} />}
                {m.promotion && (
                  <span>
                    <ChessQueen size={14} />
                  </span>
                )}
                {m.check && !m.checkmate && <span>Check</span>}
                {m.checkmate && <span>Checkmate</span>}
              </div>
            ))}

            {/* Game end marker */}
            {lastMove?.checkmate && (
              <div className="col-span-2 pt-2">
                <Separator />
                <p className="text-center text-xs font-mono text-red-400 mt-1">
                  Game Over {" - "}
                  {moveLog.length % 2 == 1 ? <>White wins</> : <>Black Wins</>}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <Button onClick={() => { resign() }}>Resign</Button>
      <div className="w-full h-40 max-h-64 pb-2">
        <GameChat />
      </div>
    </div>
  );
};

export default GamePanel;
