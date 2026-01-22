"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/context/gameContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Position = [number, number];

const Board = () => {
  const {
    board,
    sendMove,
    requestBoard,
    requestLegalMoves,
    legalMoves,
  } = useGame();

  const [selectedFrom, setSelectedFrom] = useState<Position | null>(null);

  useEffect(() => {
    console.log("board", board);
  }, [board]);

  function handleSelect(pos: Position) {
    const [row, col] = pos;
    const piece = board[row][col];

    // No FROM selected yet → selecting a piece
    if (!selectedFrom) {
      if (!piece) return; // can't select empty square
      setSelectedFrom(pos);
      requestLegalMoves(pos);
      return;
    }

    // FROM already selected → check if move is legal
    const isLegal = legalMoves.some(
      ([r, c]) => r === row && c === col
    );

    if (isLegal) {
      sendMove(selectedFrom, pos); // 🔥 instant move
      setSelectedFrom(null);
      return;
    }

    // Clicking another piece → reselect
    if (piece) {
      setSelectedFrom(pos);
      requestLegalMoves(pos);
      return;
    }

    // Clicking invalid empty square → reset
    setSelectedFrom(null);
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Button variant={"default"} onClick={requestBoard}>Refresh Board</Button> 
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "75%",
          aspectRatio: "1",
        }}
      >
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              width: "100%",
              height: "12.5%",
            }}
          >
            {row.map((square, colIndex) => {
              const isSelected =
                selectedFrom &&
                selectedFrom[0] === rowIndex &&
                selectedFrom[1] === colIndex;

              const isLegalMove = legalMoves.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );

              return (
                <div
                  key={colIndex}
                  onClick={() =>
                    handleSelect([rowIndex, colIndex])
                  }
                  style={{
                    width: "12.5%",
                    height: "100%",
                    position: "relative",
                    backgroundColor:
                      (rowIndex + colIndex) % 2 === 0
                        ? "#eee"
                        : "#555",
                    border: isSelected
                      ? "3px solid yellow"
                      : "1px solid #333",
                    boxShadow: isLegalMove
                      ? "inset 0 0 10px green"
                      : "none",
                    cursor: "pointer",
                  }}
                >
                  {square && (
                    <Image
                      src={`/pieces/neo/${square}.png`}
                      alt="piece"
                      fill
                      style={{
                        objectFit: "contain",
                        padding: "8%",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
