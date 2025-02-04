import express from "express";
import { Searchhotel,GetSinglHotel,StripePaymentIntent,BookTheHotel} from "../controllers/hotel.ctrl"
import { param } from "express-validator";
import { validateRequest } from "../middlewares/validateMiddleware";
import verifyToken from "../middlewares/auth";



const router = express.Router();


router.get("/search",Searchhotel)
router.get("/:id",[param("id").notEmpty().withMessage("hotel Id is required")],validateRequest,GetSinglHotel)
router.post("/:hotelId/bookings/payment-intent",verifyToken,StripePaymentIntent)
router.post("/:hotelId/bookings",verifyToken,BookTheHotel)


export default router;