import { Request, Response} from "express";
import User from "../models/user"
import jwt from "jsonwebtoken";



const Register=async(req:Request, res:Response): Promise<void> => {
   try {
    
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



const Login  =async()=>{

}






export {
    Register,
    Login,
}