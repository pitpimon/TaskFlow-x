import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  title: z.string().optional(),
});

const preferencesUpdateSchema = z.object({
  theme: z.enum(['light', 'dark', 'teal', 'sunset', 'ocean', 'purple']).optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
  notifyAssignments: z.boolean().optional(),
  notifyReminders: z.boolean().optional(),
  notifyComments: z.boolean().optional(),
  notifyUpdates: z.boolean().optional(),
  defaultView: z.enum(['board', 'list']).optional(),
  defaultSort: z.enum(['dueDate', 'priority', 'status', 'title']).optional(),
  showCompleted: z.boolean().optional(),
});

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = profileUpdateSchema.parse(req.body);

    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      // Re-derive initials
      const nameParts = data.name.trim().split(/\s+/);
      updateData.avatar = nameParts
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'U';
    }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.title !== undefined) updateData.title = data.title;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        preferences: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }

    res.json(preferences);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = preferencesUpdateSchema.parse(req.body);

    const preferences = await prisma.userPreferences.update({
      where: { userId },
      data,
    });

    res.json(preferences);
  } catch (error) {
    next(error);
  }
}
