export interface Task {
  id: string;
  user_id: string;
  name: string;
  category: string;
  priority: "low" | "medium" | "high";
  duration: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  name: string;
  category: string;
  priority: "low" | "medium" | "high";
  duration: string;
  dueDate: string;
}
