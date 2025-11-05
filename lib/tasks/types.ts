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
