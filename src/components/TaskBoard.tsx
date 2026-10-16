"use client";

import { useState } from "react";
import { Task, Status, Priority } from "@/types";
import { Plus, AlertTriangle, CheckCircle2, Clock, Calendar, User, ChevronUp, ChevronDown } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (status: Status) => void;
}

function priorityBadge(p: Priority) {
  const base = "text-[10px] font-medium px-1.5 py-0.5 rounded border";
  if (p === "Large") return `${base} bg-red-500/10 border-red-500/30 text-red-400`;
  if (p === "Medium") return `${base} bg-amber-500/10 border-amber-500/30 text-amber-400`;
  return `${base} bg-emerald-500/10 border-emerald-500/30 text-emerald-400`;
}

function statusBadge(s: Status) {
  const base = "text-[10px] font-medium px-1.5 py-0.5 rounded border flex items-center gap-1";
  if (s === "Done") return `${base} bg-emerald-500/10 border-emerald-500/30 text-emerald-400`;
  if (s === "Overdue") return `${base} bg-red-500/10 border-red-500/30 text-red-400`;
  return `${base} bg-blue-500/10 border-blue-500/30 text-blue-400`;
}

function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = task.dueDate === today;
  const isPast = task.dueDate < today;

  function formatDate(d: string) {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  const nextStatus: Record<Status, Status> = {
    Open: "Done",
    Done: "Open",
    Overdue: "Done",
  };

  return (
    <div
      onClick={onClick}
      className={`group bg-[#161b27] border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-900/10 ${
        task.status === "Overdue"
          ? "border-red-500/20"
          : task.status === "Done"
          ? "border-emerald-500/10 opacity-70"
          : "border-[#2a3042]"
      }`}
    >
      {/* Top row: title + quick status toggle */}
      <div className="flex items-start gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(nextStatus[task.status]);
          }}
          className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border transition-colors ${
            task.status === "Done"
              ? "bg-emerald-500/30 border-emerald-500/50"
              : task.status === "Overdue"
              ? "border-red-500/40 hover:border-red-400"
              : "border-slate-600 hover:border-blue-400"
          }`}
          title={`Mark as ${nextStatus[task.status]}`}
        >
          {task.status === "Done" && <CheckCircle2 size={12} className="text-emerald-400 -mt-px -ml-px" />}
          {task.status === "Overdue" && <AlertTriangle size={11} className="text-red-400 ml-px" />}
        </button>
        <p className={`text-sm font-medium leading-snug flex-1 ${task.status === "Done" ? "line-through text-slate-500" : "text-white"}`}>
          {task.title}
        </p>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-[11px] text-slate-500 mt-1.5 ml-6 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 mt-2.5 ml-6 flex-wrap">
        <span className={priorityBadge(task.priority)}>{task.priority}</span>
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <User size={9} />
          <span className="truncate max-w-[80px]">{task.owner}</span>
        </span>
        <span className={`flex items-center gap-1 text-[10px] ${
          isPast && task.status !== "Done" ? "text-red-400" : isToday ? "text-amber-400" : "text-slate-500"
        }`}>
          <Calendar size={9} />
          {isToday && task.status !== "Done" ? "Today" : formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  onNewTask?: () => void;
  accentClass: string;
  icon: React.ReactNode;
}

function KanbanColumn({ title, status, tasks, onTaskClick, onStatusChange, onNewTask, accentClass, icon }: KanbanColumnProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-w-0 bg-[#0f1117] rounded-xl border border-[#1e2330]">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 border-b border-[#1e2330] rounded-t-xl`}>
        <span className={accentClass}>{icon}</span>
        <span className="text-xs font-semibold text-slate-300">{title}</span>
        <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accentClass} bg-current/10`} style={{background: 'rgba(255,255,255,0.05)'}}>
          {tasks.length}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="p-1 rounded text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              title="Add task"
            >
              <Plus size={13} />
            </button>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded text-slate-600 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {/* Tasks */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-[11px] text-slate-600">No {title.toLowerCase()} tasks</p>
              {onNewTask && (
                <button
                  onClick={onNewTask}
                  className="mt-2 text-[11px] text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <Plus size={11} /> Add one
                </button>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onStatusChange={(s) => onStatusChange(task.id, s)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  onNewTask: (defaultStatus?: Status) => void;
}

export default function TaskBoard({ tasks, onTaskClick, onStatusChange, onNewTask }: TaskBoardProps) {
  const columns: { status: Status; title: string; icon: React.ReactNode; accent: string }[] = [
    { status: "Overdue", title: "Overdue", icon: <AlertTriangle size={13} />, accent: "text-red-400" },
    { status: "Open", title: "Open", icon: <Clock size={13} />, accent: "text-blue-400" },
    { status: "Done", title: "Done", icon: <CheckCircle2 size={13} />, accent: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 h-full min-h-0">
      {columns.map(({ status, title, icon, accent }) => (
        <KanbanColumn
          key={status}
          title={title}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onTaskClick={onTaskClick}
          onStatusChange={onStatusChange}
          onNewTask={status === "Open" ? () => onNewTask("Open") : undefined}
          accentClass={accent}
          icon={icon}
        />
      ))}
    </div>
  );
}
