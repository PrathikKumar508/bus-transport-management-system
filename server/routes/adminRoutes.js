import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/ping', authenticate, authorize('admin'), (_request, response) => {
  response.json({ message: 'Admin access confirmed' });
});

export default router;
