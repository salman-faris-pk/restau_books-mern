import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/user.route";
import myHotelRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import CronJob from "./cron"
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings"
import rateLimit from "express-rate-limit"
import { connectToDatabase } from "./config/db";
import cloudinaryConfig from "./config/cloudinary";


const port=process.env.PORT || 7000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

CronJob.start();

cloudinaryConfig();

const app = express();
app.use(express.json());
app.use(limiter);
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
app.use("/api/my-bookings",bookingRoutes)



app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


connectToDatabase()
.then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch((error) => {
  console.error("Database connection failed", error);
  process.exit(1);
});