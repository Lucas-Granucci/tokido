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
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {groupedTasks.map((group) => (
          <TaskList key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
