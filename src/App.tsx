/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import TeamMembers from './pages/TeamMembers';
import SettingsPage from './pages/Settings';

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
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
