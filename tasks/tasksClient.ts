import { supabase } from "../lib/supabase/client";
import type { Task, TaskFormData } from "./interfaces";
import { getCurrentUserClient } from "@/lib/user-client";

export const tasksClient = {
  // get all tasks for current user
  async getTasks(): Promise<Task[]> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // create new task
  async createTask(taskData: TaskFormData): Promise<Task> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          name: taskData.name,
          category: taskData.category,
          priority: taskData.priority,
          duration: taskData.duration,
          due_date: taskData.dueDate,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // delete task by id
  async deleteTask(taskId: string): Promise<void> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id);

    if (error) throw error;
  },
};
