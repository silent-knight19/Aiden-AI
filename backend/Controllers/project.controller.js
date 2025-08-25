import projectService from "../Services/project.service";
import projectModel from "../Models/project.model.js";
import { validationResult } from "express-validator";
import usermodel from "../Models/User.model.js";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
  const { name } = req.body;
  const loggedInUser = await usermodel.findOne({ email: req.user.email });
  const userId = loggedInUser._id;
  const newProject = await projectService.createProject({
    name,
    userID: userId,
  });
  return res.status(201).json({ success: true, data: newProject });
} catch (error) {
    return res.status(400).json({
        success: false,
        error: error.message,
    });
}
};

export const getProjects = async (req, res) => {
  try {
    const loggedInUser = await usermodel.findOne({ email: req.user.email });
    const projects = await projectModel.find({ userID: loggedInUser._id });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

