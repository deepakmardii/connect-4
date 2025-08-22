// 4 Connect backend with Express + Socket.IO + in-memory game creation

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }
});
const PORT = process.env.PORT || 3000;

// In-memory game storage
type GameState = {
    board: number[][]; // 6 rows x 7 cols
    players: string[]; // socketIds
    currentTurn: number; // 0 or 1
};
const games: Record<string, GameState> = {};

// Utility: generate unique 6-char alphanumeric code
function generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return games[code] ? generateGameCode() : code;
}

app.get('/', (_req: express.Request, res: express.Response) => {
    res.send('4 Connect backend is running');
});

// Socket.IO logic
io.on('connection', (socket: import('socket.io').Socket) => {
    socket.on('createGame', () => {
        const gameCode = generateGameCode();
        games[gameCode] = {
            board: Array.from({ length: 6 }, () => Array(7).fill(0)),
            players: [socket.id],
            currentTurn: 0
        };
        socket.join(gameCode);
        socket.emit('gameCreated', { gameCode });
        console.log(`Game created: ${gameCode} by ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});