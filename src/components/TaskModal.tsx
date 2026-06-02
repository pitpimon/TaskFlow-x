/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../types';
import { 
  X, User as UserIcon, Calendar, CheckSquare, 
  Paperclip, MessageSquare, AlertCircle, Edit2, 
  Trash2, ShieldAlert, Check, Plus
} from 'lucide-react';

interface TaskModalProps {
  taskId: number | null;
  projectIdFilter?: number; // optional preselection
  isOpen: boolean;
  onClose: () => void;
  editModeInitial?: boolean;
}

export default function TaskModal({ taskId, projectIdFilter, isOpen, onClose, editModeInitial = false }: TaskModalProps) {
  const { 
    tasks, projects, team, getTaskComments, addComment, 
    addTask, updateTask, deleteTask, userProfile, addToast 
  } = useApp();

  const isNewTask = taskId === null;

  // Mode state
  const [isEditing, setIsEditing] = useState(editModeInitial || isNewTask);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number>(1);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<number>(1);
  const [dueDate, setDueDate] = useState('2026-06-15');
  const [labelsInput, setLabelsInput] = useState('');
  
  // Custom checklist mockup
  const [checklist, setChecklist] = useState<{ id: number; text: string; done: boolean }[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  // Comment draft input
  const [commentText, setCommentText] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load task values if editing
  useEffect(() => {
    if (isOpen) {
      if (!isNewTask && taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setProjectId(task.projectId);
          setStatus(task.status);
          setPriority(task.priority);
          setAssigneeId(task.assigneeId);
          setDueDate(task.dueDate);
          setLabelsInput(task.labels.join(', '));
          setIsEditing(editModeInitial);
          
          // Generate mock minor checklist items
          setChecklist([
            { id: 1, text: "Verify UX boundaries", done: task.status === 'done' },
            { id: 2, text: "Review contrast configurations", done: task.status === 'done' || task.status === 'review' }
          ]);
        }
      } else {
        // Reset form for fresh creation
        setTitle('');
        setDescription('');
        setProjectId(projectIdFilter || (projects.length > 0 ? projects[0].id : 1));
        setStatus('todo');
        setPriority('medium');
        // preselect a team member
        setAssigneeId(team.length > 0 ? team[0].id : 1);
        
        // Default tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 3);
        setDueDate(tomorrow.toISOString().split('T')[0]);
        setLabelsInput('');
        setChecklist([]);
        setIsEditing(true);
      }
      setCommentText('');
      setShowConfirmClose(false);
    }
  }, [taskId, isOpen, tasks, editModeInitial, isNewTask, projectIdFilter, projects, team]);

  // Handle escape press to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleTryClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commentText, isEditing]);

  const handleTryClose = () => {
    // If user has unsaved draft comments, warn them
    if (commentText.trim() && !isEditing) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Fetch comments
  const taskComments = !isNewTask && taskId ? getTaskComments(taskId) : [];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (taskId) {
      addComment(taskId, commentText.trim());
      setCommentText('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast("Task title is required.", "error");
      return;
    }

    const assignedUser = team.find(member => member.id === Number(assigneeId));
    const labels = labelsInput
      .split(',')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      projectId: Number(projectId),
      status,
      priority,
      assigneeId: Number(assigneeId),
      assignee: assignedUser ? assignedUser.name : 'Unassigned',
      dueDate,
      labels
    };

    if (isNewTask) {
      addTask(taskData);
      onClose();
    } else if (taskId) {
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        updateTask({
          ...existingTask,
          ...taskData
        });
        setIsEditing(false);
      }
    }
  };

  const handleDelete = () => {
    if (taskId && window.confirm("Are you sure you want to permanently delete this task?")) {
      deleteTask(taskId);
      onClose();
    }
  };

  const handleAddCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    setChecklist(prev => [...prev, { id: Date.now(), text: newCheckItem.trim(), done: false }]);
    setNewCheckItem('');
  };

  const toggleCheckItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteCheckItem = (id: number) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const selectedProject = projects.find(p => p.id === projectId);
  const selectedAssignee = team.find(m => m.id === assigneeId);

  return (
    <div 
      id="task-modal-backdrop"
      className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleTryClose();
      }}
    >
      <div 
        id="task-modal-window"
        ref={containerRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative"
      >
        {/* Modal Header */}
        <div id="task-modal-header" className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {isNewTask ? 'New Task' : `Task #${taskId}`}
            </span>
            {!isNewTask && !isEditing && (
              <span 
                className="text-xs font-semibold px-2 px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: selectedProject?.color + '15',
                  color: selectedProject?.color
                }}
              >
                {selectedProject?.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isNewTask && !isEditing && (
              <button 
                id="task-btn-edit"
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit2 className="h-4.5 w-4.5" />
              </button>
            )}
            {!isNewTask && (
              <button 
                id="task-btn-delete"
                onClick={handleDelete}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            )}
            <button 
              id="task-btn-close"
              onClick={handleTryClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {isEditing ? (
          <form id="task-edit-form" onSubmit={handleSave} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label id="lbl-task-title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Task Title *
              </label>
              <input
                id="input-task-title"
                type="text"
                required
                placeholder="e.g. Design app dashboard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-sm font-medium transition"
              />
            </div>

            {/* Description */}
            <div>
              <label id="lbl-task-desc" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                id="input-task-desc"
                placeholder="What is this task about?"
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-700 text-sm transition"
              />
            </div>

            {/* Project, Status, Priority & Assignee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label id="lbl-task-project" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Project *
                </label>
                <select
                  id="select-task-project"
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label id="lbl-task-status" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Workflow Status
                </label>
                <select
                  id="select-task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="done">Completed (Done)</option>
                </select>
              </div>

              <div>
                <label id="lbl-task-priority" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Priority level
                </label>
                <select
                  id="select-task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm bg-white"
                >
                  <option value="low">🟡 Low</option>
                  <option value="medium">🟠 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div>
                <label id="lbl-task-assignee" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                <select
                  id="select-task-assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm bg-white font-medium"
                >
                  {team.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label id="lbl-task-duedate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  id="input-task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm"
                />
              </div>

              <div>
                <label id="lbl-task-labels" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Labels / Tags <span className="text-slate-400 capitalize font-normal text-[11px]">(comma separated)</span>
                </label>
                <input
                  id="input-task-labels"
                  type="text"
                  placeholder="UI, Design, Frontend"
                  value={labelsInput}
                  onChange={(e) => setLabelsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-slate-700 text-sm"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div id="task-edit-footer" className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                id="task-btn-cancel-edit"
                type="button"
                onClick={() => {
                  if (isNewTask) onClose();
                  else setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                id="task-btn-save"
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition active:translate-y-0.5"
              >
                {isNewTask ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div id="task-view-body" className="p-0 divide-y divide-slate-100">
            {/* Split View Pane */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Task Left Detail Content */}
              <div className="p-6 md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-snug">{title}</h3>
                  {description ? (
                    <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{description}</p>
                  ) : (
                    <p className="mt-3 text-sm italic text-slate-400">No description provided for this task.</p>
                  )}
                </div>

                {/* Subtask checklist mockup */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Task Checklist ({checklist.filter(c => c.done).length}/{checklist.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {checklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <label className="flex items-center gap-3 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggleCheckItem(item.id)}
                            className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-400 h-4 w-4 shrink-0 transition"
                          />
                          <span className={`text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                            {item.text}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => deleteCheckItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <form onSubmit={handleAddCheckItem} className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add checklist item..."
                        value={newCheckItem}
                        onChange={(e) => setNewCheckItem(e.target.value)}
                        className="flex-1 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md p-1.5 transition shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Labels Display */}
                {labelsInput.trim() && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Labels</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {labelsInput.split(',').map((label, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Right Sidebar Attribute Metadata */}
              <div className="p-6 bg-slate-50/50 space-y-4">
                <div className="space-y-3.5 text-sm">
                  <div>
                    <span className="block text-11px font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-semibold capitalize
                      ${status === 'done' ? 'bg-emerald-100 text-emerald-800' : 
                        status === 'review' ? 'bg-purple-100 text-purple-800' : 
                        status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full 
                        ${status === 'done' ? 'bg-emerald-500' : 
                          status === 'review' ? 'bg-purple-500' : 
                          status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-400'
                        }`} 
                      />
                      {status.replace('-', ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="block text-11px font-semibold text-slate-400 uppercase tracking-wider mb-1">Priority</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 px-2.5 py-0.5 rounded-md capitalize
                      ${priority === 'high' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                        priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {priority === 'high' ? '🔴 High' : priority === 'medium' ? '🟠 Medium' : '🔵 Low'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-11px font-semibold text-slate-400 uppercase tracking-wider mb-1">Assignee</span>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-blue-500/10">
                        {selectedAssignee?.avatar || "UN"}
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-800 text-xs leading-tight">{selectedAssignee?.name}</span>
                        <span className="block text-[11px] text-slate-500 leading-tight">{selectedAssignee?.role}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-11px font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Due Date
                    </span>
                    <span className="text-slate-800 font-semibold text-xs bg-white border border-slate-200 rounded-md px-2 py-1 inline-block">
                      {dueDate}
                    </span>
                  </div>

                  <div>
                    <span className="block text-11px font-semibold text-slate-400 uppercase tracking-wider mb-1">Project Workspace</span>
                    <span className="text-slate-700 font-semibold text-xs leading-tight block">
                      📁 {selectedProject?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Thread Session */}
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-slate-400" />
                Comments Thread ({taskComments.length})
              </h4>

              {/* Feed List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {taskComments.length === 0 ? (
                  <p className="text-xs italic text-slate-400 text-center py-4">No comments posted yet. Start the conversation!</p>
                ) : (
                  taskComments.map(comment => (
                    <div key={comment.id} className="flex gap-2.5 items-start bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2.5">
                          <span className="text-xs font-bold text-slate-800 truncate">{comment.userName}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">{comment.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Field */}
              <form onSubmit={handlePostComment} className="space-y-2 pt-2">
                <textarea
                  id="comment-textarea"
                  placeholder="Ask a question or post progress notes..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-700"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Posting as <strong>{userProfile.name}</strong>
                  </span>
                  <button
                    id="btn-post-comment"
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg shadow-xs transition"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Unsaved Warn Modal Overlay overlay */}
        {showConfirmClose && (
          <div id="draft-warn" className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs rounded-2xl flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 max-w-sm w-full text-center space-y-4">
              <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
              <div>
                <h5 className="font-bold text-slate-800 text-sm">Discard Draft Comment?</h5>
                <p className="text-xs text-slate-500 mt-1">You have typed text in the comment box that will be lost.</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmClose(false)}
                  className="px-3.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition"
                >
                  Keep Typing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmClose(false);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition"
                >
                  Discard Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
