import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { TaskForm } from "../forms/task-form";
import { toast } from "sonner";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    // toast("Task created successfully");
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
