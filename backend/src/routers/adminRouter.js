import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authenticate from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(authorize(['admin']));

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/level', adminController.updateUserLevel);
router.delete('/users/:id', adminController.deleteUser);

// Statistics routes
router.get('/stats', adminController.getSystemStats);

export default router;
