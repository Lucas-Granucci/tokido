import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { TaskForm } from "../forms/task-form";
import { toast } from "sonner";
import { useTasks } from "@/contexts/tasks-context";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const { refreshTasks } = useTasks();

  const handleSuccess = async () => {
    onOpenChange(false);
    toast("Task created successfully");
    await refreshTasks();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Create Task</DialogTitle>
        <TaskForm
          onSubmitSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
