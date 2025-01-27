import express from "express";
import { Searchhotel } from "../controllers/hotel.ctrl"


const router = express.Router();



router.get("/search",Searchhotel)







export default router;