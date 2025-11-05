import { TaskGroup } from "./types/view-types";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "../ui/card";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import TaskCard from "./TaskCard";

interface TaskListProps {
  group: TaskGroup;
}

export default function TaskList({ group }: TaskListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle>{group.label}</CardTitle>
          <p className="text-sm text-muted-foreground">
            ({group.tasks.length})
          </p>
        </div>

        <Button variant="outline" size="sm">
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
