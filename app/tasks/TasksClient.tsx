"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import type { Task, CreateTaskData } from "@/lib/tasks/types";
import { tasksClient } from "@/lib/tasks/client";

interface Props {
  initialUser: User;
}

export default function TasksClient({ initialUser }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const taskData = await tasksClient.getTasks();
      setTasks(taskData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <p>This is the tasks page</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>Tasks: {JSON.stringify(tasks, null, 2)}</pre>
      </div>
    </div>
  );
}
