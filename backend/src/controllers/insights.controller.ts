import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdQuery = req.query.userId as string;
    if (!userIdQuery) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    const userId = parseInt(userIdQuery, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userTasks = await prisma.task.findMany({
      where: { assigneeId: userId },
    });

    const totalTasks = userTasks.length;
    const completedTasksCount = userTasks.filter((t) => t.status === 'done').length;
    const inProgressTasksCount = userTasks.filter((t) => t.status === 'in-progress').length;
    const reviewTasksCount = userTasks.filter((t) => t.status === 'review').length;
    const todoTasksCount = userTasks.filter((t) => t.status === 'todo').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
    const pendingCount = totalTasks - completedTasksCount;

    // Efficiency index calculation
    let efficiencyIndex = 0;
    if (totalTasks > 0) {
      let score = 0;
      let maxPossible = 0;
      userTasks.forEach((t) => {
        const weight = t.priority === 'high' ? 30 : t.priority === 'medium' ? 20 : 10;
        maxPossible += weight;
        if (t.status === 'done') {
          score += weight;
        } else if (t.status === 'review') {
          score += weight * 0.8;
        } else if (t.status === 'in-progress') {
          score += weight * 0.5;
        }
      });
      efficiencyIndex = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    }

    // Dynamic Summary Paragraph
    let summary = '';
    if (totalTasks === 0) {
      summary = `${user.name} has no tasks assigned in this workspace cycle. Use the task writer to allocate work items to start compiling performance reports.`;
    } else {
      const highPriorityTasks = userTasks.filter((t) => t.priority === 'high');
      const completedHigh = highPriorityTasks.filter((t) => t.status === 'done').length;
      const overDueSoon = userTasks.filter((t) => t.status !== 'done' && new Date(t.dueDate) < new Date('2026-06-15'));

      summary = `Analyzing workspace trends for ${user.name} (${user.role}). `;
      summary += `With ${completedTasksCount} of ${totalTasks} tasks resolved, they maintain a solid ${completionRate}% task-closure efficiency index. `;

      if (highPriorityTasks.length > 0) {
        if (completedHigh === highPriorityTasks.length) {
          summary += `Critically, ${user.name} has answered the sprint requirements flawlessly by resolving 100% of their ${highPriorityTasks.length} critical High Priority deliverables. `;
        } else {
          summary += `There are still ${highPriorityTasks.length - completedHigh} high-priority elements awaiting review/closure, which should remain the target of daily standalone sprints. `;
        }
      }

      if (overDueSoon.length > 0) {
        summary += `Additionally, ${overDueSoon.length} items are marked with nearing due thresholds in mid-June. Focus should pivot here to secure milestone reliability.`;
      } else {
        summary += `Overall timeline health looks healthy as all outstanding tasks reside comfortably inside normal timeline parameters.`;
      }
    }

    res.json({
      totalTasks,
      completedTasksCount,
      inProgressTasksCount,
      reviewTasksCount,
      todoTasksCount,
      completionRate,
      pendingCount,
      efficiencyIndex,
      summary,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdQuery = req.query.userId as string;
    if (!userIdQuery) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    const userId = parseInt(userIdQuery, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const userTasks = await prisma.task.findMany({
      where: { assigneeId: userId },
    });

    const ticks = [
      { date: 'June 05', tasks: 0, done: 0 },
      { date: 'June 10', tasks: 0, done: 0 },
      { date: 'June 15', tasks: 0, done: 0 },
      { date: 'June 20', tasks: 0, done: 0 },
      { date: 'June 25', tasks: 0, done: 0 },
      { date: 'June 30', tasks: 0, done: 0 },
    ];

    userTasks.forEach((t) => {
      try {
        const day = parseInt(t.dueDate.split('-')[2], 10);
        if (isNaN(day)) return;

        let index = 0;
        if (day <= 5) index = 0;
        else if (day <= 10) index = 1;
        else if (day <= 15) index = 2;
        else if (day <= 20) index = 3;
        else if (day <= 25) index = 4;
        else index = 5;

        ticks[index].tasks += 1;
        if (t.status === 'done') {
          ticks[index].done += 1;
        }
      } catch (e) {
        // Safe wrap
      }
    });

    res.json(ticks);
  } catch (error) {
    next(error);
  }
}

export async function getWorkload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userIdQuery = req.query.userId as string;
    if (!userIdQuery) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    const userId = parseInt(userIdQuery, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const userTasks = await prisma.task.findMany({
      where: { assigneeId: userId },
    });

    const projects = await prisma.project.findMany({});

    const counts: { [projId: number]: { name: string; total: number; done: number; color: string } } = {};

    projects.forEach((p) => {
      counts[p.id] = { name: p.name, total: 0, done: 0, color: p.color };
    });

    userTasks.forEach((t) => {
      if (counts[t.projectId]) {
        counts[t.projectId].total += 1;
        if (t.status === 'done') {
          counts[t.projectId].done += 1;
        }
      }
    });

    const workloadData = Object.values(counts).filter((p) => p.total > 0);

    res.json(workloadData);
  } catch (error) {
    next(error);
  }
}
