"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Flag, Folder, Plus } from "lucide-react";
import { TasksContainer } from "@/tasks/tasks-container";
import { useTasks } from "@/contexts/tasks-context";
import { TaskCategory } from "@/tasks/interfaces";

export default function TasksPageClient() {
  const { tasks, loading } = useTasks();

  const TaskCategories: TaskCategory[] = [
    // { value: "dueDate", title: "Due Date", icon: Calendar },
    { value: "duration", title: "Duration", icon: Clock },
    { value: "priority", title: "Priority", icon: Flag },
    { value: "category", title: "Category", icon: Folder },
  ];

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="w-full">
          {TaskCategories.map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              className="w-full justify-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TaskCategories.map((item) => (
          <TabsContent value={item.value} key={item.value}>
            <TasksContainer tasks={tasks} viewOption={item.value} />
          </TabsContent>
        ))}
      </Tabs>

      {/* FAB that sticks to content */}
      {/* <div className="fixed bottom-8 right-8">
        <Button className="h-12 w-12 rounded-full shadow-lg gap-0" size="icon">
          <Plus className="h-6 w-6" />
          <span className="sr-only">New Task</span>
        </Button>
      </div> */}
    </div>
  );
}
