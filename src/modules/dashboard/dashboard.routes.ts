import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRole } from '../../common/middleware/rbac.middleware';


const router = Router();

// All authenticated roles
router.get('/summary', requireAuth, dashboardController.getSummary);
router.get('/category-totals', requireAuth, dashboardController.getCategoryTotals);
router.get('/trends/monthly',  requireAuth, dashboardController.getMonthlyTrends);
router.get('/trends/weekly',   requireAuth, dashboardController.getWeeklyTrends);

export default router;