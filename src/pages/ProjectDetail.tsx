/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { 
  FolderIcon, LayoutGrid, List, Search, Filter, Plus, 
  Trash2, Edit, Calendar, MessageSquare, AlertCircle, ChevronDown, 
  ArrowUpDown, CheckCircle, Clock, ToggleLeft, ToggleRight, X, ChevronRight, User as UserIcon
} from 'lucide-react';

interface ProjectDetailProps {
  onOpenTaskDetail: (id: number) => void;
  onOpenNewTask: (projectId: number) => void;
}

export default function ProjectDetail({ onOpenTaskDetail, onOpenNewTask }: ProjectDetailProps) {
  const { id } = useParams<{ id: string }>();
  const { 
    projects, tasks, team, moveTaskStatus, deleteTask, addToast 
  } = useApp();

  const projectId = Number(id);
  const currentProject = projects.find(p => p.id === projectId);

  // States
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter settings
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sorting list state
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Drag over column indicator states
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Fallback if project is missing
  if (!currentProject) {
    return (
      <div className="p-8 text-center space-y-4 max-w-xl mx-auto">
        <FolderIcon className="h-14 w-14 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Project not found</h2>
        <p className="text-xs text-slate-500">The project folder you are requesting might have been deleted or is unavailable in this workspace.</p>
        <Link to="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold inline-block">
          Return to Projects
        </Link>
      </div>
    );
  }

  // Filter Tasks belonging to this specific project
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  // Apply filters and searches
  const filteredTasks = projectTasks.filter(task => {
    // 1. Search Query mapping
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Priority Filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    // 3. Assignee Filter
    const matchesAssignee = filterAssignee === 'all' || task.assigneeId === Number(filterAssignee);

    // 4. Status Filter (specifically useful in list view)
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesAssignee && matchesStatus;
  });

  // Sort tasks list
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let outcome = 0;
    if (sortBy === 'title') {
      outcome = a.title.localeCompare(b.title);
    } else if (sortBy === 'dueDate') {
      outcome = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'status') {
      outcome = a.status.localeCompare(b.status);
    } else if (sortBy === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      outcome = priorityMap[a.priority] - priorityMap[b.priority];
    }
    return sortOrder === 'asc' ? outcome : -outcome;
  });

  const handleSortToggle = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortBy(field);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = Number(taskIdStr);
      moveTaskStatus(taskId, status);
    }
    setDragOverColumn(null);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleQuickDelete = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    if (window.confirm("Delete this task card permanently?")) {
      deleteTask(taskId);
    }
  };

  // Status Columns Map for Board View
  const COLUMNS: { id: TaskStatus; name: string; bg: string; text: string; dot: string }[] = [
    { id: 'todo', name: 'To Do', bg: 'bg-slate-100/70', text: 'text-slate-700', dot: 'bg-slate-400' },
    { id: 'in-progress', name: 'In Progress', bg: 'bg-indigo-50/55', text: 'text-indigo-750', dot: 'bg-indigo-500' },
    { id: 'review', name: 'In Review', bg: 'bg-purple-50/50 border-purple-100', text: 'text-purple-750', dot: 'bg-purple-500' },
    { id: 'done', name: 'Done', bg: 'bg-emerald-50/55', text: 'text-emerald-750', dot: 'bg-emerald-500' }
  ];

  const hasActiveFilters = filterPriority !== 'all' || filterAssignee !== 'all' || filterStatus !== 'all' || searchQuery;

  const resetAllFilters = () => {
    setFilterPriority('all');
    setFilterAssignee('all');
    setFilterStatus('all');
    setSearchQuery('');
    addToast("Cleared active filter parameters.", "info");
  };

  return (
    <div id="project-workspace" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto flex flex-col h-full min-h-[calc(100vh-64px)]">
      
      {/* Breadcrumbs and Top Toolbar Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link to="/projects" className="hover:text-indigo-650 transition">Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-800">Workspace Details</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="h-4.5 w-4.5 rounded-md inline-block shrink-0" style={{ backgroundColor: currentProject.color }} />
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">
              {currentProject.name}
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed mt-1">
            {currentProject.description || "Establish boards, filters parameters, dragging task boxes, and comments."}
          </p>
        </div>

        {/* Action controls right row */}
        <div className="flex items-center gap-2.5">
          {/* Board vs List View Toggle Switch */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center shrink-0">
            <button
              id="view-toggle-board"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition
                ${viewMode === 'board' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-850'}
              `}
            >
              <LayoutGrid className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
            <button
              id="view-toggle-list"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition
                ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-850'}
              `}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Structured List</span>
            </button>
          </div>

          <button
            id="workspace-btn-new-task"
            onClick={() => onOpenNewTask(currentProject.id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/10 transition active:translate-y-0.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Operations Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input bar */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search task title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 focus:outline-hidden focus:border-indigo-500 rounded-xl bg-slate-50/50 text-slate-800"
          />
        </div>

        {/* Filters Trigger button & Active States summary */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold select-none cursor-pointer transition
              ${showFilters || hasActiveFilters 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-750' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}
            `}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Criteria</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-indigo-600 ml-1" />
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-slate-450 hover:text-rose-600 text-xs font-bold underline decoration-dotted decoration-slate-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Criteria Dropdown Pane */}
      {showFilters && (
        <div id="filter-panel" className="bg-white p-5 rounded-xl border border-slate-150 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {/* Priority Choice */}
          <div>
            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Priority Level</label>
            <select
              id="filter-select-priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Only</option>
              <option value="medium">🟠 Medium Only</option>
              <option value="low">🟡 Low Only</option>
            </select>
          </div>

          {/* Assignee choices */}
          <div>
            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Assignee</label>
            <select
              id="filter-select-assignee"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white font-medium"
            >
              <option value="all">All Team Members</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          {/* Status mapping list */}
          <div>
            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Workflow Status</label>
            <select
              id="filter-select-status"
              value={filterStatus}
              disabled={viewMode === 'board'}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {viewMode === 'board' ? (
                <option value="all">Board locks Status</option>
              ) : (
                <>
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Completed (Done)</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}

      {/* Filter state chips row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {filterPriority !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0">
              Priority: {filterPriority}
              <button onClick={() => setFilterPriority('all')} className="text-slate-400 hover:text-slate-600 font-bold shrink-0">×</button>
            </span>
          )}
          {filterAssignee !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0">
              Assignee: {team.find(m => m.id === Number(filterAssignee))?.name}
              <button onClick={() => setFilterAssignee('all')} className="text-slate-400 hover:text-slate-600 font-bold shrink-0">×</button>
            </span>
          )}
          {filterStatus !== 'all' && viewMode === 'list' && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0">
              Status: {filterStatus}
              <button onClick={() => setFilterStatus('all')} className="text-slate-400 hover:text-slate-600 font-bold shrink-0">×</button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 font-bold shrink-0">×</button>
            </span>
          )}
        </div>
      )}

      {/* Main Board view vs list view rendering */}
      {viewMode === 'board' ? (
        /* KANBAN BOARD CONTAINER */
        <div id="board-lanes-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto flex-1 pb-4">
          {COLUMNS.map(col => {
            const columnTasks = sortedTasks.filter(t => t.status === col.id);
            const isDragOver = dragOverColumn === col.id;

            return (
              <div
                id={`kanban-column-${col.id}`}
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={handleDragLeave}
                className={`rounded-2xl p-4 flex flex-col h-full min-h-[480px] max-h-[80vh] overflow-y-auto transition-all duration-200 border border-transparent
                  ${col.bg} 
                  ${isDragOver ? 'ring-2 ring-blue-500/50 bg-slate-100/90 border-blue-200 scale-[1.01]' : ''}
                `}
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                    <h3 className={`font-extrabold text-sm tracking-tight ${col.text}`}>{col.name}</h3>
                  </div>
                  <span className="bg-slate-200/60 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Cards body */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200/55 rounded-xl flex items-center justify-center p-4 text-center">
                      <p className="text-[11px] text-slate-400 italic">No tasks in this lane</p>
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const user = team.find(member => member.id === task.assigneeId);
                      return (
                        <div
                          id={`task-card-${task.id}`}
                          key={task.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => onOpenTaskDetail(task.id)}
                          className="bg-white rounded-xl border border-slate-150 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition duration-150 cursor-grab active:cursor-grabbing select-none group"
                        >
                          <div className="space-y-3">
                            {/* Card badge indicators */}
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
                                ${task.priority === 'high' ? 'bg-rose-50 border border-rose-100 text-rose-700' : 
                                  task.priority === 'medium' ? 'bg-amber-50 border border-amber-100 text-amber-700' : 
                                  'bg-blue-50 border border-blue-100 text-blue-700'
                                }`}
                              >
                                {task.priority}
                              </span>
                              
                              {/* Quick delete for testing */}
                              <button
                                onClick={(e) => handleQuickDelete(e, task.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded-md transition"
                                title="Delete task card"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Task Name */}
                            <h4 className="font-extrabold text-slate-800 text-xs lines-clamp-2 leading-snug tracking-tight">
                              {task.title}
                            </h4>

                            {/* Brief task description */}
                            {task.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Card Meta footer */}
                            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                              {/* Due Date Indicator */}
                              <span className="inline-flex items-center gap-1 shrink-0">
                                <Calendar className="h-3 w-3 text-slate-450" />
                                {task.dueDate}
                              </span>

                              {/* Assignee Avatar */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {task.commentsCount > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-450 pr-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {task.commentsCount}
                                  </span>
                                )}
                                <div 
                                  className="h-6 w-6 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-[9px] shadow-xs"
                                  title={`${task.assignee} (${user?.role || 'Teammate'})`}
                                >
                                  {user?.avatar || task.assignee.substring(0,2).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
                    </div>
                  </th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Assignee
                  </th>
                  <th 
                    onClick={() => handleSortToggle('dueDate')}
                    className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] select-none cursor-pointer hover:text-slate-800"
                  >
                    <div className="flex items-center gap-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">
                    Comments
                  </th>
                  <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-slate-350 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium font-semibold">No tasks match your filter parameters</p>
                    </td>
                  </tr>
                ) : (
                  sortedTasks.map(task => {
      ) : (
          <VirtualizedTaskList
            tasks={sortedTasks}
            team={team}
            onOpenTaskDetail={onOpenTaskDetail}
            projectId={projectId}
          />
        )}
    </div>
  );
}
