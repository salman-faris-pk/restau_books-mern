import { Request, Response} from "express";
import User from "../models/user"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import Hotel from "../models/hotel";
import emailVerifier from "../helpers/emailVerifier";




const Register=async(req:Request, res:Response): Promise<void> => {
   try {

    const isEmailValid= await emailVerifier.verifyEmail(req.body.email);
    
    if (isEmailValid === null) {
      res.status(503).json({
        message: "Could not verify email at this time. Please try again later.",
      });
      return;
    }
    
    if (isEmailValid === false) {
      res.status(400).json({
        message: "Invalid email address. Please provide a valid email.",
      });
      return;
    };
    
    let user= await User.findOne({
      email: req.body.email,
    });

    

    if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
    };

    user=new User(req.body); 
    await user.save();
    
     const token= jwt.sign(
       {userId: user.id},
       process.env.JWT_SECRET_KEY as string, 
       {expiresIn: "1d"},
     );
     
     res.cookie('auth_token',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
     });
    
     res.status(200).json({ message: "User registered OK" });

   } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
   }
};



const Login  =async(req:Request, res:Response) : Promise<void> =>{

  const { email, password } = req.body;

  try {
    const user=await User.findOne({ email });
    if(!user){
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    };

    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
      res.status(400).json({ message:"Invalid Credentials"});
      return;
    };

    const token=jwt.sign(
      {userId: user.id},
      process.env.JWT_SECRET_KEY as string,
      {expiresIn: "1d"},
    );

    res.cookie('auth_token',token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
   });

   res.status(200).json({ userId: user._id });
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }

};

const getMe=async(req:Request, res:Response) : Promise<void> => {

  const userId=req.userId;

  try {
    const user= await User.findById(userId).select("-password");
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    };

    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
   
};


const Profile=async(req:Request,res:Response): Promise<void>=> {

  const userId=req.userId;

  try {
    const user= await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    };

    
    const myHotels = await Hotel.find({ userId }).lean();

    const bookingCount = await Hotel.aggregate([
      { $unwind: "$bookings" }, 
      { $match: { "bookings.userId": userId } },
      { $count: "totalBookings" } //here just names as totolBookings not a field
    ]);
    
    const bookingsCount=bookingCount.length > 0 ? bookingCount[0].totalBookings : 0;

    res.status(200).json({
      firstname:user.firstName,
      lastname: user.lastName,
      email: user.email,
      productCount: myHotels.length,
      bookingsCount,
      earned:user.earned,
    });

     
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};






export {
    Register,
    Login,
    getMe,
    Profile
}