import TaskList from "./task-list";
import type { Task } from "./interfaces";
import type { TaskGroup } from "./interfaces";
import type { TaskViewType } from "@/types/views";
import presentationConfigs from "@/utils/presentation-configs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TasksContainerProps {
  tasks: Task[];
  viewOption: TaskViewType;
}

export function TasksContainer({ tasks, viewOption }: TasksContainerProps) {
  const groupedTasks: TaskGroup[] = Object.entries(
    presentationConfigs[viewOption]
  ).map(([key, config]) => ({
    id: key,
    label: config.label,
    color: config.color,
    tasks: tasks.filter(config.filter),
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="h-full" type="always">
        <div
          className="grid gap-3 p-2 sm:gap-4 sm:p-3 md:gap-6 md:p-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {groupedTasks.map((group) => (
            <TaskList key={group.id} group={group} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
