import express from "express";
import morgan from "morgan";
import { bookmarkdRouter } from "./data/router.js";
import cors from "cors";
import OpenAI from "openai";
import * as dotenv from "dotenv";

const app = express();
dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

app.use(cors({
        origin: '*' // Actually secure this at some point
    }));

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/", bookmarkdRouter);
app.use(express.static('public'));
app.use("/aiapi",bookmarkdRouter );

export default app;

