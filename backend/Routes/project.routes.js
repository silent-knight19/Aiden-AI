import {Router} from 'express';
import {body} from 'express-validator'
import * as ProjectController from '../Controllers/project.controller.js'
import * as authMiddleware from '../middlewares/auth.middlewares.js'
const router = Router();

// Create a new project
router.post('/create',
    authMiddleware.authuser,
    body('name').isString().withMessage('name is required'),
    ProjectController.createProject
);

// Get all projects for the logged-in user
router.get('/projects',
    authMiddleware.authuser,
    ProjectController.getProjects
);

export default router;