import express from "express";
import { Searchhotel,GetSinglHotel,StripePaymentIntent,GetAlldatesStartToEnd,fetchAllWishlistByUser,BookTheHotel,getLatesthotels,AddToWishlist,
        isHotelInWishlist,removeFromWishlist,checkDateAvailability} from "../controllers/hotel.ctrl"
import { param } from "express-validator";
import { validateRequest } from "../middlewares/validateMiddleware";
import verifyToken from "../middlewares/auth";



const router = express.Router();

router.get("/",getLatesthotels)
router.get("/search",Searchhotel)
router.get("/:hotelId/dates",GetAlldatesStartToEnd);
router.get("/wishlist",verifyToken,fetchAllWishlistByUser)
router.post("/wishlist/:hotelId",verifyToken,AddToWishlist)
router.get("/wishlist/:hotelId",verifyToken,isHotelInWishlist)
router.delete("/wishlist/:hotelId",verifyToken,removeFromWishlist)
router.get("/:id",[param("id").notEmpty().withMessage("hotel Id is required")],validateRequest,GetSinglHotel)
router.post("/:hotelId/bookings",verifyToken,BookTheHotel)
router.post("/:hotelId/bookings/payment-intent",verifyToken,StripePaymentIntent)
router.post("/availability",verifyToken,checkDateAvailability);


export default router;