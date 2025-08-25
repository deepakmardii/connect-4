import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Board from "./Board";
import Controls from "./Controls";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useLocation } from "react-router";

const WS_URL = "http://localhost:3000"; // socket.io uses http(s) not ws(s)

type GameUpdate = {
    board: number[][];
    currentTurn: number | null;
    winner: number | null;
    isDraw: boolean;
};

const Game: React.FC = () => {
    const [board, setBoard] = useState<number[][]>(Array.from({ length: 6 }, () => Array(7).fill(0)));
    const [currentTurn, setCurrentTurn] = useState<number | null>(0);
    const [winner, setWinner] = useState<number | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameCode, setGameCode] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const location = useLocation();

    useEffect(() => {
        const socket = io(WS_URL);
        socketRef.current = socket;

        socket.on("gameCreated", (data: { gameCode: string }) => {
            setGameCode(data.gameCode);
        });

        socket.on("gameUpdate", (update: GameUpdate) => {
            setBoard(update.board);
            setCurrentTurn(update.currentTurn);
            setWinner(update.winner);
            setIsDraw(update.isDraw);
        });

        socket.on("joinedGame", (data: { gameCode: string }) => {
            setGameCode(data.gameCode);
        });

        // Parse query params
        const params = new URLSearchParams(location.search);
        if (params.get("host") === "1") {
            socket.emit("createGame");
        } else if (params.get("code")) {
            socket.emit("joinGame", params.get("code"));
        }

        return () => {
            socket.disconnect();
        };
    }, [location.search]);

    const handleDrop = (col: number) => {
        if (!gameCode || !socketRef.current) return;
        socketRef.current.emit("makeMove", { gameCode, column: col });
    };

    const handleRestart = () => {
        if (!gameCode || !socketRef.current) return;
        socketRef.current.emit("restartGame", gameCode);
    };

    const handleLeave = () => {
        if (!gameCode || !socketRef.current) return;
        socketRef.current.emit("leaveGame", gameCode);
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-500 via-yellow-400 to-cyan-400 animate-gradient-x">
            {/* Confetti SVG overlay */}
            <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-60" style={{ zIndex: 0 }} aria-hidden="true">
                <defs>
                    <pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="4" fill="#fff176" />
                        <rect x="25" y="25" width="6" height="6" fill="#f50057" rx="2" />
                        <circle cx="30" cy="12" r="3" fill="#00e676" />
                        <rect x="5" y="28" width="5" height="5" fill="#2979ff" rx="2" />
                        <circle cx="20" cy="35" r="2" fill="#ff9100" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#confetti)" />
            </svg>
            <div className="relative z-10 w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">Game Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {gameCode && (
                            <div className="mb-4 flex items-center gap-2">
                                <strong>Game Code:</strong>
                                <span className="font-mono">{gameCode}</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigator.clipboard.writeText(gameCode)}
                                        >
                                            Copy
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy to clipboard</TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                        <div className="flex flex-col items-center gap-4">
                            <Board board={board} onDrop={handleDrop} disabled={!!winner || isDraw} />
                            <div className="w-full flex justify-center">
                                {winner ? (
                                    <Alert variant="default" className="w-fit">
                                        <AlertTitle>Winner</AlertTitle>
                                        <AlertDescription>Player {winner}</AlertDescription>
                                    </Alert>
                                ) : isDraw ? (
                                    <Alert variant="default" className="w-fit">
                                        <AlertTitle>Draw!</AlertTitle>
                                    </Alert>
                                ) : (
                                    <span>Current Turn: Player {currentTurn! + 1}</span>
                                )}
                            </div>
                            <Controls onRestart={handleRestart} onLeave={handleLeave} disabled={false} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Game;