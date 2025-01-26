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
        const hotels= await Hotel.find({ userId: req.userId }).sort({ createdAt: -1 })
        
        res.status(200).json(hotels);

    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }

};


const GetHotel= async(req:Request,res:Response) => {

    const id = req.params.id.toString();

    try {
        const hotel = await  Hotel.findOne({
        _id: id,
        userId: req.userId,
        });

        res.status(200).json(hotel)

    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }

};


const EditHotel =async(req:Request,res:Response): Promise<void> => {


    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel= await Hotel.findOneAndUpdate(
            {
                _id: req.params.hotelId,
                userId: req.userId,
            },
            updatedHotel,
            { new: true }
        );

        if(!hotel){
            res.status(404).json({ message: "Hotel not found" });
            return;
        };

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [
          ...updatedImageUrls,
          ...(updatedHotel.imageUrls || [])
        ];
        
        await hotel.save();

        res.status(201).json(hotel);

        
    } catch (error) {
        res.status(500).json({ message: "Something went throw" });
    }

};

const DeleteImages =async(req:Request,res:Response) : Promise<void> => {

    const { imageUrl } = req.body; 

    try {
    const hotel= await Hotel.findOne(
        {
            _id: req.params.hotelId,
            userId: req.userId,
        }
    );
    if(!hotel){
        res.status(404).json({message:"not found any hotels"})
        return;
    };
    
    if (!hotel.imageUrls.includes(imageUrl)) {
        res.status(400).json({ message: "Image URL not found in the hotel" });
        return;
    }

      hotel.imageUrls = hotel.imageUrls.filter(image => image !== imageUrl);


      await hotel.save();

    res.status(200).json({message:"Deleted success!"})
    
   } catch (error) {
    res.status(500).json({ message: "Something went throw" });
   }
};





export {
    AddHotels,
    GetMyHotels,
    GetHotel,
    EditHotel,
    DeleteImages
}