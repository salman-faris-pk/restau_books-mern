import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose"
import userRoutes from "./routes/user.route";
import cookieParser from "cookie-parser";


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/user", userRoutes);


  
  app.listen(7000, () => {
    console.log("server running on localhost:7000");
  });