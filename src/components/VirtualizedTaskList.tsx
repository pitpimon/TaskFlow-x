import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { MessageSquare, Edit } from 'lucide-react';
import { Task } from '../types';

interface VirtualizedTaskListProps {
  tasks: Task[];
  team: { id: number; name: string; avatar?: string; role?: string }[];
  onOpenTaskDetail: (id: number) => void;
  projectId: number;
}

// Row renderer for each task
const Row = ({ index, style, data }: ListChildComponentProps) => {
  const { tasks, team, onOpenTaskDetail } = data as any;
  const task = tasks[index];
  const user = team.find((m: any) => m.id === task.assigneeId);

  return (
    <tr
      style={style}
      className="hover:bg-slate-50/50 transition cursor-pointer select-none"
      onClick={() => onOpenTaskDetail(task.id)}
    >
      {/* Title & description */}
      <td className="p-4">
        <span className="font-extrabold text-slate-800 text-xs block truncate max-w-xs">
          {task.title}
        </span>
        {task.description && (
          <span className="text-[11px] text-slate-400 truncate max-w-xs block font-normal mt-0.5">
            {task.description}
          </span>
        )}
      </td>

      {/* Status badge */}
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] rounded-full font-bold capitalize border
            ${task.status === 'done' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                task.status === 'review' ? 'bg-purple-50 border-purple-100 text-purple-800' :
                task.status === 'in-progress' ? 'bg-blue-50 border-blue-100 text-blue-800' :
                'bg-slate-50 border-slate-100 text-slate-700'}
          `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full
              ${task.status === 'done' ? 'bg-emerald-500' :
                task.status === 'review' ? 'bg-purple-500' :
                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-400'}
            `}
          />
          {task.status.replace('-', ' ')}
        </span>
      </td>

      {/* Priority badge */}
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md
            ${task.priority === 'high' ? 'bg-rose-50 border border-rose-100 text-rose-700' :
                task.priority === 'medium' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
                'bg-blue-50 border border-blue-100 text-blue-700'}
          `}
        >
          {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟠 Medium' : '🔵 Low'}
        </span>
      </td>

      {/* Assignee avatar */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 border font-extrabold flex items-center justify-center text-[9px] shrink-0">
            {user?.avatar || task.assignee.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-700 truncate text-[11px] max-w-[120px]">
            {task.assignee}
          </span>
        </div>
      </td>

      {/* Due date */}
      <td className="p-4 text-slate-600 font-semibold text-[11px]">📅 {task.dueDate}</td>

      {/* Comments count */}
      <td className="p-4 text-right text-slate-450 font-bold font-mono">
        {task.commentsCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-slate-705">
            <MessageSquare className="h-3 w-3" /> {task.commentsCount}
          </span>
        ) : (
          '0'
        )}
      </td>

      {/* Action buttons */}
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onOpenTaskDetail(task.id)}
            className="p-1 text-slate-450 hover:text-blue-600 transition"
            title="Edit / View item"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function VirtualizedTaskList({ tasks, team, onOpenTaskDetail, projectId }: VirtualizedTaskListProps) {
  const itemHeight = 80; // Approximate row height
  const height = Math.min(600, tasks.length * itemHeight);

  return (
    <List
      height={height}
      itemCount={tasks.length}
      itemSize={itemHeight}
      width="100%"
      itemData={{ tasks, team, onOpenTaskDetail }}
    >
      {Row}
    </List>
  );
}
