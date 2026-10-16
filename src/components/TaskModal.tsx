"use client";

import { useState } from "react";
import { Task, Priority, Status } from "@/types";
import { X, Save, Trash2, Calendar, User, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface TaskModalProps {
  task: Task | null;
  isNew?: boolean;
  onSave: (patch: Partial<Task>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const PRIORITY_OPTS: Priority[] = ["Small", "Medium", "Large"];
const STATUS_OPTS: Status[] = ["Open", "Done", "Overdue"];

function priorityColor(p: Priority) {
  return p === "Large" ? "text-red-400" : p === "Medium" ? "text-amber-400" : "text-emerald-400";
}
function statusIcon(s: Status) {
  if (s === "Done") return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (s === "Overdue") return <AlertTriangle size={14} className="text-red-400" />;
  return <Clock size={14} className="text-blue-400" />;
}

export default function TaskModal({ task, isNew = false, onSave, onDelete, onClose }: TaskModalProps) {
  const [form, setForm] = useState<Partial<Task>>(
    task ?? {
      title: "",
      description: "",
      owner: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
      status: "Open",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.owner?.trim()) e.owner = "Owner is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161b27] border border-[#2a3042] rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3042]">
          <h2 className="font-semibold text-white text-sm">
            {isNew ? "New Task" : "Edit Task"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done?"
              className="w-full bg-[#0f1117] border border-[#2a3042] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/60 transition-colors"
            />
            {errors.title && <p className="text-red-400 text-[11px] mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Additional context…"
              rows={3}
              className="w-full bg-[#0f1117] border border-[#2a3042] rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-blue-500/60 transition-colors leading-relaxed"
            />
          </div>

          {/* Owner + Due Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5 flex items-center gap-1">
                <User size={10} /> Owner *
              </label>
              <input
                type="text"
                value={form.owner ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                placeholder="Assignee name"
                className="w-full bg-[#0f1117] border border-[#2a3042] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/60 transition-colors"
              />
              {errors.owner && <p className="text-red-400 text-[11px] mt-1">{errors.owner}</p>}
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5 flex items-center gap-1">
                <Calendar size={10} /> Due Date *
              </label>
              <input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full bg-[#0f1117] border border-[#2a3042] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
              />
              {errors.dueDate && <p className="text-red-400 text-[11px] mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Priority</label>
              <div className="flex gap-1.5">
                {PRIORITY_OPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${
                      form.priority === p
                        ? p === "Large"
                          ? "bg-red-500/20 border-red-500/50 text-red-400"
                          : p === "Medium"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                          : "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-transparent border-[#2a3042] text-slate-500 hover:border-slate-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">Status</label>
              <div className="flex gap-1.5">
                {STATUS_OPTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors flex items-center justify-center gap-1 ${
                      form.status === s
                        ? s === "Done"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : s === "Overdue"
                          ? "bg-red-500/20 border-red-500/50 text-red-400"
                          : "bg-blue-500/20 border-blue-500/50 text-blue-400"
                        : "bg-transparent border-[#2a3042] text-slate-500 hover:border-slate-500"
                    }`}
                  >
                    {statusIcon(s)}
                    <span className="hidden sm:inline">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#2a3042]">
          {onDelete ? (
            <button
              onClick={() => { onDelete(); onClose(); }}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs transition-colors"
            >
              <Trash2 size={13} /> Delete task
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#2a3042] text-slate-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save size={13} /> {isNew ? "Create Task" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
