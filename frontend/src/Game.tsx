import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Board from "./Board";
import Controls from "./Controls";

const WS_URL = "http://localhost:3000"; // socket.io uses http(s) not ws(s)

type GameUpdate = {
    board: number[][];
    currentTurn: number | null;
    winner: number | null;
    isDraw: boolean;
};

import { useLocation } from "react-router";

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
        <div>
            <h2>Game Board</h2>
            {gameCode && (
                <div style={{ marginBottom: 12 }}>
                    <strong>Game Code:</strong> <span style={{ fontFamily: "monospace" }}>{gameCode}</span>
                    <button
                        style={{ marginLeft: 8 }}
                        onClick={() => navigator.clipboard.writeText(gameCode)}
                    >
                        Copy
                    </button>
                </div>
            )}
            <Board board={board} onDrop={handleDrop} disabled={!!winner || isDraw} />
            <div>
                {winner ? (
                    <span>Winner: Player {winner}</span>
                ) : isDraw ? (
                    <span>Draw!</span>
                ) : (
                    <span>Current Turn: Player {currentTurn! + 1}</span>
                )}
            </div>
            <Controls onRestart={handleRestart} onLeave={handleLeave} disabled={false} />
        </div>
    );
};

export default Game;