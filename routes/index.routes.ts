import express from "express";
import authRouter from "./auth/auth.route";
import questionrouter from "./questions/questions.routes";


const app1 = express();
app1.use("/auth", authRouter);
app1.use("/questions", questionrouter);


export default app1;
