// Basic Express server setup in TypeScript

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req: express.Request, res: express.Response) => {
    res.send('4 Connect backend is running');
});

app.listen(PORT, () => {
    console.log(`Server listeninggg on port ${PORT}`);
});