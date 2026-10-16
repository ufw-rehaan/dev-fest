import { Task, ChatMessage, Priority, Status } from "@/types";

// Reference date: tasks are seeded relative to today so they stay realistic
function relDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

export const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Finalise Q4 roadmap document",
    description:
      "Consolidate input from product, design, and engineering leads into a single prioritised roadmap. Include capacity estimates and dependency graph.",
    owner: "Priya Nair",
    dueDate: relDate(-2),
    priority: "Large",
    status: "Overdue",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "task-2",
    title: "Fix login timeout regression on iOS",
    description:
      "Users on iOS 17+ are getting logged out after 5 minutes. Root cause traced to JWT refresh not firing on backgrounded tabs.",
    owner: "Marcus Webb",
    dueDate: relDate(0),
    priority: "Large",
    status: "Open",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "task-3",
    title: "Write onboarding email sequence",
    description:
      "Draft 3-email drip sequence for new sign-ups: welcome, feature highlight, and check-in at day 7. Hand off to design for HTML build.",
    owner: "Sofia Almonte",
    dueDate: relDate(2),
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "task-4",
    title: "Run security audit on API endpoints",
    description:
      "Perform manual review of all public-facing REST endpoints for auth bypass, injection, and rate-limiting gaps. Produce findings report.",
    owner: "David Osei",
    dueDate: relDate(-5),
    priority: "Large",
    status: "Overdue",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "task-5",
    title: "Design new billing settings UI",
    description:
      "Redesign the billing section to support multiple payment methods, invoice history, and upgrade prompts. Deliver Figma mockups.",
    owner: "Aisha Mensah",
    dueDate: relDate(5),
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "task-6",
    title: "Migrate PostgreSQL to v16",
    description:
      "Upgrade staging environment first, validate query performance, then schedule production migration window. Update connection pool config.",
    owner: "Marcus Webb",
    dueDate: relDate(10),
    priority: "Large",
    status: "Open",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "task-7",
    title: "Create partner API documentation",
    description:
      "Write OpenAPI spec and developer guide for the new partner integration endpoints. Include code samples in JS, Python, and cURL.",
    owner: "Priya Nair",
    dueDate: relDate(7),
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "task-8",
    title: "Set up Playwright E2E test suite",
    description:
      "Bootstrap Playwright in the repo, write smoke tests for login, dashboard, and checkout flows. Integrate into CI pipeline.",
    owner: "Lena Hartmann",
    dueDate: relDate(0),
    priority: "Medium",
    status: "Open",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "task-9",
    title: "Update privacy policy for GDPR v2",
    description:
      "Legal reviewed and flagged five sections needing updates before Nov 1 deadline. Coordinate with counsel and publish to marketing site.",
    owner: "Sofia Almonte",
    dueDate: relDate(-1),
    priority: "Large",
    status: "Overdue",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "task-10",
    title: "Refactor notification service",
    description:
      "Extract notification dispatch into a dedicated microservice. Use BullMQ for queuing. Decommission legacy Sendgrid direct calls.",
    owner: "David Osei",
    dueDate: relDate(14),
    priority: "Small",
    status: "Open",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "task-11",
    title: "Conduct user interviews for search feature",
    description:
      "Recruit 6 beta users and run 30-min moderated sessions on the new search prototype. Synthesise findings into insight deck.",
    owner: "Aisha Mensah",
    dueDate: relDate(3),
    priority: "Small",
    status: "Done",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "task-12",
    title: "Ship dark mode toggle",
    description:
      "Implement theme switch in app header persisted to localStorage. Test across all major pages and fix contrast issues flagged in audit.",
    owner: "Lena Hartmann",
    dueDate: relDate(-3),
    priority: "Small",
    status: "Done",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "👋 Welcome to **CommitDesk**. Paste meeting notes, action items, or any text into this chat and I'll extract structured tasks automatically.\n\nYour tasks appear on the board on the right and persist in your browser.",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "msg-2",
    role: "user",
    content:
      "Quick sync notes from this morning:\n\n- Priya to finalise the Q4 roadmap doc by EOW\n- Marcus needs to fix the iOS login timeout bug today, it's blocking QA\n- Sofia will draft the onboarding email sequence, low urgency but needed by end of month\n- David to run the security audit — was supposed to be done last week",
    timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "Got it! I extracted **4 tasks** from your notes and added them to the board:\n\n• **Finalise Q4 roadmap document** → Priya Nair, Large priority\n• **Fix login timeout regression on iOS** → Marcus Webb, Large priority (due today)\n• **Write onboarding email sequence** → Sofia Almonte, Medium priority\n• **Run security audit on API endpoints** → David Osei, Large priority (⚠️ overdue)\n\nYou can edit any task by clicking on it in the board.",
    timestamp: new Date(Date.now() - 27 * 60000).toISOString(),
    extractedTaskIds: ["task-1", "task-2", "task-3", "task-4"],
  },
];

