import User from "../Models/User.model.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({ email, password });
        await user.save();

        // Generate auth token
        const token = user.generateAuthToken();

        // Return user data (excluding password) and token
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while creating user',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

        // Generate auth token
        const token = user.generateAuthToken();

        // Return user data (excluding password) and token
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};