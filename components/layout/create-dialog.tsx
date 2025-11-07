"use client";

import { toast } from "sonner";
import { TaskForm } from "../forms/task-form";
import { useTasks } from "@/contexts/tasks-context";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useCreateDialog } from "@/contexts/create-dialog-context";
import { Task } from "@/lib/tasks/types";

export function CreateDialog() {
  const { refreshTasks } = useTasks();
  const { isCreateDialogOpen, closeCreateDialog, setIsCreateDialogOpen } =
    useCreateDialog();

  const handleSuccess = async () => {
    closeCreateDialog();

    toast.success("Task Created!", {
      description: "New task has been added to your list",
      duration: 3000,
    });

    await refreshTasks();
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent>
        <DialogTitle>Create Task</DialogTitle>
        <TaskForm
          onSubmitSuccess={handleSuccess}
          onCancel={closeCreateDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
