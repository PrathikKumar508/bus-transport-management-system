import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDatabase } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopmentOrigin = !origin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    callback(null, isLocalDevelopmentOrigin || origin === allowedOrigin);
  },
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'college-transport-api',
  });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
});

export async function startServer() {
  await connectDatabase();
  return app.listen(port, () => {
    console.log(`Transport API listening on port ${port}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Unable to start server:', error.message);
    process.exitCode = 1;
  });
}

export default app;
