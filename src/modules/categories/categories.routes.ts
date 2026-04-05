import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRole } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from './categories.schema';

// ---------------------------------------------------------------------------
// Categories routes — /api/v1/categories
//
// GET  /           → all roles  (system + custom categories)
// GET  /:id        → all roles
// POST /           → admin only
// PATCH /:id       → admin only
// DELETE /:id      → admin only
// ---------------------------------------------------------------------------

const router = Router();

// All authenticated users can view categories
router.get('/',    requireAuth, categoriesController.list);
router.get('/:id', requireAuth, categoriesController.getById);

// Admin only — manage custom categories
router.post(  '/',    requireAuth, requireRole('ADMIN'), validate(createCategorySchema), categoriesController.create);
router.patch( '/:id', requireAuth, requireRole('ADMIN'), validate(updateCategorySchema), categoriesController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), categoriesController.delete);

export default router;