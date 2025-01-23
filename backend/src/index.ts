import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose"
import userRoutes from "./routes/user.route";
import cookieParser from "cookie-parser";
import path from "path";
import CronJob from "./cron"


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

CronJob.start();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/user", userRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


  app.listen(7000, () => {
    console.log("server running on http://localhost:7000");
  });