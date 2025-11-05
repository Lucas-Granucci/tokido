import { Task } from "@/lib/tasks/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, X } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  getPriorityColor,
  getDurationColor,
  getCategoryColor,
} from "./utils/config-utils";
import { useTasks } from "@/contexts/tasks-context";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);
  const durationColor = getDurationColor(task.duration);

  const { deleteTask } = useTasks();

  return (
    <Card className="p-1 hover:shadow-md transition-shadow duration-200">
      <CardContent className="pl-2 pr-0">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm">{task.name}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => deleteTask(task.id)}
          >
            <X />
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Badge
            className="text-xs"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {task.category}
          </Badge>
          <Badge
            className="text-xs"
            style={{
              backgroundColor: `${durationColor}20`,
              color: durationColor,
            }}
          >
            {task.duration} min
          </Badge>
          <Badge
            className="text-xs"
            style={{
              backgroundColor: `${priorityColor}20`,
              color: priorityColor,
            }}
          >
            {task.priority}
          </Badge>
        </div>
        <span className="inline-flex items-center justify-center text-muted-foreground gap-1.5">
          <Calendar size={14} />
          <span className="text-xs">
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        </span>
      </CardContent>
    </Card>
  );
}
