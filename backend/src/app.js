import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(cors({ origin: corsOrigin, credentials: true }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
  });

  return app;
}


