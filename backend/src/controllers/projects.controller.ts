import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const projectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  color: z.string().optional().default('#3b82f6'),
  targetDate: z.string().nullable().optional(),
});

const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  targetDate: z.string().nullable().optional(),
});

export async function getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const formattedProjects = projects.map((p) => {
      const taskCount = p.tasks.length;
      const completedTaskCount = p.tasks.filter((t) => t.status === 'done').length;
      const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        targetDate: p.targetDate,
        taskCount,
        completedTaskCount,
        progress,
      };
    });

    res.json(formattedProjects);
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const taskCount = project.tasks.length;
    const completedTaskCount = project.tasks.filter((t) => t.status === 'done').length;
    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      targetDate: project.targetDate,
      taskCount,
      completedTaskCount,
      progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = projectCreateSchema.parse(req.body);

    const project = await prisma.project.create({
      data,
    });

    res.status(201).json({
      ...project,
      taskCount: 0,
      completedTaskCount: 0,
      progress: 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    const data = projectUpdateSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const taskCount = project.tasks.length;
    const completedTaskCount = project.tasks.filter((t) => t.status === 'done').length;
    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      targetDate: project.targetDate,
      taskCount,
      completedTaskCount,
      progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
}
