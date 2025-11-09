import { TaskViewType } from "./types";

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

export interface TaskViewConfig {
  [key: string]: {
    label: string;
    color: string;
    eventBadgeClasses: string;
    filter: (task: Task) => boolean;
    sort?: (a: Task, b: Task) => number;
  };
}
