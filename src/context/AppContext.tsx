/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Project, Task, User, Comment, Activity, AppPreferences, UserProfile } from '../types';
import { DEFAULT_PREFERENCES, DEFAULT_USER_PROFILE } from '../data/mockData';
import { apiRequest } from '../lib/api';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  team: User[];
  comments: Comment[];
  activities: Activity[];
  preferences: AppPreferences;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, passwordString: string, role?: string) => Promise<void>;
  
  // Project operations
  addProject: (name: string, description: string, color: string, targetDate?: string) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'commentsCount'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  moveTaskStatus: (taskId: number, nextStatus: Task['status']) => Promise<void>;
  
  // Comment operations
  getTaskComments: (taskId: number) => Comment[];
  addComment: (taskId: number, message: string) => Promise<void>;
  
  // Settings operations
  updatePreferences: (prefs: Partial<AppPreferences>) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  
  // Log activity
  logActivity: (text: string) => Promise<void>;

  // Reset to mock data
  resetMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('taskflow_token'));
  
  // Main Databases (Loaded from API)
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  
  // UI states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fetchedTaskIds = useRef<Set<number>>(new Set());

  // Load all user details and database records if logged in
  useEffect(() => {
    if (isLoggedIn) {
      apiRequest<any>('/me')
        .then((user) => {
          setUserProfile({
            name: user.name,
            email: user.email,
            title: user.title || 'Team Member',
            avatar: user.avatar,
          });
          if (user.preferences) {
            setPreferences(user.preferences);
          }
          
          // Fetch operational datasets in parallel
          return Promise.all([
            apiRequest<Project[]>('/projects'),
            apiRequest<Task[]>('/tasks'),
            apiRequest<User[]>('/team'),
            apiRequest<Activity[]>('/activities'),
          ]);
        })
        .then(([projectsData, tasksData, teamData, activitiesData]) => {
          setProjects(projectsData);
          setTasks(tasksData);
          setTeam(teamData);
          setActivities(activitiesData);
        })
        .catch((err) => {
          console.error('Auth initialization failed, clearing token:', err);
          localStorage.removeItem('taskflow_token');
          setIsLoggedIn(false);
        });
    } else {
      // Reset state on logout
      setProjects([]);
      setTasks([]);
      setTeam([]);
      setComments([]);
      setActivities([]);
      setUserProfile(DEFAULT_USER_PROFILE);
      setPreferences(DEFAULT_PREFERENCES);
      fetchedTaskIds.current.clear();
    }
  }, [isLoggedIn]);

  // Feedback Toasts
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity logger
  const logActivity = async (text: string) => {
    try {
      const newActivity = await apiRequest<Activity>('/activities', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setActivities((prev) => [newActivity, ...prev.slice(0, 29)]);
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  // Login & Session
  const login = async (email: string, passwordString: string = 'password123') => {
    try {
      const { token, user } = await apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordString }),
      });

      localStorage.setItem('taskflow_token', token);
      setUserProfile({
        name: user.name,
        email: user.email,
        title: user.title || 'Team Member',
        avatar: user.avatar,
      });
      if (user.preferences) {
        setPreferences(user.preferences);
      }
      setIsLoggedIn(true);
      addToast(`Successfully logged in as ${email}`, 'success');
      logActivity(`User ${email} signed into the application.`);
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  // Register & Auto-login
  const register = async (name: string, email: string, passwordString: string, role: string = 'Developer') => {
    try {
      const { token, user } = await apiRequest<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: passwordString, role }),
      });

      localStorage.setItem('taskflow_token', token);
      setUserProfile({
        name: user.name,
        email: user.email,
        title: user.title || 'Team Member',
        avatar: user.avatar,
      });
      if (user.preferences) {
        setPreferences(user.preferences);
      }
      setIsLoggedIn(true);
      addToast(`Profile created successfully!`, 'success');
      logActivity(`User ${email} registered and signed in.`);
    } catch (err: any) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    setIsLoggedIn(false);
    addToast('Logged out of session.', 'info');
  };

  // Project Functions
  const addProject = async (name: string, description: string, color: string, targetDate?: string) => {
    try {
      const newProj = await apiRequest<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description, color, targetDate }),
      });
      setProjects((prev) => [...prev, newProj]);
      addToast(`Project "${name}" was created!`, 'success');
      logActivity(`Project "${name}" was created by ${userProfile.name}`);
      return newProj;
    } catch (err: any) {
      addToast(err.message || 'Failed to add project', 'error');
      throw err;
    }
  };

  const updateProject = async (updatedProj: Project) => {
    try {
      const updated = await apiRequest<Project>(`/projects/${updatedProj.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedProj.name,
          description: updatedProj.description,
          color: updatedProj.color,
          targetDate: updatedProj.targetDate,
        }),
      });
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      addToast(`Project "${updatedProj.name}" was updated!`, 'success');
      logActivity(`Project details for "${updatedProj.name}" were updated.`);
    } catch (err: any) {
      addToast(err.message || 'Failed to update project', 'error');
    }
  };

  const deleteProject = async (id: number) => {
    const projToDelete = projects.find((p) => p.id === id);
    try {
      await apiRequest<any>(`/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      // Clean up local tasks matching deleted project
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
      if (projToDelete) {
        addToast(`Deleted project "${projToDelete.name}" and all associated tasks.`, 'warning');
        logActivity(`Project "${projToDelete.name}" was deleted.`);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to delete project', 'error');
    }
  };

  // Task Functions
  const addTask = async (taskInput: Omit<Task, 'id' | 'commentsCount'>) => {
    try {
      const newTask = await apiRequest<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: taskInput.title,
          description: taskInput.description,
          projectId: taskInput.projectId,
          status: taskInput.status,
          priority: taskInput.priority,
          assigneeId: taskInput.assigneeId,
          dueDate: taskInput.dueDate,
          labels: taskInput.labels,
        }),
      });
      setTasks((prev) => [...prev, newTask]);
      addToast(`Task "${newTask.title}" added!`, 'success');
      logActivity(`Task "${newTask.title}" was created by ${userProfile.name}`);
      return newTask;
    } catch (err: any) {
      addToast(err.message || 'Failed to create task', 'error');
      throw err;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const updated = await apiRequest<Task>(`/tasks/${updatedTask.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          projectId: updatedTask.projectId,
          status: updatedTask.status,
          priority: updatedTask.priority,
          assigneeId: updatedTask.assigneeId,
          dueDate: updatedTask.dueDate,
          labels: updatedTask.labels,
        }),
      });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      addToast(`Task "${updatedTask.title}" updated.`, 'success');
      logActivity(`Task "${updatedTask.title}" details were modified.`);
    } catch (err: any) {
      addToast(err.message || 'Failed to update task', 'error');
    }
  };

  const deleteTask = async (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    try {
      await apiRequest<any>(`/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (taskToDelete) {
        addToast(`Task "${taskToDelete.title}" was removed.`, 'warning');
        logActivity(`Task "${taskToDelete.title}" was deleted.`);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const moveTaskStatus = async (taskId: number, nextStatus: Task['status']) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updated = await apiRequest<Task>(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      addToast(`Moved "${updated.title}" to ${nextStatus.replace('-', ' ').toUpperCase()}`, 'info');
      logActivity(`Moved "${updated.title}" status to ${nextStatus}`);
    } catch (err: any) {
      addToast(err.message || 'Failed to move task status', 'error');
    }
  };

  // Comments Functions
  const getTaskComments = (taskId: number) => {
    if (!fetchedTaskIds.current.has(taskId)) {
      fetchedTaskIds.current.add(taskId);
      apiRequest<Comment[]>(`/tasks/${taskId}/comments`)
        .then((data) => {
          setComments((prev) => {
            const filtered = prev.filter((c) => c.taskId !== taskId);
            return [...filtered, ...data];
          });
        })
        .catch((err) => console.error('Error fetching comments:', err));
    }
    return comments
      .filter((c) => c.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const addComment = async (taskId: number, message: string) => {
    try {
      const newComment = await apiRequest<Comment>(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      
      setComments((prev) => [...prev, newComment]);
      // Increment comment count on task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, commentsCount: t.commentsCount + 1 } : t))
      );
      
      const task = tasks.find((t) => t.id === taskId);
      addToast('Comment posted.', 'success');
      if (task) {
        logActivity(`${userProfile.name} commented on task "${task.title}"`);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to post comment', 'error');
    }
  };

  // Preferences
  const updatePreferences = async (prefs: Partial<AppPreferences>) => {
    try {
      const updated = await apiRequest<AppPreferences>('/me/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs),
      });
      setPreferences(updated);
      addToast('Preferences saved.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save preferences', 'error');
    }
  };

  // User Profile
  const updateUserProfile = async (profile: UserProfile) => {
    try {
      const updatedUser = await apiRequest<any>('/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          title: profile.title,
        }),
      });

      setUserProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        title: updatedUser.title || 'Team Member',
        avatar: updatedUser.avatar,
      });

      addToast('Profile details updated.', 'success');
      logActivity(`User updated profile details.`);
    } catch (err: any) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  // Reset demo datasets (Instructions on restoring via terminal seeder)
  const resetMockData = () => {
    addToast(
      'To reset the backend SQLite data to default, please run "npm run db:seed" in the backend directory terminal.',
      'warning'
    );
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        team,
        comments,
        activities,
        preferences,
        userProfile,
        isLoggedIn,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        register,
        
        addProject,
        updateProject,
        deleteProject,
        
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        
        getTaskComments,
        addComment,
        
        updatePreferences,
        updateUserProfile,
        logActivity,
        resetMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
