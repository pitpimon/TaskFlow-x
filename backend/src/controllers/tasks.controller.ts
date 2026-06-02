import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const taskCreateSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional().default(''),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().min(1, 'Due date is required'),
  assigneeId: z.number().int(),
  projectId: z.number().int(),
  labels: z.array(z.string()).optional().default([]),
});

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.number().int().optional(),
  projectId: z.number().int().optional(),
  labels: z.array(z.string()).optional(),
});

const taskStatusSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
});

export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { projectId, assigneeId, status, priority } = req.query;

    const where: any = {};
    if (projectId) where.projectId = parseInt(projectId as string, 10);
    if (assigneeId) where.assigneeId = parseInt(assigneeId as string, 10);
    if (status) where.status = status as string;
    if (priority) where.priority = priority as string;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedTasks = tasks.map((t) => {
      let parsedLabels: string[] = [];
      try {
        parsedLabels = JSON.parse(t.labels);
      } catch (err) {
        parsedLabels = [];
      }

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assignee: t.assignee.name,
        assigneeId: t.assigneeId,
        projectId: t.projectId,
        commentsCount: t.commentsCount,
        labels: parsedLabels,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    });

    res.json(formattedTasks);
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    let parsedLabels: string[] = [];
    try {
      parsedLabels = JSON.parse(task.labels);
    } catch (err) {
      parsedLabels = [];
    }

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee.name,
      assigneeId: task.assigneeId,
      projectId: task.projectId,
      commentsCount: task.commentsCount,
      labels: parsedLabels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = taskCreateSchema.parse(req.body);

    const projectExists = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    if (!projectExists) {
      res.status(400).json({ error: 'Project does not exist' });
      return;
    }

    const assigneeUser = await prisma.user.findUnique({
      where: { id: data.assigneeId },
    });
    if (!assigneeUser) {
      res.status(400).json({ error: 'Assignee does not exist' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        labels: JSON.stringify(data.labels),
      },
    });

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: assigneeUser.name,
      assigneeId: task.assigneeId,
      projectId: task.projectId,
      commentsCount: task.commentsCount,
      labels: data.labels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const data = taskUpdateSchema.parse(req.body);

    if (data.projectId) {
      const projectExists = await prisma.project.findUnique({
        where: { id: data.projectId },
      });
      if (!projectExists) {
        res.status(400).json({ error: 'Project does not exist' });
        return;
      }
    }

    let assigneeName = '';
    if (data.assigneeId) {
      const assigneeUser = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });
      if (!assigneeUser) {
        res.status(400).json({ error: 'Assignee does not exist' });
        return;
      }
      assigneeName = assigneeUser.name;
    }

    const currentTask = await prisma.task.findUnique({
      where: { id },
      include: { assignee: { select: { name: true } } },
    });
    if (!currentTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;
    if (data.labels !== undefined) updateData.labels = JSON.stringify(data.labels);

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    let finalLabels: string[] = [];
    try {
      finalLabels = data.labels !== undefined ? data.labels : JSON.parse(task.labels);
    } catch (err) {
      finalLabels = [];
    }

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: assigneeName || currentTask.assignee.name,
      assigneeId: task.assigneeId,
      projectId: task.projectId,
      commentsCount: task.commentsCount,
      labels: finalLabels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const { status } = taskStatusSchema.parse(req.body);

    const task = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: {
          select: { name: true },
        },
      },
    });

    let parsedLabels: string[] = [];
    try {
      parsedLabels = JSON.parse(task.labels);
    } catch (err) {
      parsedLabels = [];
    }

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee.name,
      assigneeId: task.assigneeId,
      projectId: task.projectId,
      commentsCount: task.commentsCount,
      labels: parsedLabels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}
