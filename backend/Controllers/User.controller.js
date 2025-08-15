import User from "../Models/User.model.js";
import CreateUser from "../Services/User.Services.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const token = user.generateJWToken();
        const user = await CreateUser(email, password);
        res.status(201).json({user,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
 