/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { 
  CheckSquare, Calendar, ChevronRight, AlertCircle, 
  TrendingUp, Activity as ActivityIcon, Sparkles,
  Search, Bell, User as UserIcon, PlusCircle, CheckCircle, Clock,
  FolderLock, Layers, Award
} from 'lucide-react';

interface DashboardProps {
  onOpenTaskDetail: (id: number) => void;
  onOpenNewTask: () => void;
}

export default function Dashboard({ onOpenTaskDetail, onOpenNewTask }: DashboardProps) {
  const { 
    tasks, projects, team, activities, userProfile, addTask, addToast 
  } = useApp();

  // Search local querying
  const [searchQuery, setSearchQuery] = useState('');
  const [bellActive, setBellActive] = useState(false);

  // Quick Task form states
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProject, setQuickProject] = useState<number>(1);
  const [quickAssignee, setQuickAssignee] = useState<number>(1);
  const [quickDueDate, setQuickDueDate] = useState('2026-06-15');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('medium');

  // Load user specific tasks (Id: 1)
  const myTasks = tasks.filter(t => t.assigneeId === 1);
  const pendingTasks = myTasks.filter(t => t.status !== 'done');
  
  // Calculate upcoming due tasks (due within next 7 days in June 2026)
  const dueSoonCount = tasks.filter(t => {
    if (t.status === 'done') return false;
    const diff = new Date(t.dueDate).getTime() - new Date('2026-06-02').getTime();
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'done').length;

  const handleQuickTaskCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) {
      addToast("Please provide a task title for quick creation.", "error");
      return;
    }

    const assignedUser = team.find(m => m.id === Number(quickAssignee));

    addTask({
      title: quickTitle.trim(),
      description: "Quick task created from the dashboard entry portal.",
      projectId: Number(quickProject),
      status: 'todo',
      priority: quickPriority,
      assigneeId: Number(quickAssignee),
      assignee: assignedUser ? assignedUser.name : 'Unassigned',
      dueDate: quickDueDate,
      labels: ["Dashboard-Quick"]
    });

    setQuickTitle('');
    addToast(`Quick task "${quickTitle}" created!`, 'success');
  };

  // Filter tasks matching search query
  const filteredMyTasks = pendingTasks.filter(t => {
    const term = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term);
  });

  return (
    <div id="bento-dashboard" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Hero Area block */}
      <div id="dash-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Good day, {userProfile.name}! 👋
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-indigo-150">
              <Sparkles className="h-3 w-3" /> Bento Experience Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse through your workspace, active task queues, project aggregates, and productivity cells.
          </p>
        </div>

        {/* Global search and layout controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Fast filter active deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-xs border border-slate-200 rounded-xl w-64 bg-slate-50/50"
            />
          </div>

          <button
            id="btn-bell"
            onClick={() => {
              setBellActive(!bellActive);
              addToast(bellActive ? "Alert notifications muted." : "Awaiting workspace stream activity.", "info");
            }}
            className={`p-2 rounded-xl border transition relative cursor-pointer
              ${bellActive ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'}
            `}
          >
            <Bell className="h-4 w-4" />
            {bellActive && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Primary Bento Grid Layout cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
        
        {/* KPI: Time Logged Widget (Orange / Warm accent style) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Time Logged</h3>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-slate-800">128.5<span className="text-xs text-slate-400 ml-1 font-bold">hrs</span></p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-0.5">✦ +12% from last milestone</p>
          </div>
        </div>

        {/* KPI: Tasks Done widget (Indigo Accent style) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Tasks Done</h3>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-slate-800">{completedCount}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5">Avg 45 units completed per sprint</p>
          </div>
        </div>

        {/* KPI: Due Soon Urgency widgets (Rose flair) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Due Soon</h3>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-rose-600">{dueSoonCount}</p>
            <p className="text-[11px] text-rose-500 font-extrabold mt-1.5">Action required within 7 days</p>
          </div>
        </div>

        {/* KPI: Active In-Progress widgets (Amber flair) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Active State</h3>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-slate-800">{inProgressCount}</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1.5">Deliverables under active work</p>
          </div>
        </div>

        {/* Bento Card: Active Projects Overview (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm hover:border-slate-300 transition duration-155">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <h2 className="font-extrabold text-slate-850 text-base">Active Projects Workspace</h2>
            </div>
            <span className="text-indigo-600 text-xs font-black uppercase tracking-wider">Milestone Snapshot</span>
          </div>

          <div className="space-y-4 flex-1">
            {projects.slice(0, 3).map(proj => (
              <div key={proj.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="w-3.5 h-3.5 rounded-full mr-3.5 shrink-0" style={{ backgroundColor: proj.color }} />
                  <div>
                    <h3 className="font-bold text-xs text-slate-800">{proj.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Progress aggregate • {proj.taskCount - proj.completedTaskCount} tasks remaining</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-slate-700">{proj.progress}%</p>
                  <div className="w-24 bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: proj.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Card: Weekly Performance spotlight card with indigo background (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="z-10 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Performance Summary
              </span>
              <h3 className="text-lg md:text-xl font-extrabold mt-3 tracking-tight">Weekly Performance</h3>
              <p className="text-slate-350 text-xs mt-1.5 max-w-[280px]">
                Your workspace team has completed 90% of their assigned targets this weekly cycle. Good job!
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => addToast("Performance metrics summarized.", "success")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition text-white"
              >
                View Metrics
              </button>
            </div>
          </div>
          
          {/* Simulated aesthetic bar metrics widget on right side inside the layout */}
          <div className="absolute right-6 bottom-6 top-12 w-40 flex items-end space-x-2 z-10 opacity-30 md:opacity-100 pointer-events-none">
            <div className="w-3.5 h-[20%] bg-slate-750 rounded-t-sm" />
            <div className="w-3.5 h-[40%] bg-slate-750 rounded-t-sm" />
            <div className="w-3.5 h-[80%] bg-indigo-500 rounded-t-sm" />
            <div className="w-3.5 h-[60%] bg-slate-750 rounded-t-sm" />
            <div className="w-3.5 h-[90%] bg-indigo-400 rounded-t-sm animate-pulse" />
            <div className="w-3.5 h-[100%] bg-indigo-600 rounded-t-sm" />
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Bento Card: Team Capacity widget (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div>
            <h2 className="font-extrabold text-slate-800 text-sm.5">Team Capacity Presence</h2>
            <p className="text-[10px] text-slate-400 mt-1">Available sprint workload reserves relative to assignments</p>
          </div>

          <div className="flex justify-between items-center my-4">
            <div className="flex -space-x-3 overflow-hidden">
              {team.slice(0, 4).map(member => (
                <div 
                  key={member.id} 
                  className="w-11 h-11 rounded-full border-4 border-white bg-slate-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shadow-xs"
                  title={`${member.name} (${member.role})`}
                >
                  {member.avatar}
                </div>
              ))}
              {team.length > 4 && (
                <div className="w-11 h-11 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  +{team.length - 4}
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Status</p>
              <p className="text-emerald-500 font-black text-xs">Full Strength Available</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[82%] bg-indigo-600 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Available hours: 140 / 180h this week</span>
              <span className="font-bold text-slate-650">82%</span>
            </div>
          </div>
        </div>

        {/* Bento Card: My Assigned Tasks List (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <CheckSquare className="h-4.5 w-4.5 text-indigo-600" />
                Your Active Deliverables ({filteredMyTasks.length})
              </h2>
              {searchQuery && (
                <span className="text-[9.5px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                  Found {filteredMyTasks.length}
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100 max-h-[290px] overflow-y-auto">
              {filteredMyTasks.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckSquare className="h-8 w-8 text-slate-350 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    {searchQuery ? 'No pending tasks match your query' : 'Hooray! You do not have any pending tasks assigned.'}
                  </p>
                </div>
              ) : (
                filteredMyTasks.map(task => {
                  const proj = projects.find(p => p.id === task.projectId);
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => onOpenTaskDetail(task.id)}
                      className="px-6 py-3 hover:bg-slate-50/55 transition flex items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-xs truncate group-hover:text-indigo-600 transition leading-tight">
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 bg-slate-100 font-mono text-slate-600 uppercase">
                            {proj?.name || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0
                          ${task.priority === 'high' ? 'bg-rose-50 border-rose-100 text-rose-700' : 
                            task.priority === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-700' : 
                            'bg-indigo-50 border-indigo-100 text-indigo-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-350 group-hover:text-slate-650 group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50 rounded-b-3xl">
            <button 
              onClick={onOpenNewTask}
              className="text-[11px] text-indigo-600 font-bold hover:underline"
            >
              + Create task in your workspace list
            </button>
          </div>
        </div>

        {/* Bento Card: Quick Task Form (col-span-1) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              Quick Task Writer
            </h2>
            
            <form onSubmit={handleQuickTaskCreate} className="space-y-3">
              <input
                id="quick-task-title"
                type="text"
                required
                placeholder="Title... e.g., Setup auth"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-800 font-semibold"
              />

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Project</label>
                  <select
                    id="quick-task-project"
                    value={quickProject}
                    onChange={(e) => setQuickProject(Number(e.target.value))}
                    className="w-full p-1 text-[11px] border border-slate-200 rounded-md bg-white font-medium text-slate-700"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Assignee</label>
                  <select
                    id="quick-task-assignee"
                    value={quickAssignee}
                    onChange={(e) => setQuickAssignee(Number(e.target.value))}
                    className="w-full p-1 text-[11px] border border-slate-200 rounded-md bg-white font-medium text-slate-700"
                  >
                    {team.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Due Date</label>
                  <input
                    id="quick-task-duedate"
                    type="date"
                    value={quickDueDate}
                    onChange={(e) => setQuickDueDate(e.target.value)}
                    className="w-full p-1 text-[11px] border border-slate-200 rounded-md text-slate-650 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Priority</label>
                  <select
                    id="quick-task-priority"
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
                    className="w-full p-1 text-[11px] border border-slate-200 rounded-md bg-white text-slate-650"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <button
                id="btn-quick-task-submit"
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-lg text-xs tracking-wide shadow-xs transition active:translate-y-0.5 cursor-pointer"
              >
                Quick Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* Bento Card: Recent Workspace pulse (col-span-1) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition duration-155">
          <div>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-4">
              <ActivityIcon className="h-4 w-4 text-emerald-500" />
              Activity Pulse
            </h2>
            
            <div className="relative pl-3.5 space-y-3.5 max-h-[190px] overflow-y-auto">
              <span className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-slate-100" />
              {activities.slice(0, 4).map(activity => (
                <div key={activity.id} className="relative flex gap-2 h-auto items-start group text-slate-700">
                  <span className="h-2.5 w-2.5 bg-emerald-100 ring-4 ring-white border border-emerald-500 rounded-full flex items-center justify-center shrink-0 z-10 mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-medium leading-normal break-words">{activity.text}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-normal">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400">Stream Status: Live</span>
          </div>
        </div>

      </div>
    </div>
  );
}
