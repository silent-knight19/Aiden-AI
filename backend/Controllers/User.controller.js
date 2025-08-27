import User from "../Models/User.model.js";
import * as userServices from "../Services/User.Services.js";
import { validationResult } from "express-validator";
import redisClient from "../Services/redis.services.js";

export const createUserController = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
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
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Server error while creating user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password", // More generic for security
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password", // More generic for security
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
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const profilecontroller = async (req, res) => {
  console.log(req.user);
  res.json({
    success: true,
    user: req.user,
  });
};

export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.clearCookie("token");
    res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during logout",
    });
  }
};

export const getAllUserController = async (req, res) => {
  try {
    const loggedInUser = await usermodel.findOne({ email: req.user.email });
    const allUsers = await userServices.getAllUsers({
      userId: loggedInUser._id,
    });
    return res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
