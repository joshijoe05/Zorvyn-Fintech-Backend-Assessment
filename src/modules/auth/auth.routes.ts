import { Router } from 'express';
import { validate } from '../../common/middleware/validate.middleware';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema';
import { authController } from './auth.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',  validate(refreshSchema),  authController.refresh);
 
// Protected routes
router.post('/logout',   validate(refreshSchema),  requireAuth, authController.logout);


export default router;