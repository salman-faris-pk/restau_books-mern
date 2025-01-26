import express from "express"
import { AddHotels,GetMyHotels,GetHotel,EditHotel,DeleteImages} from "../controllers/myHotel.ctrl"
import verifyToken from "../middlewares/auth";
import { body } from "express-validator";
import multer from "multer"


const router=express.Router();


const storage= multer.memoryStorage();
const upload= multer({
  storage:storage,
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});



router.post("/",verifyToken,[
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
 ],
 upload.array("imageFiles",6),
 AddHotels
);


router.get("/",verifyToken,GetMyHotels)

router.get("/:id",verifyToken,GetHotel)
router.delete("/images/:hotelId",verifyToken, DeleteImages);
router.put("/:hotelId",verifyToken,upload.array("imageFiles"),EditHotel)







export default router;