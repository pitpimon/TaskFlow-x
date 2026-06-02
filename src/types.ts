/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string; // Hex color or Tailwind CSS class name
  taskCount: number;
  completedTaskCount: number;
  progress: number; // calculated as (completedTaskCount/taskCount)*100
  targetDate?: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  assignee: string;
  assigneeId: number;
  projectId: number;
  commentsCount: number;
  labels: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string; // Initials or color
  assignedTasksCount?: number;
  completedTasksCount?: number;
}

export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  avatar: string;
  message: string;
  createdAt: string; // ISO or human-readable
}

export interface Activity {
  id: number;
  text: string;
  timestamp: string; // Human-friendly e.g., "10 mins ago" or "Yesterday"
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  avatar: string;
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'teal' | 'sunset' | 'ocean' | 'purple';
  density: 'comfortable' | 'compact';
  notifyAssignments: boolean;
  notifyReminders: boolean;
  notifyComments: boolean;
  notifyUpdates: boolean;
  defaultView: 'board' | 'list';
  defaultSort: 'dueDate' | 'priority' | 'status' | 'title';
  showCompleted: boolean;
}
