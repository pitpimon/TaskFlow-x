import { Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const inviteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional().default('Developer'),
});

export async function getTeam(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      include: {
        assignedTasks: {
          select: {
            status: true,
          },
        },
      },
    });

    const formattedTeam = users.map((u) => {
      const assignedTasksCount = u.assignedTasks.length;
      const completedTasksCount = u.assignedTasks.filter((t) => t.status === 'done').length;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = u;

      return {
        ...userWithoutPassword,
        assignedTasksCount,
        completedTasksCount,
      };
    });

    res.json(formattedTeam);
  } catch (error) {
    next(error);
  }
}

export async function getTeamMemberById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid team member ID' });
      return;
    }

    const u = await prisma.user.findUnique({
      where: { id },
      include: {
        assignedTasks: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!u) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }

    const assignedTasksCount = u.assignedTasks.length;
    const completedTasksCount = u.assignedTasks.filter((t) => t.status === 'done').length;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = u;

    res.json({
      ...userWithoutPassword,
      assignedTasksCount,
      completedTasksCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function inviteTeamMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, role } = inviteSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    // Generate random password for invited user
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const nameParts = name.trim().split(/\s+/);
    const avatar = nameParts
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        avatar,
        preferences: {
          create: {
            theme: 'light',
            density: 'comfortable',
            notifyAssignments: true,
            notifyReminders: true,
            notifyComments: true,
            notifyUpdates: false,
            defaultView: 'board',
            defaultSort: 'dueDate',
            showCompleted: true,
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      ...userWithoutPassword,
      assignedTasksCount: 0,
      completedTasksCount: 0,
      // We return temporary password just for testing/reference purposes in dev,
      // in production this would be sent via email link.
      tempPassword: process.env.NODE_ENV !== 'production' ? tempPassword : undefined,
    });
  } catch (error) {
    next(error);
  }
}
