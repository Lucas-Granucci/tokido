import type { TaskViewType } from "@/types/views";

export interface Task {
  id: string;
  user_id: string;
  name: string;
  category: string;
  priority: string;
  duration: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  name: string;
  category: string;
  priority: string;
  duration: number;
  dueDate: Date | null;
}

export interface TaskGroup {
  id: string;
  label: string;
  color: string;
  tasks: Task[];
}

export interface TaskCategory {
  value: TaskViewType;
  title: string;
  icon: React.ElementType;
}
