"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Flag, Folder } from "lucide-react";
import { TasksContainer } from "@/tasks/tasks-container";
import { useTasks } from "@/contexts/tasks-context";
import { TaskCategory } from "@/tasks/interfaces";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex h-full flex-col gap-4 overflow-hidden min-h-0">
      <Tabs
        defaultValue="priority"
        className="flex w-full flex-1 flex-col overflow-hidden min-h-0"
      >
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-background min-h-0">
          <div className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <TabsList className="flex w-full h-10 md:h-9">
                {TaskCategories.map((item) => (
                  <TabsTrigger
                    value={item.value}
                    key={item.value}
                    className="flex-1 justify-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          <Separator />
          <div className="flex-1 overflow-hidden">
            {TaskCategories.map((item) => (
              <TabsContent
                value={item.value}
                key={item.value}
                className="m-0 h-full overflow-hidden p-0"
              >
                <TasksContainer tasks={tasks} viewOption={item.value} />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
