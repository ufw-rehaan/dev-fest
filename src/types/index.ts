export type Priority = "Small" | "Medium" | "Large";
export type Status = "Open" | "Done" | "Overdue";

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  extractedTaskIds?: string[];
}
