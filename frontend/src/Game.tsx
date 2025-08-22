import React, { useEffect, useState, useRef } from "react";
import Board from "./Board";
import Controls from "./Controls";

// Minimal socket.io-client replacement using WebSocket for demo
const WS_URL = "ws://localhost:3000"; // Adjust if backend runs elsewhere

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
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(WS_URL);
        ws.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "gameCreated" && msg.data?.gameCode) {
                setGameCode(msg.data.gameCode);
            }
            if (msg.type === "gameUpdate") {
                const update: GameUpdate = msg.data;
                setBoard(update.board);
                setCurrentTurn(update.currentTurn);
                setWinner(update.winner);
                setIsDraw(update.isDraw);
            }
        };
        return () => ws.current?.close();
    }, []);

    const handleDrop = (col: number) => {
        // Send move to backend (replace with socket.io if available)
        ws.current?.send(JSON.stringify({ type: "makeMove", data: { column: col } }));
    };

    const handleRestart = () => {
        ws.current?.send(JSON.stringify({ type: "restartGame" }));
    };

    const handleLeave = () => {
        ws.current?.send(JSON.stringify({ type: "leaveGame" }));
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