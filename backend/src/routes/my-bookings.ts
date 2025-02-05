import express, {Request,Response} from "express"
import verifyToken from "../middlewares/auth";
import Hotel from "../models/hotel";
const router=express.Router();



router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
      const hotels = await Hotel.aggregate([
        {
          $match: {
            bookings: { $elemMatch: { userId: req.userId } },
          },
        },
        {
          $project: {
            name: 1,
            city: 1,
            imageUrls: 1,
            country: 1,
  
            bookings: {
              $filter: {
                input: "$bookings",
                as: "booking",
                cond: { $eq: ["$$booking.userId", req.userId] },
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            city: 1,
            imageUrls: 1,
            country: 1,
  
            bookings: {
              $map: {
                input: "$bookings",
                as: "booking",
                in: {
                  checkIn: "$$booking.checkIn",
                  checkOut: "$$booking.checkOut", 
                  adultCount: "$$booking.adultCount", 
                  childCount: "$$booking.childCount", 
                },
              },
            },
          },
        },
      ]);
  
      res.status(200).json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Unable to fetch bookings" });
    }
  });
  

export default router;
