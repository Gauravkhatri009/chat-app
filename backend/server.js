import express from 'express';
import authRoutes from "./src/routes/authRoute.js";
import messageRoutes from "./src/routes/messageRoute.js"
import dotenv from "dotenv";
import { connectDB } from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { app, server } from './src/config/socket.js';

import path from 'node:path';

dotenv.config();
const PORT = process.env.PORT

const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); //this will allow us to extract json data out of the body
app.use(cookieParser()); //this will allowed you to parse the cookies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}



server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    connectDB()
})