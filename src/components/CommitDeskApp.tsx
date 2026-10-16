"use client";

import { useState } from "react";
import { Task, Status } from "@/types";
import { useCommitDesk } from "@/hooks/useCommitDesk";
import ChatPanel from "@/components/ChatPanel";
import TaskBoard from "@/components/TaskBoard";
import TaskModal from "@/components/TaskModal";
import DashboardStrip from "@/components/DashboardStrip";
import { Plus, RotateCcw, GitCommit } from "lucide-react";

export default function CommitDeskApp() {
  const {
    tasks,
    messages,
    hydrated,
    stats,
    addTask,
    updateTask,
    deleteTask,
    processUserMessage,
    addMessage,
    clearAll,
  } = useCommitDesk();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>("Open");
  const [resetConfirm, setResetConfirm] = useState(false);

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
    setShowNewTask(false);
  }

  function handleNewTask(defaultStatus: Status = "Open") {
    setNewTaskStatus(defaultStatus);
    setShowNewTask(true);
    setSelectedTask(null);
  }

  function handleSend(content: string) {
    // Add user message first
    addMessage({ role: "user", content });
    // Process with current task list for intent detection
    processUserMessage(content, tasks);
  }

  function handleReset() {
    if (resetConfirm) {
      clearAll();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  }

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading CommitDesk…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f1117] overflow-hidden">
      {/* ── Topbar ─────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b border-[#1e2330] bg-[#0c1019]">
        <div className="flex items-center gap-2">
          <GitCommit size={18} className="text-blue-400" />
          <span className="font-bold text-white text-sm tracking-tight">CommitDesk</span>
          <span className="text-slate-600 text-xs font-mono">v1.0</span>
        </div>

        <div className="h-4 w-px bg-[#2a3042]" />

        {/* Summary tag */}
        {stats.overdue > 0 && (
          <span className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5 font-medium">
            {stats.overdue} overdue
          </span>
        )}
        {stats.dueToday > 0 && (
          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5 font-medium">
            {stats.dueToday} due today
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => handleNewTask()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            <Plus size={13} /> New Task
          </button>
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              resetConfirm
                ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                : "border-[#2a3042] text-slate-500 hover:text-white hover:border-slate-500"
            }`}
            title="Reset to demo data"
          >
            <RotateCcw size={12} />
            {resetConfirm ? "Confirm reset" : "Reset demo"}
          </button>
        </div>
      </header>

      {/* ── Main layout ────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Chat Panel */}
        <aside className="flex-shrink-0 w-[340px] border-r border-[#1e2330] flex flex-col min-h-0 relative">
          <ChatPanel messages={messages} onSend={handleSend} />
        </aside>

        {/* Right: Board + Dashboard */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Dashboard strip */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-[#1e2330] bg-[#0c1019]">
            <DashboardStrip stats={stats} />
          </div>

          {/* Board area header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-[#1e2330]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Task Board</span>
            <span className="text-[11px] text-slate-600 font-mono">{stats.total} total · click a task to edit</span>
          </div>

          {/* Kanban board */}
          <div className="flex-1 min-h-0 p-4 overflow-hidden">
            <TaskBoard
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onStatusChange={(id, status) => updateTask(id, { status })}
              onNewTask={handleNewTask}
            />
          </div>
        </main>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onSave={(patch) => updateTask(selectedTask.id, patch)}
          onDelete={() => deleteTask(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showNewTask && (
        <TaskModal
          task={null}
          isNew
          onSave={(patch) => {
            addTask({
              title: patch.title ?? "",
              description: patch.description ?? "",
              owner: patch.owner ?? "Unassigned",
              dueDate: patch.dueDate ?? new Date().toISOString().split("T")[0],
              priority: patch.priority ?? "Medium",
              status: patch.status ?? newTaskStatus,
            });
          }}
          onClose={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
}
