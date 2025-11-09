"use client";

import { toast } from "sonner";
import { TaskForm } from "@/tasks/task-form";
import { EventForm } from "@/calendar/event-form";
import { useTasks } from "@/contexts/tasks-context";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useCreateDialog } from "@/contexts/create-dialog-context";
import { useEvents } from "@/contexts/events-context";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function CreateDialog() {
  const { refreshTasks } = useTasks();
  const { refreshEvents } = useEvents();
  const [activeTab, setActiveTab] = useState<"task" | "event">("task");

  const { isCreateDialogOpen, closeCreateDialog, setIsCreateDialogOpen } =
    useCreateDialog();

  const handleTaskSuccess = async () => {
    closeCreateDialog();

    toast.success("Task Created!", {
      description: "New task has been added to your list",
      duration: 3000,
    });

    await refreshTasks();
  };

  const handleEventSuccess = async () => {
    closeCreateDialog();

    toast.success("Event Created!", {
      description: "New event has been added to your calendar",
      duration: 3000,
    });

    await refreshEvents();
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent>
        <DialogTitle>Create</DialogTitle>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "task" | "event")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="event">Event</TabsTrigger>
          </TabsList>

          <TabsContent value="task">
            <TaskForm
              onSubmitSuccess={handleTaskSuccess}
              onCancel={closeCreateDialog}
            />
          </TabsContent>

          <TabsContent value="event">
            <EventForm
              onSubmitSuccess={handleEventSuccess}
              onCancel={closeCreateDialog}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
