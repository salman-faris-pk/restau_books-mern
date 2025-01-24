import express, {Request,Response} from "express"
import {Login, Register,getMe} from "../controllers/user.cotrls"
import { check } from "express-validator"
import { validateRequest } from "../middlewares/validateMiddleware"
import verifyToken from "../middlewares/auth"

const router= express.Router()


router.post("/register",[
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({min: 6,}),
],
validateRequest,
Register
);


router.post("/login",[
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6,}),
 ],
 validateRequest,
 Login
);


router.get("/validate-token",verifyToken, (req:Request, res:Response)=> {
    res.status(200).json({ userId: req.userId});
});

router.get("/me",verifyToken,getMe);

router.post("/logout", (req:Request,res:Response)=>{
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });

    res.send();
});




export default router;