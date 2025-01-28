import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose"
import userRoutes from "./routes/user.route";
import myHotelRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import CronJob from "./cron"
import { v2 as cloudinary} from "cloudinary"
import hotelRoutes from "./routes/hotels";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
app.use("/api/my-hotels",myHotelRoutes)
app.use("/api/hotels",hotelRoutes)


app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


  app.listen(7000, () => {
    console.log("server running on http://localhost:7000");
  });