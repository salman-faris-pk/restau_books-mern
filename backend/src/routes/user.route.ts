import express from "express"
import {Register} from "../controllers/user.cotrls"
import { check} from "express-validator"
import { validateRequest } from "../middlewares/validateMiddleware"

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




export default router;