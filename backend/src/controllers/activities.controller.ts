import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const activityCreateSchema = z.object({
  text: z.string().min(1, 'Activity text is required'),
});

export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const activities = await prisma.activity.findMany({
      take: 30,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedActivities = activities.map((a) => {
      // Get human-friendly relative time, e.g. "2 hours ago"
      let relativeTime = '';
      try {
        relativeTime = formatDistanceToNow(new Date(a.createdAt), { addSuffix: true });
        // Clean up some date-fns phrases to match mock visual styles (e.g. "about 2 hours ago" -> "2 hours ago")
        relativeTime = relativeTime.replace(/^about\s+/, '');
      } catch (err) {
        relativeTime = 'just now';
      }

      return {
        id: a.id,
        text: a.text,
        timestamp: relativeTime,
        createdAt: a.createdAt,
      };
    });

    res.json(formattedActivities);
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { text } = activityCreateSchema.parse(req.body);
    const userId = req.user?.userId || null;

    const activity = await prisma.activity.create({
      data: {
        text,
        userId,
      },
    });

    let relativeTime = '';
    try {
      relativeTime = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
      relativeTime = relativeTime.replace(/^about\s+/, '');
    } catch (err) {
      relativeTime = 'just now';
    }

    res.status(201).json({
      id: activity.id,
      text: activity.text,
      timestamp: relativeTime,
      createdAt: activity.createdAt,
    });
  } catch (error) {
    next(error);
  }
}
