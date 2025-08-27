import { Router } from 'express';
import { body, param } from 'express-validator';
import * as projectController from '../Controllers/project.controller.js';
import * as authMiddleware from '../middlewares/auth.middlewares.js';

const router = Router();

// Create a new project
router.post('/create',
    authMiddleware.authuser,
    [
        body('name').trim().isString().withMessage('Name is required'),
        body('users').optional().isArray().withMessage('Users must be an array of strings'),
        body('users.*').isString().withMessage('Each user ID must be a string')
    ],
    projectController.createProject
);

// Get all projects for the logged-in user
router.get('/all',
    authMiddleware.authuser,
    projectController.getAllProjects
);

// Add user(s) to a project
router.put('/add-user',
    authMiddleware.authuser,
    [
        body('projectId').trim().isString().withMessage('Project ID is required'),
        body('users')
            .isArray({ min: 1 }).withMessage('At least one user is required')
            .custom(users => users.every(user => typeof user === 'string'))
            .withMessage('Each user must be a string')
    ],
    projectController.addUserToProject
);

// Get project by ID
router.get('/get-project/:projectId',
    authMiddleware.authuser,
    projectController.getProjectById
);

// Update file tree for a project (temporarily disabled until implemented)

// Get all users for the logged-in user


export default router;