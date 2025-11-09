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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle>{group.label}</CardTitle>
          <p className="text-sm text-muted-foreground">
            ({group.tasks.length})
          </p>
        </div>

        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={openCreateDialog}
        >
          <Plus />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
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
