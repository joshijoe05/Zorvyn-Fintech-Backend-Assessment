import { Router } from 'express';
import { recordsController } from './records.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRole } from '../../common/middleware/rbac.middleware';
import { validate, validateQuery } from '../../common/middleware/validate.middleware';
import { createRecordSchema, updateRecordSchema, recordsQuerySchema } from './records.schema';

// ---------------------------------------------------------------------------
// Records routes — /api/v1/records
//
// GET  /      → VIEWER, ANALYST, ADMIN (non-admins see own records only)
// GET  /:id   → VIEWER, ANALYST, ADMIN (non-admins see own records only)
// POST /      → ADMIN only
// PATCH /:id  → ADMIN only
// DELETE /:id → ADMIN only
// ---------------------------------------------------------------------------

const router = Router();

// All authenticated roles can read
router.get('/',    requireAuth, validateQuery(recordsQuerySchema), recordsController.list);
router.get('/:id', requireAuth, recordsController.getById);

// Admin only — write operations
router.post(  '/',    requireAuth, requireRole('ADMIN'), validate(createRecordSchema), recordsController.create);
router.patch( '/:id', requireAuth, requireRole('ADMIN'), validate(updateRecordSchema), recordsController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'),                               recordsController.delete);

export default router;