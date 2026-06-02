/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { 
  FolderOpen, Plus, Search, Calendar, CheckSquare, 
  Trash2, Edit, ChevronRight, Info, Award, AlertCircle
} from 'lucide-react';

interface ProjectListProps {
  onOpenNewProject: () => void;
  onOpenEditProject: (id: number) => void;
}

export default function ProjectList({ onOpenNewProject, onOpenEditProject }: ProjectListProps) {
  const { projects, deleteProject, tasks } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter projects by searchQuery
  const filteredProjects = projects.filter(proj => 
    proj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    proj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Warning: Deleting this project will wipe all of its associated task cards permanently. Proceed?")) {
      deleteProject(id);
    }
  };

  const handleEditClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onOpenEditProject(id);
  };

  return (
    <div id="project-list-view" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Add Project CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Project Workspaces</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize teams, monitor tasks status, and track milestone accomplishments.
          </p>
        </div>

        <button
          id="btn-new-project"
          onClick={onOpenNewProject}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/10 transition active:translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Options Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="proj-search-input"
            type="text"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 focus:outline-hidden focus:border-indigo-500 rounded-xl bg-slate-50/50 text-slate-800"
          />
        </div>
        <div className="text-[11px] text-slate-400 font-bold shrink-0">
          Showing {filteredProjects.length} spaces
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div id="projects-empty-state" className="bg-white border rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <FolderOpen className="h-14 w-14 text-indigo-100 mx-auto" />
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-800">No project workspaces found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {searchQuery 
                ? "No metrics match your current search query. Try typing another criteria or clear filters." 
                : "Create your first project workspace to start grouping cards, establishing boards, and tracking team deliverables!"
              }
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={onOpenNewProject}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
            >
              Add First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => {
            const projectTasks = tasks.filter(t => t.projectId === proj.id);
            const highPriTasks = projectTasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/project/${proj.id}`)}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition duration-200 cursor-pointer overflow-hidden flex flex-col group"
              >
                {/* Accent Banner Indicator */}
                <div 
                  className="h-2.5 w-full shrink-0" 
                  style={{ backgroundColor: proj.color }}
                />

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Title block */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-extrabold text-slate-800 tracking-tight text-sm.5 group-hover:text-indigo-600 transition truncate leading-snug">
                        {proj.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Edit Workspace parameters"
                          onClick={(e) => handleEditClick(e, proj.id)}
                          className="p-1 px-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-md"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Delete Workspace permanently"
                          onClick={(e) => handleDeleteClick(e, proj.id)}
                          className="p-1 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-md"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {proj.description || "No workspace descriptive scope has been established."}
                    </p>
                  </div>

                  {/* High urgency flags if any */}
                  {highPriTasks > 0 && (
                    <div className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2.5 py-1 rounded-md inline-flex items-center gap-1 w-max">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {highPriTasks} High-Priority Pending Tasks
                    </div>
                  )}

                  {/* Completion and Progress indicator */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <CheckSquare className="h-3.5 w-3.5 text-slate-400" /> Card Progress
                      </span>
                      <span className="font-extrabold text-slate-700 font-mono">
                        {proj.completedTaskCount} / {proj.taskCount} ({proj.progress}%)
                      </span>
                    </div>

                    {/* Progress Bar wrap */}
                    <div className="w-full bg-slate-155 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${proj.progress}%`,
                          backgroundColor: proj.color 
                        }}
                      />
                    </div>
                  </div>

                  {/* Workspace footer actions */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>End: {proj.targetDate || "None"}</span>
                    </div>

                    <span className="text-indigo-600 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                      Enter Workspace <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
