"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Task } from "@/lib/tasks/types";
import { tasksClient } from "@/lib/tasks/tasksClient";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TasksContext = createContext<TaskContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = async () => {
    try {
      setLoading(true);
      const taskData = await tasksClient.getTasks();
      setTasks(taskData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Optimistically update the UI
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      await tasksClient.deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      await refreshTasks(); // get correct state
      throw error;
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, loading, refreshTasks, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
