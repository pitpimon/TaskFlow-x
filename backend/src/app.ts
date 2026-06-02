import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import commentsRouter from './routes/comments.js';
import teamRouter from './routes/team.js';
import activitiesRouter from './routes/activities.js';
import meRouter from './routes/me.js';
import insightsRouter from './routes/insights.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tasks', commentsRouter); // nested comments routes are mounted here under /api/tasks
app.use('/api/team', teamRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/me', meRouter);
app.use('/api/insights', insightsRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
