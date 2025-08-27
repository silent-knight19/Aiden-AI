import { Router } from "express";
import { body } from "express-validator";
import * as controller from "../Controllers/User.controller.js";
import * as authMiddleware from "../middlewares/auth.middlewares.js";

const router = Router();

// Define validation rules as an array, which is the standard practice.
const registrationValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim(),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required").trim(),
];

// Apply the validation rules directly to the routes.
router.post(
  "/register",
  registrationValidation,
  controller.createUserController
);
router.post("/login", loginValidation, controller.loginUserController);
router.get(
  "/logout",
  authMiddleware.authuser,
  controller.logoutUserController
);

router.get("/profile", authMiddleware.authuser, controller.profilecontroller);

router.get("/all", authMiddleware.authuser, controller.getAllUserController);


export default router;
