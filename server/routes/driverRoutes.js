import { Router } from 'express';
import { createDriver, deleteDriver, getDriver, listDrivers, updateDriver } from '../controllers/driverController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/', listDrivers);
router.get('/:id', getDriver);
router.post('/', createDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router;
