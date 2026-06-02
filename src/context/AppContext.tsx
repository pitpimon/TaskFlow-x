/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, User, Comment, Activity, AppPreferences, UserProfile } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TEAM,
  INITIAL_TASKS,
  INITIAL_COMMENTS,
  INITIAL_ACTIVITIES,
  DEFAULT_PREFERENCES,
  DEFAULT_USER_PROFILE,
  loadData,
  saveData
} from '../data/mockData';

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
  login: (email: string) => void;
  logout: () => void;
  
  // Project operations
  addProject: (name: string, description: string, color: string, targetDate?: string) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'commentsCount'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  moveTaskStatus: (taskId: number, nextStatus: Task['status']) => void;
  
  // Comment operations
  getTaskComments: (taskId: number) => Comment[];
  addComment: (taskId: number, message: string) => void;
  
  // Settings operations
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  updateUserProfile: (profile: UserProfile) => void;
  
  // Log activity
  logActivity: (text: string) => void;

  // Reset to mock data
  resetMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadData<boolean>('is_logged_in', true));
  
  // Main Databases (Loaded from Storage or Initials)
  const [projects, setProjects] = useState<Project[]>(() => loadData<Project[]>('projects', INITIAL_PROJECTS));
  const [team, setTeam] = useState<User[]>(() => loadData<User[]>('team', INITIAL_TEAM));
  const [tasks, setTasks] = useState<Task[]>(() => loadData<Task[]>('tasks', INITIAL_TASKS));
  const [comments, setComments] = useState<Comment[]>(() => loadData<Comment[]>('comments', INITIAL_COMMENTS));
  const [activities, setActivities] = useState<Activity[]>(() => loadData<Activity[]>('activities', INITIAL_ACTIVITIES));
  const [preferences, setPreferences] = useState<AppPreferences>(() => loadData<AppPreferences>('preferences', DEFAULT_PREFERENCES));
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadData<UserProfile>('user_profile', DEFAULT_USER_PROFILE));
  
  // UI states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Push updates to localStorage
  useEffect(() => {
    saveData('projects', projects);
  }, [projects]);

  useEffect(() => {
    saveData('team', team);
  }, [team]);

  useEffect(() => {
    saveData('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveData('comments', comments);
  }, [comments]);

  useEffect(() => {
    saveData('activities', activities);
  }, [activities]);

  useEffect(() => {
    saveData('preferences', preferences);
  }, [preferences]);

  useEffect(() => {
    saveData('user_profile', userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveData('is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  // Recalculate Projects Aggregates (Progress, Task Counts) whenever tasks change
  useEffect(() => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        const projTasks = tasks.filter(t => t.projectId === proj.id);
        const total = projTasks.length;
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          ...proj,
          taskCount: total,
          completedTaskCount: completed,
          progress
        };
      });
      // Simple deep equality check to prevent infinite loop or state fluttering
      if (JSON.stringify(updated) !== JSON.stringify(prevProjects)) {
        return updated;
      }
      return prevProjects;
    });
  }, [tasks]);

  // Feedback Toasts
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Activity logger
  const logActivity = (text: string) => {
    const newActivity: Activity = {
      id: Date.now(),
      text,
      timestamp: "Just now"
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 29)]); // keep last 30 activities
  };

  // Login & Session
  const login = (email: string) => {
    setIsLoggedIn(true);
    addToast(`Successfully logged in as ${email}`, 'success');
    logActivity(`User ${email} signed into the application.`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    addToast("Logged out of session.", "info");
  };

  // Project Functions
  const addProject = (name: string, description: string, color: string, targetDate?: string) => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const newProj: Project = {
      id: nextId,
      name,
      description,
      color,
      taskCount: 0,
      completedTaskCount: 0,
      progress: 0,
      targetDate
    };
    setProjects(prev => [...prev, newProj]);
    addToast(`Project "${name}" was created!`, 'success');
    logActivity(`Project "${name}" was created by ${userProfile.name}`);
    return newProj;
  };

  const updateProject = (updatedProj: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    addToast(`Project "${updatedProj.name}" was updated!`, 'success');
    logActivity(`Project details for "${updatedProj.name}" were updated.`);
  };

  const deleteProject = (id: number) => {
    const projToDelete = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    // Clean up or reassign tasks
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (projToDelete) {
      addToast(`Deleted project "${projToDelete.name}" and all associated tasks.`, 'warning');
      logActivity(`Project "${projToDelete.name}" was deleted.`);
    }
  };

  // Task Functions
  const addTask = (taskInput: Omit<Task, 'id' | 'commentsCount'>) => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask: Task = {
      ...taskInput,
      id: nextId,
      commentsCount: 0
    };
    setTasks(prev => [...prev, newTask]);
    addToast(`Task "${newTask.title}" added to To-Do!`, 'success');
    logActivity(`Task "${newTask.title}" was created by ${userProfile.name}`);
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    addToast(`Task "${updatedTask.title}" updated.`, 'success');
    logActivity(`Task "${updatedTask.title}" details were modified.`);
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (taskToDelete) {
      addToast(`Task "${taskToDelete.title}" was removed.`, 'warning');
      logActivity(`Task "${taskToDelete.title}" was deleted.`);
    }
  };

  const moveTaskStatus = (taskId: number, nextStatus: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.status !== nextStatus) {
          addToast(`Moved "${t.title}" to ${nextStatus.replace('-', ' ').toUpperCase()}`, 'info');
          logActivity(`Moved "${t.title}" status to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
      }
      return t;
    }));
  };

  // Comments Functions
  const getTaskComments = (taskId: number) => {
    return comments.filter(c => c.taskId === taskId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const addComment = (taskId: number, message: string) => {
    const nextId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
    const newComment: Comment = {
      id: nextId,
      taskId,
      userId: 99, // Current user id mockup
      userName: userProfile.name,
      avatar: userProfile.avatar,
      message,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => [...prev, newComment]);
    
    // Increment comment count on task
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, commentsCount: t.commentsCount + 1 } : t));
    
    const task = tasks.find(t => t.id === taskId);
    addToast("Comment posted.", 'success');
    if (task) {
      logActivity(`${userProfile.name} commented on task "${task.title}"`);
    }
  };

  // Preferences
  const updatePreferences = (prefs: Partial<AppPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
    addToast("Preferences saved.", 'success');
  };

  // User Profile
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    addToast("Profile details updated.", 'success');
    logActivity(`User updated profile details. New Name: ${profile.name}`);
  };

  // Reset to default mock data configurations
  const resetMockData = () => {
    localStorage.removeItem('taskflow_projects');
    localStorage.removeItem('taskflow_tasks');
    localStorage.removeItem('taskflow_team');
    localStorage.removeItem('taskflow_comments');
    localStorage.removeItem('taskflow_activities');
    localStorage.removeItem('taskflow_user_profile');
    
    setProjects(INITIAL_PROJECTS);
    setTeam(INITIAL_TEAM);
    setTasks(INITIAL_TASKS);
    setComments(INITIAL_COMMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setUserProfile(DEFAULT_USER_PROFILE);
    
    addToast("Workspace re-seeded with 6 projects, 22 tasks, 6 test persona profiles, and activity logs!", 'success');
    logActivity("Workspace state was re-seeded with default demo datasets.");
  };

  return (
    <AppContext.Provider value={{
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
      resetMockData
    }}>
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
