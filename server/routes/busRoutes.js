import { Router } from 'express';
import { createBus, deleteBus, getBus, listBuses, updateBus } from '../controllers/busController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/', listBuses);
router.get('/:id', getBus);
router.post('/', createBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

export default router;