// Generates a stable UUID-like id for browser environments
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `task-${crypto.randomUUID()}`;
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Simple task extraction from freeform text
export function extractTasksFromText(text: string): Omit<Task, "id" | "createdAt">[] {
  const today = new Date();
  const tasks: Omit<Task, "id" | "createdAt">[] = [];

  // Split by line or bullet patterns
  const lines = text
    .split(/\n/)
    .map((l) => l.replace(/^[\s\-\*\•\d\.\)]+/, "").trim())
    .filter((l) => l.length > 10);

  // Priority keywords
  const priorityMap: { pattern: RegExp; priority: Priority }[] = [
    { pattern: /\b(critical|urgent|asap|blocking|blocker|high.priority|large|major)\b/i, priority: "Large" },
    { pattern: /\b(medium|moderate|normal|standard|soon)\b/i, priority: "Medium" },
    { pattern: /\b(small|minor|low.priority|nice.to.have|eventually|low)\b/i, priority: "Small" },
  ];

  // Owner patterns: "X to do", "assigned to X", "X will", "X needs to", "@X"
  const ownerPatterns = [
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:to|will|should|needs? to|must)\b/,
    /\bassigned? to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /@([A-Za-z]+(?:\s+[A-Za-z]+)?)/,
    /\bowner[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];

  // Due date patterns
  const dueDatePatterns: { pattern: RegExp; resolver: (m: RegExpMatchArray) => string }[] = [
    {
      pattern: /\btoday\b/i,
      resolver: () => today.toISOString().split("T")[0],
    },
    {
      pattern: /\btomorrow\b/i,
      resolver: () => {
        const d = new Date(today);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      },
    },
    {
      pattern: /\bthis week|eow|end of week\b/i,
      resolver: () => {
        const d = new Date(today);
        const daysToFriday = (5 - d.getDay() + 7) % 7 || 7;
        d.setDate(d.getDate() + daysToFriday);
        return d.toISOString().split("T")[0];
      },
    },
    {
      pattern: /\bnext week\b/i,
      resolver: () => {
        const d = new Date(today);
        d.setDate(d.getDate() + 7);
        return d.toISOString().split("T")[0];
      },
    },
    {
      pattern: /\bend of month|eom\b/i,
      resolver: () => {
        const d = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return d.toISOString().split("T")[0];
      },
    },
    {
      pattern: /\bin (\d+) days?\b/i,
      resolver: (m) => {
        const d = new Date(today);
        d.setDate(d.getDate() + parseInt(m[1]));
        return d.toISOString().split("T")[0];
      },
    },
    {
      pattern: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})\b/i,
      resolver: (m) => {
        const months: Record<string, number> = {
          jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
          jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
        };
        const month = months[m[1].toLowerCase().slice(0, 3)];
        const day = parseInt(m[2]);
        const year = today.getFullYear();
        const d = new Date(year, month, day);
        if (d < today) d.setFullYear(year + 1);
        return d.toISOString().split("T")[0];
      },
    },
  ];

  // Check if text mentions "last week", "overdue" etc → set overdue
  const overdueKeywords = /\b(overdue|last week|was due|missed|late|past due|should.ve been)\b/i;

  for (const line of lines) {
    if (line.length < 10) continue;

    // Detect priority
    let priority: Priority = "Medium";
    for (const { pattern, priority: p } of priorityMap) {
      if (pattern.test(line)) {
        priority = p;
        break;
      }
    }

    // Detect owner
    let owner = "Unassigned";
    for (const pat of ownerPatterns) {
      const m = line.match(pat);
      if (m) {
        owner = m[1].trim();
        break;
      }
    }

    // Detect due date
    let dueDate = relDate(7); // default: 1 week
    let status: Status = "Open";
    for (const { pattern, resolver } of dueDatePatterns) {
      const m = line.match(pattern);
      if (m) {
        dueDate = resolver(m);
        break;
      }
    }

    // Override status if overdue detected
    if (overdueKeywords.test(line)) {
      const d = new Date(today);
      d.setDate(d.getDate() - 3);
      dueDate = d.toISOString().split("T")[0];
      status = "Overdue";
    }

    // Check due date against today
    if (status !== "Overdue") {
      const due = new Date(dueDate);
      due.setHours(23, 59, 59);
      if (due < today) status = "Overdue";
    }

    // Clean up title: strip leading owner mention
    const title = line.replace(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:to|will|should|needs? to|must)\s+/i, "").slice(0, 100);

    if (title.length < 5) continue;

    tasks.push({
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description: `Extracted from meeting notes: "${line.slice(0, 200)}"`,
      owner,
      dueDate,
      priority,
      status,
    });
  }

  return tasks;
}
