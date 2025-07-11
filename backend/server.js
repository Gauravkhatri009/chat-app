import express from 'express';
import authRoutes from "./src/routes/authRoute.js";
import messageRoutes from "./src/routes/messageRoute.js"
import dotenv from "dotenv";
import { connectDB } from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT
app.use(express.json()); //this will allow us to extract json data out of the body
app.use(cookieParser()); //this will allowed you to parse the cookies

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB()
})