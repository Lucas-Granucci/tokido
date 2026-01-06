import TaskCard from "./task-card";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { TaskGroup } from "./interfaces";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";
import { useCreateDialog } from "@/contexts/create-dialog-context";

interface TaskListProps {
  group: TaskGroup;
}

export default function TaskList({ group }: TaskListProps) {
  const { openCreateDialog } = useCreateDialog();
  return (
    <Card className="shadow-none gap-0 p-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CardTitle>{group.label}</CardTitle>
          <p className="text-xs text-muted-foreground sm:text-sm">
            ({group.tasks.length})
          </p>
        </div>

        <Button
          className="cursor-pointer h-8 w-8 p-0 sm:h-9 sm:w-9"
          variant="outline"
          size="sm"
          onClick={openCreateDialog}
        >
          <Plus />
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="space-y-2 sm:space-y-3">
          {group.tasks.length > 0 ? (
            group.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <p>No tasks</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
