import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import PostgresConnection from './DBConnection/PostgresConnection.js';
import router from './Routes/main.js';
import { initializePool, initializeTable } from './Models/qrcode.js';

const app = express();
const server = createServer(app);
const port = process.env.PORT;

app.use(cors({
    origin: ["http://localhost:5173", "https://qr-code-project-xi.vercel.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`--> ${req.method} ${req.originalUrl}`);
    next();
});

// Attach routes under /qrcode to match client calls
app.use('/project',router);

// Initialize DB & start server
(async () => {
    try {
        await PostgresConnection();
        initializePool();
        await initializeTable();

        server.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
})();

