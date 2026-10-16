"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, ChatMessage, Priority, Status } from "@/types";
import { SEED_TASKS, SEED_MESSAGES, generateId, extractTasksFromText } from "@/lib/data";

const STORAGE_KEY_TASKS = "commitdesk_tasks_v1";
const STORAGE_KEY_MESSAGES = "commitdesk_messages_v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded, ignore
  }
}

export function useCommitDesk() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage or seed
  useEffect(() => {
    const storedTasks = loadFromStorage<Task[]>(STORAGE_KEY_TASKS, []);
    const storedMessages = loadFromStorage<ChatMessage[]>(STORAGE_KEY_MESSAGES, []);
    setTasks(storedTasks.length > 0 ? storedTasks : SEED_TASKS);
    setMessages(storedMessages.length > 0 ? storedMessages : SEED_MESSAGES);
    setHydrated(true);
  }, []);

  // Persist tasks
  useEffect(() => {
    if (hydrated) saveToStorage(STORAGE_KEY_TASKS, tasks);
  }, [tasks, hydrated]);

  // Persist messages
  useEffect(() => {
    if (hydrated) saveToStorage(STORAGE_KEY_MESSAGES, messages);
  }, [messages, hydrated]);

  // Recompute overdue status on load / daily
  useEffect(() => {
    if (!hydrated) return;
    const today = new Date().toISOString().split("T")[0];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.status === "Done") return t;
        if (t.dueDate < today) return { ...t, status: "Overdue" as Status };
        return t;
      })
    );
  }, [hydrated]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">): Task => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  }, []);

  const processUserMessage = useCallback(
    (content: string, currentTasks: Task[]): { reply: ChatMessage; newTasks: Task[]; markedDoneId?: string } => {
      const lower = content.toLowerCase().trim();

      // ─── Priority sort helper ───────────────────────────────────────────────
      const priorityOrder: Record<string, number> = { Large: 0, Medium: 1, Small: 2 };
      const sortByPriority = (ts: Task[]) =>
        [...ts].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      // ─── INTENT 1: "what do I need to deliver today?" ─────────────────────
      const todayIntentPattern =
        /\b(what|what'?s|what do i|do i have|show me|give me|list).*(today|due today|deliver today|need to do|deliver|due)\b|\btoday'?s (tasks|work|deliverables|items)\b/i;

      if (todayIntentPattern.test(lower) || lower.includes("deliver today") || lower.includes("what do i need")) {
        const today = new Date().toISOString().split("T")[0];
        const urgent = sortByPriority(
          currentTasks.filter(
            (t) => t.status !== "Done" && (t.dueDate === today || t.status === "Overdue")
          )
        );

        let replyContent: string;
        if (urgent.length === 0) {
          replyContent =
            "✅ You're clear for today — no tasks due today or overdue. Great shape!";
        } else {
          const list = urgent
            .map((t) => {
              const tag = t.status === "Overdue" ? " ⚠️ **OVERDUE**" : " 📅 due today";
              return `• **${t.title}**${tag}\n  → ${t.owner} · ${t.priority} priority`;
            })
            .join("\n");
          replyContent = `Here's what needs your attention right now (${urgent.length} task${urgent.length > 1 ? "s" : ""}, sorted by priority):\n\n${list}`;
        }

        const reply: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
        return { reply, newTasks: [] };
      }

      // ─── INTENT 2: "low-hanging fruit" / small effort ─────────────────────
      const smallEffortPattern =
        /\b(low.hanging fruit|quick wins?|easy tasks?|small tasks?|one hour|1 hour|small effort|quick.to.do|fast tasks?|short tasks?)\b/i;

      if (smallEffortPattern.test(lower)) {
        const smallTasks = sortByPriority(
          currentTasks.filter((t) => t.priority === "Small" && t.status !== "Done")
        );

        let replyContent: string;
        if (smallTasks.length === 0) {
          replyContent =
            "No Small-effort tasks on the board right now. All quick wins are either done or there aren't any yet.";
        } else {
          const list = smallTasks
            .map((t) => {
              const due = new Date(t.dueDate + "T00:00:00").toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });
              return `• **${t.title}** — ${t.owner} · due ${due}`;
            })
            .join("\n");
          replyContent = `Here are your **${smallTasks.length} Small-effort task${smallTasks.length > 1 ? "s" : ""}** — great for a focused hour:\n\n${list}`;
        }

        const reply: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
        return { reply, newTasks: [] };
      }

      // ─── INTENT 3: "I finished / completed / done with X" ─────────────────
      const donePattern =
        /\b(i'?ve? (finished|completed|done|wrapped up|closed|shipped|sent|submitted|fixed)|finished|completed|done with|just finished|just completed|marked as done|resolved)\s+(.+)/i;
      const doneMatch = lower.match(donePattern);

      if (doneMatch) {
        // Extract the described task fragment
        const fragment = doneMatch[doneMatch.length - 1]
          .replace(/^(the|a|an)\s+/i, "")
          .toLowerCase()
          .trim();

        // Fuzzy match: find task whose title contains the most words from fragment
        const fragmentWords = fragment.split(/\s+/).filter((w) => w.length > 3);
        let bestTask: Task | null = null;
        let bestScore = 0;

        for (const t of currentTasks) {
          if (t.status === "Done") continue;
          const titleLower = t.title.toLowerCase();
          const score = fragmentWords.filter((w) => titleLower.includes(w)).length;
          if (score > bestScore) {
            bestScore = score;
            bestTask = t;
          }
        }

        // Also try direct substring match on full fragment
        if (!bestTask || bestScore === 0) {
          bestTask =
            currentTasks.find(
              (t) => t.status !== "Done" && t.title.toLowerCase().includes(fragment.slice(0, 20))
            ) ?? null;
        }

        let replyContent: string;
        let markedDoneId: string | undefined;

        if (bestTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === bestTask!.id ? { ...t, status: "Done" as Status } : t))
          );
          markedDoneId = bestTask.id;
          replyContent = `✅ Marked **"${bestTask.title}"** as **Done**. Nice work! The board has been updated.`;
        } else {
          replyContent = `I couldn't find a matching open task for "${fragment}". You can click any task card on the board to mark it done manually.`;
        }

        const reply: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: replyContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
        return { reply, newTasks: [], markedDoneId };
      }

      // ─── FALLBACK: extract tasks from text ────────────────────────────────
      const extracted = extractTasksFromText(content);
      const newTasks: Task[] = extracted.map((t) => ({
        ...t,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));

      setTasks((prev) => [...newTasks, ...prev]);

      let replyContent: string;
      if (newTasks.length === 0) {
        replyContent =
          "I couldn't detect any clear action items in that text. Try:\n\n> **[Name]** to **[action]** by **[date]**\n\nOr ask me:\n• \"What do I need to deliver today?\"\n• \"Give me low-hanging fruit\"\n• \"I finished the vendor email\"";
      } else {
        const taskList = newTasks
          .map(
            (t) =>
              `• **${t.title}** → ${t.owner}, ${t.priority} priority${t.status === "Overdue" ? " ⚠️ (overdue)" : ""}`
          )
          .join("\n");
        replyContent = `Extracted **${newTasks.length} task${newTasks.length > 1 ? "s" : ""}** and added to the board:\n\n${taskList}`;
      }

      const reply: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toISOString(),
        extractedTaskIds: newTasks.map((t) => t.id),
      };

      setMessages((prev) => [...prev, reply]);
      return { reply, newTasks };
    },
    []
  );


  const clearAll = useCallback(() => {
    setTasks(SEED_TASKS);
    setMessages(SEED_MESSAGES);
  }, []);

  // Derived stats - computed in a stable way
  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "Open").length,
    overdue: tasks.filter((t) => t.status === "Overdue").length,
    dueToday: tasks.filter((t) => {
      if (!hydrated) return false;
      const today = new Date().toISOString().split("T")[0];
      return t.dueDate === today && t.status !== "Done";
    }).length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  return {
    tasks,
    messages,
    hydrated,
    stats,
    addTask,
    updateTask,
    deleteTask,
    addMessage,
    processUserMessage,
    clearAll,
  };
}
