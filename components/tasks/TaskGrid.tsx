import TaskList from "./TaskList";
import { Task } from "@/lib/tasks/types";
import { viewConfigs } from "./utils/view-config";
import { TaskGroup, ViewType } from "./utils/view-types";

interface TaskGridProps {
  tasks: Task[];
  viewOption: ViewType;
}

export function TaskGrid({ tasks, viewOption }: TaskGridProps) {
  const groupedTasks: TaskGroup[] = Object.entries(viewConfigs[viewOption]).map(
    ([key, config]) => ({
      id: key,
      label: config.label,
      color: config.color,
      tasks: tasks.filter(config.filter),
    })
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groupedTasks.map((group) => (
          <TaskList key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
