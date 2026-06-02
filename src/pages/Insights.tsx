/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTheme } from '../theme';
import { apiRequest } from '../lib/api';
import { 
  TrendingUp, CheckSquare, Clock, AlertCircle, Sparkles, 
  Users, Layers, Award, Terminal, Filter, Calendar, 
  CornerDownRight, ChevronRight, BarChart3, PieChart, Activity
} from 'lucide-react';

export default function Insights() {
  const { tasks, projects, team, preferences, addToast } = useApp();
  const theme = getTheme(preferences.theme);

  // Active selected user for performance analysis (defaults to user ID 1, Alice)
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [hoveredData, setHoveredData] = useState<{ label: string; value: string | number; x: number; y: number } | null>(null);

  // States loaded from API
  const [stats, setStats] = useState<{
    totalTasks: number;
    completedTasksCount: number;
    inProgressTasksCount: number;
    reviewTasksCount: number;
    todoTasksCount: number;
    completionRate: number;
    pendingCount: number;
    efficiencyIndex: number;
    summary: string;
  } | null>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [workloadData, setWorkloadData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize selectedUserId with team list when it changes
  useEffect(() => {
    if (team.length > 0 && !team.some(m => m.id === selectedUserId)) {
      setSelectedUserId(team[0].id);
    }
  }, [team, selectedUserId]);

  // Fetch metrics and analytics from the backend API
  useEffect(() => {
    if (!selectedUserId) return;
    
    let active = true;
    setIsLoading(true);

    Promise.all([
      apiRequest<any>(`/insights/stats?userId=${selectedUserId}`),
      apiRequest<any[]>(`/insights/timeline?userId=${selectedUserId}`),
      apiRequest<any[]>(`/insights/workload?userId=${selectedUserId}`)
    ])
      .then(([statsRes, timelineRes, workloadRes]) => {
        if (active) {
          setStats(statsRes);
          setTimelineData(timelineRes);
          setWorkloadData(workloadRes);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load insights data:', err);
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedUserId, tasks, projects]);

  // Find the selected member details
  const currentMember = useMemo(() => {
    return team.find(m => m.id === selectedUserId) || team[0] || { id: 1, name: 'Alice Johnson', role: 'Product Manager', email: 'alice@example.com', avatar: 'AJ' };
  }, [team, selectedUserId]);

  // Load all tasks associated with selected user (needed for local priority analysis in priority SVG)
  const userTasks = useMemo(() => {
    return tasks.filter(t => t.assigneeId === currentMember.id);
  }, [tasks, currentMember]);

  // Derived metrics from API stats with client fallback
  const totalTasks = stats?.totalTasks ?? userTasks.length;
  const completedTasksCount = stats?.completedTasksCount ?? userTasks.filter(t => t.status === 'done').length;
  const inProgressTasksCount = stats?.inProgressTasksCount ?? userTasks.filter(t => t.status === 'in-progress').length;
  const reviewTasksCount = stats?.reviewTasksCount ?? userTasks.filter(t => t.status === 'review').length;
  const todoTasksCount = stats?.todoTasksCount ?? userTasks.filter(t => t.status === 'todo').length;

  const completionRate = stats?.completionRate ?? (totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0);
  const pendingCount = stats?.pendingCount ?? (totalTasks - completedTasksCount);
  const efficiencyIndex = stats?.efficiencyIndex ?? 0;
  const insightSummaryParagraph = stats?.summary ?? 'Compiling performance report from workspace streams...';

  // Handle User Switching
  const handleSelectUser = (id: number) => {
    setSelectedUserId(id);
    setHoveredData(null);
    const m = team.find(x => x.id === id);
    if (m) {
      addToast(`Showing performance streams and analytical insights for ${m.name}.`, 'info');
    }
  };

  return (
    <div id="insights-view" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner containing Page Identity */}
      <div id="insights-header" className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${theme.cardBg} p-6 rounded-3xl border ${theme.cardBorder} transition-colors duration-200`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl md:text-2xl font-black ${theme.textMain} tracking-tight`}>
              Performance Insights Center
            </h1>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border ${theme.accentBgLight} ${theme.accentTextList}`}>
              <TrendingUp className="h-3 w-3" /> Real-time Analytics System
            </span>
          </div>
          <p className={`text-xs ${theme.textBody} mt-1`}>
            Evaluate sprint completions, project load balance, task completion speeds, and efficiency ratios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${theme.id === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            Bento Graphics v2.5
          </span>
        </div>
      </div>

      {/* 2. Team Directory / Quick Selector Row */}
      <div className={`p-5 rounded-3xl border ${theme.cardBorder} ${theme.cardBg} transition-colors duration-200 space-y-4`}>
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100/30">
          <Users className={`h-4 w-4 ${theme.primaryText}`} />
          <h2 className={`font-black text-xs ${theme.textMain} uppercase tracking-wider`}>
            Select Workspace Member to Inspect
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {team.map((member) => {
            const isSelected = member.id === selectedUserId;
            return (
              <div
                key={member.id}
                onClick={() => handleSelectUser(member.id)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 select-none flex items-center gap-2.5 relative overflow-hidden
                  ${isSelected
                    ? `border-2 ${theme.id === 'dark' ? 'border-violet-500' : 'border-indigo-600'} ${theme.id === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50/80'} shadow-sm`
                    : `${theme.cardBorder} hover:scale-[1.01] hover:border-slate-350 ${theme.id === 'dark' ? 'bg-slate-900/10' : 'bg-slate-50/20'}`
                  }
                `}
              >
                {/* Visual marker inside active profile */}
                {isSelected && (
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${theme.primaryBg}`} />
                )}

                <div className={`w-8 h-8 rounded-full font-black text-[11px] flex items-center justify-center shrink-0 border
                  ${isSelected
                    ? `${theme.primaryBg} text-white`
                    : `${theme.accentBgLight} ${theme.accentTextList} ${theme.cardBorder}`
                  }
                `}>
                  {member.avatar}
                </div>

                <div className="min-w-0 flex-1 leading-tight">
                  <h3 className={`font-bold text-xs ${theme.textMain} truncate`}>
                    {member.name.split(' ')[0]}
                  </h3>
                  <p className={`text-[9px] ${theme.textMuted} truncate uppercase font-extrabold tracking-wider mt-0.5`}>
                    {member.role.split(' ')[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Real-Time Efficiency Index & Dynamic AI Summary bento segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic AI Summary Text Card */}
        <div className={`col-span-1 lg:col-span-2 ${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              <h3 className={`text-sm font-black ${theme.textMain} uppercase tracking-wider`}>
                Diagnostic Synthesis Overview
              </h3>
            </div>
            <p className={`text-[12px] leading-relaxed ${theme.textBody} bg-slate-50/5 p-4 rounded-2xl border border-dashed border-slate-200/50`}>
              "{insightSummaryParagraph}"
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/10 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              <span className={`${theme.textMuted}`}>Sprint Period:</span>
              <span className={`font-bold ${theme.textMain}`}>Active Cycle (June 2026)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span className={`${theme.textMuted}`}>Sync State:</span>
              <span className="font-extrabold text-emerald-500">Continuous Pulsar</span>
            </div>
          </div>
        </div>

        {/* Selected Member Profile Card & Stats Indices */}
        <div className={`col-span-1 ${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100/10">
            <div className={`w-12 h-12 rounded-full ${theme.primaryBg} text-white font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200`}>
              {currentMember.avatar}
            </div>
            <div className="min-w-0">
              <h3 className={`font-black text-sm ${theme.textMain} truncate`}>{currentMember.name}</h3>
              <p className={`text-[10px] ${theme.textMuted} truncate uppercase font-extrabold tracking-widest mt-0.5`}>{currentMember.role}</p>
              <p className={`text-[10px] ${theme.textMuted} truncate font-mono mt-0.5`}>{currentMember.email}</p>
            </div>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-[11px] ${theme.textMuted} font-bold`}>Sprint closure rate:</span>
              <span className={`text-xs font-black ${theme.textMain}`}>{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full ${theme.primaryBg}`} style={{ width: `${completionRate}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className={`text-[11px] ${theme.textMuted} font-bold`}>Weighted Efficiency Index:</span>
              <span className="text-xs font-black text-emerald-500">{efficiencyIndex} / 100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${efficiencyIndex}%` }} />
            </div>
          </div>

          <div className={`bg-slate-50/10 rounded-2xl p-3 border ${theme.cardBorder} flex items-center justify-between text-center`}>
            <div>
              <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider`}>Resolved</p>
              <p className="text-sm font-black text-emerald-500 mt-0.5">{completedTasksCount}</p>
            </div>
            <div className="w-px h-6 bg-slate-200/50" />
            <div>
              <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider`}>Pending</p>
              <p className="text-sm font-black text-amber-500 mt-0.5">{pendingCount}</p>
            </div>
            <div className="w-px h-6 bg-slate-200/50" />
            <div>
              <p className={`text-[10px] ${theme.textMuted} uppercase tracking-wider`}>Total Load</p>
              <p className={`text-sm font-black ${theme.textMain} mt-0.5`}>{totalTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOUR GRAPH INTERACTIVE BENTO GRID */}
      <div id="insights-charts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Graph 1: Timeline Velocity Spline Area Chart */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider flex items-center gap-1.5`}>
              <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              June Sprint Completion Trend
            </h3>
            <p className={`text-[10.5px] ${theme.textMuted} mt-1`}>
              Comparative progression showing cumulative assigned vs. resolved tasks by timeline ticks.
            </p>
          </div>

          <div className="h-60 relative w-full pt-4">
            {totalTasks === 0 ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                <Calendar className={`h-8 w-8 ${theme.textMuted} opacity-40 mb-2`} />
                <p className={`text-xs ${theme.textMuted} font-bold`}>No metrics timeline computed.</p>
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="assignedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = 20 + i * 40;
                  return (
                    <line key={i} x1="30" y1={y} x2="480" y2={y} stroke={theme.id === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="3,3" />
                  );
                })}

                {/* Timeline data generators */}
                {(() => {
                  // Max coordinate map
                  const maxVal = Math.max(...timelineData.map(d => d.tasks), 3);
                  const getX = (index: number) => 40 + index * 84;
                  const getY = (val: number) => 180 - (val / maxVal) * 150;

                  // Compute SVGs path coordinates
                  let assignPath = `M ${getX(0)} ${getY(timelineData[0].tasks)}`;
                  let assignArea = `M ${getX(0)} 180 L ${getX(0)} ${getY(timelineData[0].tasks)}`;
                  let completePath = `M ${getX(0)} ${getY(timelineData[0].done)}`;
                  let completeArea = `M ${getX(0)} 180 L ${getX(0)} ${getY(timelineData[0].done)}`;

                  for (let i = 1; i < timelineData.length; i++) {
                    const x = getX(i);
                    assignPath += ` L ${x} ${getY(timelineData[i].tasks)}`;
                    assignArea += ` L ${x} ${getY(timelineData[i].tasks)}`;
                    completePath += ` L ${x} ${getY(timelineData[i].done)}`;
                    completeArea += ` L ${x} ${getY(timelineData[i].done)}`;
                  }

                  assignArea += ` L ${getX(timelineData.length - 1)} 180 Z`;
                  completeArea += ` L ${getX(timelineData.length - 1)} 180 Z`;

                  return (
                    <>
                      {/* Area Fills */}
                      <path d={assignArea} fill="url(#assignedGrad)" />
                      <path d={completeArea} fill="url(#completedGrad)" />

                      {/* Line Strokes */}
                      <path d={assignPath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={completePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Custom points */}
                      {timelineData.map((d, index) => {
                        const x = getX(index);
                        const yAssign = getY(d.tasks);
                        const yDone = getY(d.done);

                        return (
                          <g key={index} className="cursor-pointer group">
                            {/* Assigned circle */}
                            <circle cx={x} cy={yAssign} r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                            {/* Done circle */}
                            <circle cx={x} cy={yDone} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2" />

                            {/* Label ticks */}
                            <text x={x} y="200" fill={theme.id === 'dark' ? '#94a3b8' : '#64748b'} fontSize="10" fontWeight="bold" textAnchor="middle">
                              {d.date.replace('June ', '06/')}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono justify-center mt-3 pt-3 border-t border-slate-150/10">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className={`${theme.textMuted}`}>Tasks Assigned</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className={`${theme.textMuted}`}>Tasks Completed</span>
            </span>
          </div>
        </div>

        {/* Graph 2: Project Workload Allocation Horizontal Grouped Columns */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider flex items-center gap-1.5`}>
              <BarChart3 className="h-4.5 w-4.5 text-orange-500" />
              Workload Allocation by Project
            </h3>
            <p className={`text-[10.5px] ${theme.textMuted} mt-1`}>
              Distributing assigned workload clusters vs. completions across individual core projects.
            </p>
          </div>

          <div className="h-60 relative w-full flex flex-col justify-center space-y-4">
            {workloadData.length === 0 ? (
              <div className="text-center p-4">
                <Layers className={`h-8 w-8 ${theme.textMuted} opacity-40 mx-auto mb-2`} />
                <p className={`text-xs ${theme.textMuted} font-bold`}>No project workload data associated.</p>
              </div>
            ) : (
              workloadData.map((d, index) => {
                const totalPercent = 100; // base standard outer bar
                const donePercent = d.total > 0 ? (d.done / d.total) * 100 : 0;
                
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className={`font-bold ${theme.textMain} truncate max-w-[180px] flex items-center gap-1.5`}>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </span>
                      <span className={`${theme.textMuted}`}>
                        {d.done} / {d.total} items done ({Math.round(donePercent)}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-3 overflow-hidden flex relative">
                      {/* Completed portion matching project color */}
                      <div 
                        className="h-full rounded-l transition-all duration-300"
                        style={{ width: `${donePercent}%`, backgroundColor: d.color }}
                      />
                      {/* Leftover assigned items portion */}
                      <div 
                        className="h-full opacity-35 hover:opacity-50 transition-all duration-300"
                        style={{ width: `${100 - donePercent}%`, backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono justify-center mt-3 pt-3 border-t border-slate-150/10">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-2.5 rounded bg-slate-300 dark:bg-slate-700" />
              <span className={`${theme.textMuted}`}>Allocated Remaining</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-2.5 rounded bg-emerald-500" />
              <span className={`${theme.textMuted}`}>Milestone Resolved</span>
            </span>
          </div>
        </div>

        {/* Graph 3: Priority Density Matrix (Radial Segment Bars) */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider flex items-center gap-1.5`}>
              <PieChart className="h-4.5 w-4.5 text-purple-500" />
              Priority Allocation Density
            </h3>
            <p className={`text-[10.5px] ${theme.textMuted} mt-1`}>
              Task severity clusters representing allocation distributions between High, Medium, and Low.
            </p>
          </div>

          <div className="h-60 relative w-full flex items-center justify-center">
            {totalTasks === 0 ? (
              <div className="text-center p-4">
                <AlertCircle className={`h-8 w-8 ${theme.textMuted} opacity-40 mx-auto mb-2`} />
                <p className={`text-xs ${theme.textMuted} font-bold`}>No priority data found.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                {/* Custom Segment Donut SVG Chart */}
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {(() => {
                      const high = userTasks.filter(t => t.priority === 'high').length;
                      const med = userTasks.filter(t => t.priority === 'medium').length;
                      const low = userTasks.filter(t => t.priority === 'low').length;
                      const sum = high + med + low;

                      if (sum === 0) return null;

                      const highShare = (high / sum) * 100;
                      const medShare = (med / sum) * 100;
                      const lowShare = (low / sum) * 100;

                      // Outer circumference: 2 * PI * r = 2 * 3.1415 * 30 = 188.5
                      const circ = 188.5;
                      const highStroke = (highShare / 100) * circ;
                      const medStroke = (medShare / 100) * circ;
                      const lowStroke = (lowShare / 100) * circ;

                      return (
                        <>
                          {/* Outer High Priority Circle Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="transparent"
                            stroke="#ef4444"
                            strokeWidth="10"
                            strokeDasharray={`${highStroke} ${circ}`}
                            strokeDashoffset={0}
                            className="transition-all duration-500"
                          />
                          {/* Medium Priority Circle Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="transparent"
                            stroke="#f59e0b"
                            strokeWidth="10"
                            strokeDasharray={`${medStroke} ${circ}`}
                            strokeDashoffset={-highStroke}
                            className="transition-all duration-500"
                          />
                          {/* Low Priority Circle Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="transparent"
                            stroke="#22c55e"
                            strokeWidth="10"
                            strokeDasharray={`${lowStroke} ${circ}`}
                            strokeDashoffset={-(highStroke + medStroke)}
                            className="transition-all duration-500"
                          />
                        </>
                      );
                    })()}
                  </svg>
                  
                  {/* Center percentage badge */}
                  <div className="absolute inset-x-0 top-12 bottom-0 flex flex-col items-center text-center justify-center">
                    <span className={`text-[10px] ${theme.textMuted} uppercase font-extrabold tracking-widest`}>Ratio</span>
                    <span className={`text-lg font-black ${theme.textMain}`}>{completionRate}%</span>
                  </div>
                </div>

                {/* Priority Legends side logs */}
                <div className="space-y-2 flex-1">
                  {(() => {
                    const high = userTasks.filter(t => t.priority === 'high').length;
                    const med = userTasks.filter(t => t.priority === 'medium').length;
                    const low = userTasks.filter(t => t.priority === 'low').length;
                    const sum = high + med + low;

                    return (
                      <>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                            <span className={`${theme.textMain} font-bold`}>High</span>
                          </span>
                          <span className={`${theme.textMuted}`}>{high} tasks ({sum > 0 ? Math.round((high/sum)*100) : 0}%)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                            <span className={`${theme.textMain} font-bold`}>Medium</span>
                          </span>
                          <span className={`${theme.textMuted}`}>{med} tasks ({sum > 0 ? Math.round((med/sum)*100) : 0}%)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className={`${theme.textMain} font-bold`}>Low</span>
                          </span>
                          <span className={`${theme.textMuted}`}>{low} tasks ({sum > 0 ? Math.round((low/sum)*100) : 0}%)</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50/10 rounded-2xl border border-dashed border-slate-200/50 text-[10px] text-center italic">
             "Prioritization helps manage sprint timelines before critical target releases."
          </div>
        </div>

        {/* Graph 4: Status Breakdown Progressive Bar Stacks */}
        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-6 shadow-xs flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider flex items-center gap-1.5`}>
              <CheckSquare className="h-4.5 w-4.5 text-teal-500" />
              Sprints Status Breakdown
            </h3>
            <p className={`text-[10.5px] ${theme.textMuted} mt-1`}>
              Detailed status count distribution showing standard Kanban segment aggregates.
            </p>
          </div>

          <div className="h-60 relative w-full flex flex-col justify-center space-y-4">
            {totalTasks === 0 ? (
              <div className="text-center p-4">
                <BarChart3 className={`h-8 w-8 ${theme.textMuted} opacity-40 mx-auto mb-2`} />
                <p className={`text-xs ${theme.textMuted} font-bold`}>No status logs generated.</p>
              </div>
            ) : (
              [
                { label: 'To Do', val: todoTasksCount, color: 'bg-slate-400 dark:bg-slate-650' },
                { label: 'In Progress', val: inProgressTasksCount, color: 'bg-amber-500' },
                { label: 'In Review', val: reviewTasksCount, color: 'bg-indigo-500' },
                { label: 'Completed', val: completedTasksCount, color: 'bg-emerald-500' }
              ].map((item, index) => {
                const percent = totalTasks > 0 ? (item.val / totalTasks) * 100 : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className={`font-bold ${theme.textMain}`}>{item.label}</span>
                      <span className={`${theme.textMuted}`}>{item.val} tasks ({Math.round(percent)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-2 text-[9.5px] bg-indigo-50/10 p-2.5 rounded-xl border border-indigo-200/20 text-slate-450 leading-relaxed justify-center">
            <CornerDownRight className="h-3 w-3 text-indigo-500 shrink-0" />
            <span>Targeting higher completed rates boosts overall weighted scores.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
