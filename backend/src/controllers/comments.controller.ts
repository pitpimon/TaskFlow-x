import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const commentCreateSchema = z.object({
  message: z.string().min(1, 'Comment message is required'),
});

export async function getComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const taskExists = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!taskExists) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formattedComments = comments.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      userId: c.userId,
      userName: c.user.name,
      avatar: c.user.avatar,
      message: c.message,
      createdAt: c.createdAt.toISOString(),
    }));

    res.json(formattedComments);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const { message } = commentCreateSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const taskExists = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!taskExists) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const commentUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!commentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create comment and increment task commentsCount atomically
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          taskId,
          userId,
          message,
        },
      }),
      prisma.task.update({
        where: { id: taskId },
        data: {
          commentsCount: {
            increment: 1,
          },
        },
      }),
    ]);

    res.status(201).json({
      id: comment.id,
      taskId: comment.taskId,
      userId: comment.userId,
      userName: commentUser.name,
      avatar: commentUser.avatar,
      message: comment.message,
      createdAt: comment.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
