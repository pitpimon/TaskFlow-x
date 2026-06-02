/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { getTheme } from '../theme';
import { 
  CheckSquare, Calendar, ChevronRight, AlertCircle, 
  TrendingUp, Activity as ActivityIcon, Sparkles,
  Search, Bell, User as UserIcon, PlusCircle, CheckCircle, Clock,
  FolderLock, Layers, Award, Terminal, BadgeHelp, Check
} from 'lucide-react';

interface DashboardProps {
  onOpenTaskDetail: (id: number) => void;
  onOpenNewTask: () => void;
}

export default function Dashboard({ onOpenTaskDetail, onOpenNewTask }: DashboardProps) {
  const { 
    tasks, projects, team, activities, userProfile, addTask, addToast, updateUserProfile, logActivity, preferences, resetMockData 
  } = useApp();

  const theme = getTheme(preferences.theme);

  // Search local querying
  const [searchQuery, setSearchQuery] = useState('');
  const [bellActive, setBellActive] = useState(false);

  // Quick Task form states
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProject, setQuickProject] = useState<number>(1);
  const [quickAssignee, setQuickAssignee] = useState<number>(1);
  const [quickDueDate, setQuickDueDate] = useState('2026-06-15');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('medium');

  // Dynamically resolve assignee ID matching current persona's email
  const currentMember = team.find(m => m.email.toLowerCase() === userProfile.email.toLowerCase());
  const currentUserId = currentMember ? currentMember.id : 1;

  // Load active user specific tasks
  const myTasks = tasks.filter(t => t.assigneeId === currentUserId);
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

  const handleSwitchPersona = (member: typeof team[0]) => {
    updateUserProfile({
      name: member.name,
      email: member.email,
      title: member.role,
      avatar: member.avatar
    });
    logActivity(`Switched session to test persona: ${member.name} (${member.role})`);
    addToast(`As ${member.name}, you now see personal targets & custom workspace streams.`, 'info');
  };

  return (
    <div id="bento-dashboard" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Hero Area block */}
      <div id="dash-header" className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${theme.cardBg} p-6 rounded-3xl border ${theme.cardBorder} transition-colors duration-200`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl md:text-2xl font-black ${theme.textMain} tracking-tight`}>
              Good day, {userProfile.name}! 👋
            </h1>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border ${theme.accentBgLight} ${theme.accentTextList}`}>
              <Sparkles className="h-3 w-3" /> Bento Experience Matrix
            </span>
          </div>
          <p className={`text-xs ${theme.textBody} mt-1`}>
            Browse through your workspace, active task queues, project aggregates, and productivity cells.
          </p>
        </div>

        {/* Global search and layout controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${theme.textMuted}`} />
            <input
              type="text"
              placeholder="Fast filter active deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-1.5 focus:outline-hidden focus:ring-2 ${theme.primaryRing} ${theme.borderFocus} text-xs border ${theme.cardBorder} rounded-xl w-64 ${theme.inputBg} ${theme.textMain} font-semibold transition-all`}
            />
          </div>

          <button
            id="btn-bell"
            onClick={() => {
              setBellActive(!bellActive);
              addToast(bellActive ? "Alert notifications muted." : "Awaiting workspace stream activity.", "info");
            }}
            className={`p-2 rounded-xl border transition relative cursor-pointer
              ${bellActive ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : `${theme.inputBg} hover:opacity-80 ${theme.cardBorder} ${theme.textBody}`}
            `}
          >
            <Bell className="h-4 w-4" />
            {bellActive && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* 1.5. Interactive Testing Personas Selection panel */}
      <div id="testing-personas-panel" className={`p-6 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} transition-colors duration-200 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <Terminal className={`h-4.5 w-4.5 ${theme.primaryText}`} />
            <h2 className={`font-black text-sm ${theme.textMain} uppercase tracking-wider`}>
              Interactive Test Personas
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => resetMockData()}
              className="text-[10px] font-black px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer select-none transition-all duration-100 flex items-center gap-1 shadow-xs"
              title="Reset workspace state and seed with default demo records"
            >
              ⚡ Re-seed Sandbox Demo
            </button>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${theme.id === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              Frontend Sandbox Engine
            </span>
          </div>
        </div>
        
        <p className={`text-[11px] ${theme.textBody} leading-relaxed max-w-3xl`}>
          Choose a role below to simulate the workspace as different team members. The dashboard metrics, quick assignment lists, and personal targets will automatically re-align to matches their specific profiles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member) => {
            const isCurrent = userProfile.email.toLowerCase() === member.email.toLowerCase();
            return (
              <div
                key={member.id}
                onClick={() => handleSwitchPersona(member)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between items-stretch gap-3 group relative overflow-hidden
                  ${isCurrent 
                    ? `border-2 ${theme.id === 'dark' ? 'border-violet-500' : 'border-indigo-600'} ${theme.id === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50/80'} shadow-sm` 
                    : `${theme.cardBorder} ${theme.id === 'dark' ? 'bg-slate-800/10' : 'bg-slate-50/20'} hover:scale-[1.01] hover:border-slate-350`
                  }
                `}
              >
                {/* Decorative border accent */}
                {isCurrent && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.primaryBg}`} />
                )}

                <div className="flex items-center gap-3">
                  {/* Initials Avatar badge */}
                  <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 border uppercase tracking-wider
                    ${isCurrent
                      ? `${theme.primaryBg} text-white`
                      : `${theme.accentBgLight} ${theme.accentTextList} ${theme.cardBorder}`
                    }
                  `}>
                    {member.avatar}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-xs ${theme.textMain} truncate group-hover:text-amber-600/90 transition-colors`}>
                      {member.name}
                    </h3>
                    <p className={`text-[10px] ${theme.textMuted} truncate uppercase font-extrabold tracking-wider leading-tight`}>
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100/50 pt-2 mt-1">
                  <span className={`text-[9px] ${theme.textMuted} truncate font-mono`}>
                    {member.email}
                  </span>
                  {isCurrent ? (
                    <span className={`text-[9px] font-black ${theme.primaryText} flex items-center gap-0.5 shrink-0 uppercase tracking-wider`}>
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  ) : (
                    <span className={`text-[9px] font-extrabold text-slate-400 group-hover:${theme.primaryText} transition shrink-0`}>
                      Act As
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Primary Bento Grid Layout cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
        
        {/* KPI: Time Logged Widget (Orange / Warm accent style) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition duration-155`}>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className={`text-xs font-black ${theme.textMuted} uppercase tracking-wider`}>Time Logged</h3>
          </div>
          <div className="mt-4">
            <p className={`text-4xl font-black ${theme.textMain}`}>128.5<span className="text-xs text-slate-450 ml-1 font-bold">hrs</span></p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-0.5">✦ +12% from last milestone</p>
          </div>
        </div>

        {/* KPI: Tasks Done widget (Indigo Accent style) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition duration-155`}>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className={`text-xs font-black ${theme.textMuted} uppercase tracking-wider`}>Tasks Done</h3>
          </div>
          <div className="mt-4">
            <p className={`text-4xl font-black ${theme.textMain}`}>{completedCount}</p>
            <p className={`text-[11px] ${theme.textBody} font-bold mt-1.5`}>Avg 45 units completed per sprint</p>
          </div>
        </div>

        {/* KPI: Due Soon Urgency widgets (Rose flair) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition duration-155`}>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className={`text-xs font-black ${theme.textMuted} uppercase tracking-wider`}>Due Soon</h3>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-rose-600">{dueSoonCount}</p>
            <p className="text-[11px] text-rose-500 font-extrabold mt-1.5">Action required within 7 days</p>
          </div>
        </div>

        {/* KPI: Active In-Progress widgets (Amber flair) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition duration-155`}>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className={`text-xs font-black ${theme.textMuted} uppercase tracking-wider`}>Active State</h3>
          </div>
          <div className="mt-4">
            <p className={`text-4xl font-black ${theme.textMain}`}>{inProgressCount}</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1.5">Deliverables under active work</p>
          </div>
        </div>

        {/* Bento Card: Active Projects Overview (col-span-2) */}
        <div className={`col-span-1 lg:col-span-2 ${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 flex flex-col shadow-sm hover:border-slate-355 transition duration-155`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className={`h-5 w-5 ${theme.primaryText}`} />
              <h2 className={`font-extrabold ${theme.textMain} text-base`}>Active Projects Workspace</h2>
            </div>
            <span className={`${theme.primaryText} text-xs font-black uppercase tracking-wider`}>Milestone Snapshot</span>
          </div>

          <div className="space-y-4 flex-1">
            {projects.slice(0, 3).map(proj => (
              <div key={proj.id} className={`p-3.5 rounded-2xl ${theme.id === 'dark' ? 'bg-slate-800/40' : 'bg-slate-50'} border ${theme.cardBorder} flex items-center justify-between gap-4`}>
                <div className="flex items-center min-w-0">
                  <div className="w-3.5 h-3.5 rounded-full mr-3.5 shrink-0" style={{ backgroundColor: proj.color }} />
                  <div className="min-w-0">
                    <h3 className={`font-bold text-xs ${theme.textMain} truncate`}>{proj.name}</h3>
                    <p className={`text-[10px] ${theme.textMuted} mt-0.5 truncate`}>Progress aggregate • {proj.taskCount - proj.completedTaskCount} tasks remaining</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-black ${theme.textMain}`}>{proj.progress}%</p>
                  <div className={`w-24 ${theme.id === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-1 mt-1 overflow-hidden`}>
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
              <h3 className="text-lg md:text-xl font-extrabold mt-3 tracking-tight text-white">Weekly Performance</h3>
              <p className="text-slate-355 text-xs mt-1.5 max-w-[280px] leading-relaxed">
                Your workspace team has completed 90% of their assigned targets this weekly cycle. Good job!
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => addToast("Performance metrics summarized.", "success")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition text-white cursor-pointer"
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
        <div className={`col-span-1 lg:col-span-2 ${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-355 transition duration-155`}>
          <div>
            <h2 className={`font-extrabold ${theme.textMain} text-sm.5`}>Team Capacity Presence</h2>
            <p className={`text-[10px] ${theme.textMuted} mt-1`}>Available sprint workload reserves relative to assignments</p>
          </div>

          <div className="flex justify-between items-center my-4">
            <div className="flex -space-x-3 overflow-hidden">
              {team.slice(0, 4).map(member => (
                <div 
                  key={member.id} 
                  className={`w-11 h-11 rounded-full border-4 ${theme.id === 'dark' ? 'border-slate-850' : 'border-white'} ${theme.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ${theme.accentTextList} font-extrabold flex items-center justify-center text-xs shadow-xs`}
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
              <p className={`text-[9px] ${theme.textMuted} uppercase font-bold tracking-widest`}>Status</p>
              <p className="text-emerald-500 font-black text-xs">Full Strength Available</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className={`h-2 w-full ${theme.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} rounded-full overflow-hidden`}>
              <div className={`h-full w-[82%] ${theme.primaryBg} rounded-full`} />
            </div>
            <div className={`flex items-center justify-between text-[11px] ${theme.textBody}`}>
              <span>Available hours: 140 / 180h this week</span>
              <span className={`font-bold ${theme.textMain}`}>82%</span>
            </div>
          </div>
        </div>

        {/* Bento Card: My Assigned Tasks List (col-span-2) */}
        <div className={`col-span-1 lg:col-span-2 ${theme.cardBg} border ${theme.cardBorder} rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-355 transition duration-155`}>
          <div>
            <div className={`px-6 py-4 border-b ${theme.cardBorder} flex items-center justify-between`}>
              <h2 className={`text-sm font-extrabold ${theme.textMain} flex items-center gap-1.5`}>
                <CheckSquare className={`h-4.5 w-4.5 ${theme.primaryText}`} />
                Your Active Deliverables ({filteredMyTasks.length})
              </h2>
              {searchQuery && (
                <span className={`text-[9.5px] ${theme.accentBgLight} ${theme.accentTextList} font-bold px-2 py-0.5 rounded-md`}>
                  Found {filteredMyTasks.length}
                </span>
              )}
            </div>

            <div className={`divide-y ${theme.id === 'dark' ? 'divide-slate-800' : 'divide-slate-100'} max-h-[290px] overflow-y-auto`}>
              {filteredMyTasks.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckSquare className={`h-8 w-8 ${theme.textMuted} mx-auto`} />
                  <p className={`text-xs ${theme.textBody} font-medium`}>
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
                      className={`px-6 py-3 ${theme.id === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition flex items-center justify-between gap-4 cursor-pointer select-none group`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold ${theme.textMain} text-xs truncate group-hover:${theme.primaryText} transition leading-tight`}>
                            {task.title}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 mt-1 text-[10px] ${theme.textMuted}`}>
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${theme.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} font-mono text-slate-400 uppercase`}>
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
                        <ChevronRight className={`h-3.5 w-3.5 ${theme.textMuted} group-hover:${theme.textMain} group-hover:translate-x-0.5 transition`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className={`p-4 border-t ${theme.cardBorder} text-center ${theme.id === 'dark' ? 'bg-slate-850/30' : 'bg-slate-50/50'} rounded-b-3xl`}>
            <button 
              onClick={onOpenNewTask}
              className={`text-[11px] ${theme.primaryText} font-bold hover:underline cursor-pointer`}
            >
              + Create task in your workspace list
            </button>
          </div>
        </div>

        {/* Bento Card: Quick Task Form (col-span-1) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-355 transition duration-155`}>
          <div className="space-y-4">
            <h2 className={`text-xs font-black ${theme.textMain} uppercase tracking-widest flex items-center gap-1.5`}>
              <PlusCircle className={`h-4 w-4 ${theme.primaryText}`} />
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
                className={`w-full px-3 py-2 rounded-lg text-xs border ${theme.cardBorder} focus:outline-hidden ${theme.borderFocus} ${theme.inputBg} ${theme.textMain} font-semibold`}
              />

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className={`block text-[9px] ${theme.textMuted} font-bold uppercase tracking-wider mb-0.5`}>Project</label>
                  <select
                    id="quick-task-project"
                    value={quickProject}
                    onChange={(e) => setQuickProject(Number(e.target.value))}
                    className={`w-full p-1 text-[11px] border ${theme.cardBorder} rounded-md ${theme.inputBg} font-medium ${theme.textMain}`}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[9px] ${theme.textMuted} font-bold uppercase tracking-wider mb-0.5`}>Assignee</label>
                  <select
                    id="quick-task-assignee"
                    value={quickAssignee}
                    onChange={(e) => setQuickAssignee(Number(e.target.value))}
                    className={`w-full p-1 text-[11px] border ${theme.cardBorder} rounded-md ${theme.inputBg} font-medium ${theme.textMain}`}
                  >
                    {team.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className={`block text-[9px] ${theme.textMuted} font-bold uppercase tracking-wider mb-0.5`}>Due Date</label>
                  <input
                    id="quick-task-duedate"
                    type="date"
                    value={quickDueDate}
                    onChange={(e) => setQuickDueDate(e.target.value)}
                    className={`w-full p-1 text-[11px] border ${theme.cardBorder} rounded-md ${theme.inputBg} ${theme.textMain}`}
                  />
                </div>

                <div>
                  <label className={`block text-[9px] ${theme.textMuted} font-bold uppercase tracking-wider mb-0.5`}>Priority</label>
                  <select
                    id="quick-task-priority"
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
                    className={`w-full p-1 text-[11px] border ${theme.cardBorder} rounded-md ${theme.inputBg} ${theme.textMain}`}
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
                className={`w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-lg text-xs tracking-wide shadow-xs transition active:translate-y-0.5 cursor-pointer`}
              >
                Quick Dispatch
              </button>
            </form>
          </div>
        </div>

        {/* Bento Card: Recent Workspace pulse (col-span-1) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-355 transition duration-155`}>
          <div>
            <h2 className={`text-xs font-black ${theme.textMain} uppercase tracking-widest flex items-center gap-1.5 mb-4`}>
              <ActivityIcon className="h-4 w-4 text-emerald-500" />
              Activity Pulse
            </h2>
            
            <div className="relative pl-3.5 space-y-3.5 max-h-[190px] overflow-y-auto">
              <span className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-slate-100" />
              {activities.slice(0, 4).map(activity => (
                <div key={activity.id} className={`relative flex gap-2 h-auto items-start group ${theme.textBody}`}>
                  <span className="h-2.5 w-2.5 bg-emerald-100 ring-4 ring-white border border-emerald-500 rounded-full flex items-center justify-center shrink-0 z-10 mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-medium leading-normal break-words">{activity.text}</p>
                    <span className={`text-[9px] ${theme.textMuted} block mt-0.5 font-normal`}>{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-3 border-t ${theme.cardBorder} text-right`}>
            <span className={`text-[9px] uppercase font-bold ${theme.textMuted}`}>Stream Status: Live</span>
          </div>
        </div>

      </div>
    </div>
  );
}
