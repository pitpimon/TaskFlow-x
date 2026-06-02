/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProjectList = React.lazy(() => import('./pages/ProjectList'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const TeamMembers = React.lazy(() => import('./pages/TeamMembers'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const Insights = React.lazy(() => import('./pages/Insights'));


// Components
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';

function AppContent() {
  const { isLoggedIn } = useApp();

  // Task Modal Global state
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [newTaskProjectId, setNewTaskProjectId] = useState<number | undefined>(undefined);

  // Project Modal Global state
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  // Triggers
  const handleOpenTask = (id: number) => {
    setActiveTaskId(id);
    setNewTaskProjectId(undefined);
    setTaskEditMode(false);
    setIsTaskOpen(true);
  };

  const handleOpenNewTaskGlobal = () => {
    setActiveTaskId(null);
    setNewTaskProjectId(undefined);
    setTaskEditMode(true);
    setIsTaskOpen(true);
  };

  const handleOpenNewTaskProject = (projId: number) => {
    setActiveTaskId(null);
    setNewTaskProjectId(projId);
    setTaskEditMode(true);
    setIsTaskOpen(true);
  };

  const handleOpenNewProject = () => {
    setActiveProjectId(null);
    setIsProjectOpen(true);
  };

  const handleOpenEditProject = (id: number) => {
    setActiveProjectId(id);
    setIsProjectOpen(true);
  };

  // Auth Gate
  if (!isLoggedIn) {
     return (
       <div className="bg-slate-50 min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toast />
       </div>
     );
  }

  return (
    <Navigation onOpenNewTask={handleOpenNewTaskGlobal}>
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-sm text-slate-500">Loading…</div></div>}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  onOpenTaskDetail={handleOpenTask} 
                  onOpenNewTask={handleOpenNewTaskGlobal} 
                />
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProjectList 
                  onOpenNewProject={handleOpenNewProject} 
                  onOpenEditProject={handleOpenEditProject} 
                />
              } 
            />
            <Route 
              path="/project/:id" 
              element={
                <ProjectDetail 
                  onOpenTaskDetail={handleOpenTask} 
                  onOpenNewTask={handleOpenNewTaskProject} 
                />
              } 
            />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>

      {/* Global Toast Alerts */}
      <Toast />

      {/* Global Task Modal */}
      <TaskModal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        taskId={activeTaskId}
        projectIdFilter={newTaskProjectId}
        editModeInitial={taskEditMode}
      />

      {/* Global Project Modal */}
      <ProjectModal
        isOpen={isProjectOpen}
        onClose={() => setIsProjectOpen(false)}
        projectId={activeProjectId}
      />
    </Navigation>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
