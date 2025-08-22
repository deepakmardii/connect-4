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
    socket.on('joinGame', (gameCode: string) => {
        const game = games[gameCode];
        if (!game) {
            socket.emit('joinError', { message: 'Game not found' });
            return;
        }
        if (game.players.length >= 2) {
            socket.emit('joinError', { message: 'Game full' });
            return;
        }
        game.players.push(socket.id);
        socket.join(gameCode);
        socket.emit('joinedGame', { gameCode, playerNumber: 2 });
        console.log(`Player 2 (${socket.id}) joined game ${gameCode}`);
    });
    socket.on('makeMove', (data: { gameCode: string; column: number }) => {
        const { gameCode, column } = data;
        const game = games[gameCode];
        if (!game) {
            socket.emit('moveError', { message: 'Game not found' });
            return;
        }
        const playerIndex = game.players.indexOf(socket.id);
        if (playerIndex === -1) {
            socket.emit('moveError', { message: 'Not a player in this game' });
            return;
        }
        if (playerIndex !== game.currentTurn) {
            socket.emit('moveError', { message: 'Not your turn' });
            return;
        }
        // Find lowest empty row in column
        let row = -1;
        for (let r = 5; r >= 0; r--) {
            if (game.board[r]?.[column] === 0) {
                row = r;
                break;
            }
        }
        if (row === -1) {
            socket.emit('moveError', { message: 'Column full' });
            return;
        }
        // Place disc (1 for Player 1, 2 for Player 2)
        if (row === -1 || !Array.isArray(game.board[row])) {
            socket.emit('moveError', { message: 'Invalid move' });
            return;
        }
        console.log('DEBUG: row', row, 'game.board[row]', game.board[row]);
        (game.board[row] as number[])[column] = playerIndex + 1;
        // Check win/draw
        const winner = checkWinner(game.board, row, column, playerIndex + 1);
        const isDraw = game.board.every(rowArr => rowArr.every(cell => cell !== 0));
        // Broadcast updated board
        io.to(gameCode).emit('gameUpdate', {
            board: game.board,
            currentTurn: winner || isDraw ? null : 1 - game.currentTurn,
            winner,
            isDraw
        });
        if (!winner && !isDraw) {
            game.currentTurn = 1 - game.currentTurn;
        }
    });

    // Win check helper
    function checkWinner(board: number[][], row: number, col: number, player: number): number | null {
        function count(dx: number, dy: number): number {
            let r = row + dx, c = col + dy, cnt = 0;
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r]?.[c] === player) {
                cnt++; r += dx; c += dy;
            }
            return cnt;
        }
        // Directions: horizontal, vertical, diag1, diag2
        const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (const dir of dirs) {
            const [dx, dy] = dir;
            if (
                typeof dx === 'number' &&
                typeof dy === 'number' &&
                1 + count(dx, dy) + count(-dx, -dy) >= 4
            ) return player;
        }
        return null;
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});