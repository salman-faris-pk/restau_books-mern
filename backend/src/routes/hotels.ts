import express from "express";
import { Searchhotel,GetSinglHotel } from "../controllers/hotel.ctrl"
import { param } from "express-validator";
import { validateRequest } from "../middlewares/validateMiddleware";


const router = express.Router();



router.get("/search",Searchhotel)
router.get("/:id",[param("id").notEmpty().withMessage("hotel Id is required")],validateRequest,GetSinglHotel)




export default router;