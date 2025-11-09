import TaskList from "./TaskList";
import { Task } from "./interfaces";
import { taskViewConfigs } from "./utils/view-config";
import { TaskGroup } from "./interfaces";
import { TaskViewType } from "./types";

interface TasksContainerProps {
  tasks: Task[];
  viewOption: TaskViewType;
}

export function TasksContainer({ tasks, viewOption }: TasksContainerProps) {
  const groupedTasks: TaskGroup[] = Object.entries(
    taskViewConfigs[viewOption]
  ).map(([key, config]) => ({
    id: key,
    label: config.label,
    color: config.color,
    tasks: tasks.filter(config.filter),
  }));

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
