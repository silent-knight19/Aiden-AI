import { Router } from "express";
import { body } from "express-validator";
import * as controller from "../Controllers/User.controller.js";
import { authuser } from "../middlewares/auth.middlewares.js";
const router = Router();

// Input validation middleware
const validateInputs = (req, res, next) => {
  const validations = [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .trim(),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() =>
    next()
  );
};

// Register route
router.post("/register", validateInputs, controller.createUserController);

// Login route
router.post("/login", validateInputs, controller.loginUserController);

router.get("/profile", authuser, controller.profilecontroller);

export default router;
