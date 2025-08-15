import {Router} from "express";
import * as controller from "../Controllers/User.controller.js";
import { body } from "express-validator";
const router = Router();

router.post("/register", 
    [body("email").isEmail().withMessage("Please enter a valid email"),body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")],
    controller.createUserController);


export default router;