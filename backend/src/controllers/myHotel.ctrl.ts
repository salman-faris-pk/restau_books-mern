import { Request,Response } from "express";
import { HotelType } from "../types/types"
import cloudinary from "cloudinary";
import Hotel from "../models/hotel"



async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI);
      return res.url;
    });
  
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  };





const AddHotels=async(req: Request,res:Response) :Promise<void> => {
   
    try {
        const imageFiles= req.files as Express.Multer.File[];
        
        const imageUrls = await uploadImages(imageFiles);

        console.log("imageUrls",imageUrls)
        

        const newHotel: HotelType = {
            ...req.body,
            imageUrls,
            lastUpdated: new Date(), 
            userId: req.userId,
          };


        const hotel= await Hotel.create(newHotel);

        res.status(201).json(hotel)

    } catch (error) {
       res.status(500).json({ message: "Something went wrong" });
    }

};


const GetMyHotels = async(req:Request,res:Response): Promise<void> => {
    try {
        const hotels= await Hotel.find({ userId: req.userId });
        
        res.json(hotels);

    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }

};



export {
    AddHotels,
    GetMyHotels,
}