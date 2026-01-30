"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users } from "lucide-react";
import randomCode from "@/utils/game/randomCode";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/gameContext";

const PregamePanel = () => {
  const { startConnection, disconnect } = useGame();
  const [gameCode, setGameCode] = useState("");
  const router = useRouter();

  function CreateGame() {
    const rc = randomCode();
    router.push(`/?code=${rc}`);
    startConnection(`/game/${rc}`);
  }

  function JoinGame(gameCode: string) {
    // TODO: change startConnection() to only join existing games.
    router.push(`/?code=${gameCode}`);
    startConnection(`/game/${gameCode}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4 content-start">
      
      {/* Game Actions Card */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Game Lobby</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Create or join a game to start playing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="text-xs sm:text-sm">
                Create
              </TabsTrigger>
              <TabsTrigger value="join" className="text-xs sm:text-sm">
                Join
              </TabsTrigger>
            </TabsList>

            {/* Create Game Tab */}
            <TabsContent value="create" className="space-y-3">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600">
                  Start a new game and share the code with a friend
                </p>

                {/* TODO: Add game code display when created */}

                <Button
                  className="w-full gap-2 text-sm sm:text-base"
                  size="lg"
                  onClick={() => CreateGame()}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create New Game
                </Button>
              </div>
            </TabsContent>

            {/* Join Game Tab */}
            <TabsContent value="join" className="space-y-3">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600">
                  Enter a game code to join an existing game
                </p>

                <div className="space-y-2">
                  <Input
                    placeholder="Enter game code"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    className="font-mono text-center text-base sm:text-lg tracking-wider"
                    maxLength={6}
                  />
                </div>

                <Button
                  className="w-full gap-2 text-sm sm:text-base"
                  size="lg"
                  disabled={!gameCode.trim()}
                  onClick={() => JoinGame(gameCode)}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Join Game
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Join Section */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Quick Join</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Join a test game instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-xs sm:text-sm"
            onClick={() => startConnection("/game/1")}
          >
            <span className="font-mono mr-2">GAME1</span>
            <span className="text-muted-foreground">• Test Game 1</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-xs sm:text-sm"
            onClick={() => startConnection("/game/2")}
          >
            <span className="font-mono mr-2">GAME2</span>
            <span className="text-muted-foreground">• Test Game 2</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 text-xs sm:text-sm"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PregamePanel;