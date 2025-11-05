export type PriorityType = "" | "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  name: string;
  category: string;
  priority: PriorityType;
  duration: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  name: string;
  category: string;
  priority: PriorityType;
  duration: number;
  dueDate: Date | null;
}
