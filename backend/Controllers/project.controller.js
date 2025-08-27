import projectService from "../Services/project.service";
import projectModel from "../Models/project.model.js";
import { validationResult } from "express-validator";
import usermodel from "../Models/User.model.js";

export const createProject = async (req, res) => {
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

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await usermodel.findOne({ email: req.user.email });
    const allUserProjects = await projectService.getAllProjects({
      userID: loggedInUser._id,
    });
    return res.status(200).json({ success: true, data: allUserProjects });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { projectId, users } = req.body;
    const loggedInUser = await usermodel.findOne({ email: req.user.email });
    const updatedProject = await projectService.addUserToProject({
      projectId,
      users,
      userID: loggedInUser._id,
    });
    return res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ success: false, error: "Project ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ success: false, error: "Invalid Project ID" });
  }
  try {
  const project = await projectService.getProjectById({projectId});
  return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
