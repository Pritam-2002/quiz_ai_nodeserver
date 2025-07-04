import express from "express";
import { ConnectDb } from "./config/dbConfig/DbConnection";
import app1 from "./routes/index.routes";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
ConnectDb();
app.use("/api", app1);

app.get("/", (req, res) => {
    res.send("Hello World");
});
const httpServer = app.listen(7000, () =>
    console.log(" Server Started on Port 7000")
);
