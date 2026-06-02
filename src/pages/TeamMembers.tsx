/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { 
  Users, Search, Filter, Plus, ShieldAlert, 
  Mail, Award, CheckCircle, Clock, Trash2, X, PlusCircle
} from 'lucide-react';

export default function TeamMembers() {
  const { team, tasks, addToast } = useApp();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Invite form states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  // Load team dynamically by augmenting their task aggregates
  const enrichedTeam = team.map(member => {
    const memberTasks = tasks.filter(t => t.assigneeId === member.id);
    const completedCount = memberTasks.filter(t => t.status === 'done').length;
    const activeCount = memberTasks.length - completedCount;

    return {
      ...member,
      assignedTasksCount: activeCount,
      completedTasksCount: completedCount
    };
  });

  // Filter team members
  const filteredTeam = enrichedTeam.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) {
      addToast("Teammate name is required.", "error");
      return;
    }
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    // Since this is a client mock experience, we can write a mock push or local log
    // We add a new user to our team in the local UI state
    // Let's call the global mock context or add a local toast
    const nextId = team.length > 0 ? Math.max(...team.map(m => m.id)) + 1 : 1;
    const initials = inviteName
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    team.push({
      id: nextId,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: initials || "UN"
    });

    addToast(`Invitation sent successfully to ${inviteEmail}!`, 'success');
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Developer');
    setShowInviteModal(false);
  };

  const ROLES = ['Developer', 'Designer', 'Manager', 'QA Engineer', 'Product Designer', 'Senior Developer'];

  return (
    <div id="team-members-view" className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto flex flex-col h-full">
      
      {/* Title & Invite CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Team Members Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse teammate workload aggregates, assigned workloads, achievements, and send mock membership keys.
          </p>
        </div>

        <button
          id="btn-trigger-invite"
          onClick={() => setShowInviteModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 transition active:translate-y-0.5 cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Filter toolbar panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="team-search"
            type="text"
            placeholder="Search team member by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 focus:outline-hidden focus:border-blue-500 rounded-xl bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            id="team-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">All Roles</option>
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid listing profiles */}
      {filteredTeam.length === 0 ? (
        <div id="team-empty-state" className="bg-white border rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <Users className="h-12 w-12 text-slate-200 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">No Teammates Found</h3>
            <p className="text-xs text-slate-400 mt-1">We couldn't locate any credentials matching your exact search parameters.</p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeam.map(member => (
            <div 
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-2xs hover:shadow-md transition duration-200 relative overflow-hidden flex flex-col justify-between space-y-5"
            >
              {/* Profile card headers layout */}
              <div className="flex items-start gap-4">
                {/* Custom circular avatar initials badge */}
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                  {member.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-tight truncate leading-tight">{member.name}</h3>
                  <span className="block text-[10px] font-bold text-slate-400 mt-0.5 leading-none">{member.role}</span>
                  <span className="block text-[10px] text-slate-450 truncate mt-1 leading-none">{member.email}</span>
                </div>
              </div>

              {/* Workload aggregates panel */}
              <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-0.5 leading-none">
                    <Clock className="h-2.5 w-2.5 text-slate-400" /> Pending
                  </span>
                  <span className="block text-sm font-black text-slate-700">{member.assignedTasksCount}</span>
                </div>
                <div className="space-y-0.5 border-l border-slate-200">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-0.5 leading-none">
                    <CheckCircle className="h-2.5 w-2.5 text-emerald-500" /> Done
                  </span>
                  <span className="block text-sm font-black text-emerald-700">{member.completedTasksCount}</span>
                </div>
              </div>

              {/* Achievements visual label footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-blue-500" /> Active Teammate
                </span>
                <span className={`h-2 w-2 rounded-full ${(member.assignedTasksCount || 0) > 2 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  title={(member.assignedTasksCount || 0) > 2 ? 'Heavy workload' : 'Available for assignments'}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Drawer Modal Override overlays */}
      {showInviteModal && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" /> Invite Teammate Workspace
              </h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Teammate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-hidden focus:border-blue-500 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Teammate Email Coordinate *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. eleanor@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:outline-hidden focus:border-blue-500 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Workspace Role / Title Selector</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Manager">Project Manager</option>
                  <option value="QA Engineer">QA Engineer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg shadow-xs transition"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
