/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { X, Calendar, FolderOpen, Info } from 'lucide-react';

interface ProjectModalProps {
  projectId: number | null; // null if creating a new project
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_CHIPS = [
  { value: '#3b82f6', name: 'Blue', bg: 'bg-blue-500' },
  { value: '#ef4444', name: 'Red', bg: 'bg-red-500' },
  { value: '#22c55e', name: 'Green', bg: 'bg-emerald-500' },
  { value: '#f59e0b', name: 'Orange', bg: 'bg-amber-500' },
  { value: '#a855f7', name: 'Purple', bg: 'bg-purple-500' },
  { value: '#ec4899', name: 'Pink', bg: 'bg-pink-500' },
  { value: '#06b6d4', name: 'Cyan', bg: 'bg-cyan-500' },
  { value: '#64748b', name: 'Slate', bg: 'bg-slate-500' }
];

export default function ProjectModal({ projectId, isOpen, onClose }: ProjectModalProps) {
  const { projects, addProject, updateProject, addToast } = useApp();
  const isNewProject = projectId === null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [targetDate, setTargetDate] = useState('2026-06-30');

  useEffect(() => {
    if (isOpen) {
      if (!isNewProject && projectId) {
        const proj = projects.find(p => p.id === projectId);
        if (proj) {
          setName(proj.name);
          setDescription(proj.description);
          setSelectedColor(proj.color);
          setTargetDate(proj.targetDate || '2026-06-30');
        }
      } else {
        setName('');
        setDescription('');
        setSelectedColor('#3b82f6');
        
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 30); // 30 days default target
        setTargetDate(dateObj.toISOString().split('T')[0]);
      }
    }
  }, [projectId, isOpen, projects, isNewProject]);

  // Escape key closing support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Project name is required.", "error");
      return;
    }

    if (isNewProject) {
      addProject(name.trim(), description.trim(), selectedColor, targetDate);
    } else if (projectId) {
      const existing = projects.find(p => p.id === projectId);
      if (existing) {
        updateProject({
          ...existing,
          name: name.trim(),
          description: description.trim(),
          color: selectedColor,
          targetDate
        });
      }
    }
    onClose();
  };

  return (
    <div 
      id="project-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="project-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-600" />
            {isNewProject ? 'Create New Project' : 'Edit Project Workspace'}
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-sm font-semibold transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Workspace Overview / Description
            </label>
            <textarea
              placeholder="Provide a summary of goals and scopes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-700 text-sm transition"
            />
          </div>

          {/* Target Completion Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" /> Planned Due Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm font-medium"
            />
          </div>

          {/* Color theme chips selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Workspace Flag Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_CHIPS.map(chip => (
                <button
                  key={chip.value}
                  type="button"
                  title={chip.name}
                  onClick={() => setSelectedColor(chip.value)}
                  className={`h-7 w-7 rounded-lg ${chip.bg} transition-all relative border-2 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95
                    ${selectedColor === chip.value ? 'border-indigo-400 scale-105 shadow-md shadow-indigo-100' : 'border-transparent opacity-80'}
                  `}
                >
                  {selectedColor === chip.value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/25 rounded-md">
                      <span className="text-[10px] text-white">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition active:translate-y-0.5"
            >
              {isNewProject ? 'Create Project' : 'Save Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
