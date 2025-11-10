"use client";

import { toast } from "sonner";
import { TaskForm } from "@/tasks/task-form";
import { EventForm } from "@/calendar/event-form";
import { useTasks } from "@/contexts/tasks-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCreateDialog } from "@/contexts/create-dialog-context";
import { useEvents } from "@/contexts/events-context";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "task" | "event")}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="task" className="flex items-center gap-2">
              <span>Task</span>
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2">
              <span>Event</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="task" className="mt-4">
            <TaskForm
              onSubmitSuccess={handleTaskSuccess}
              onCancel={closeCreateDialog}
            />
          </TabsContent>

          <TabsContent value="event" className="mt-4">
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
