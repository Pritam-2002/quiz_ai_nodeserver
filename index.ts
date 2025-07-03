import express from "express";
import { ConnectDb } from "./config/dbConfig/DbConnection";
// import app1 from "./routes/index.route";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

// Add CORS middleware before other middleware
app.use(cors());
app.use(express.json());
ConnectDb();
// app.use("/api", app1);

app.get("/", (req, res) => {
    res.send("Hello World");
});
const httpServer = app.listen(8000, () =>
    console.log(" Server Started on Port 8000")
);
