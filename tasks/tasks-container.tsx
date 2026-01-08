import { useMemo } from "react";

import TaskList from "./task-list";
import type { Task } from "./interfaces";
import type { TaskGroup } from "./interfaces";
import type { TaskViewType } from "@/types/views";
import presentationConfigs from "@/utils/presentation-configs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategoryConfig } from "@/hooks/use-category-config";

interface TasksContainerProps {
  tasks: Task[];
  viewOption: TaskViewType;
}

export function TasksContainer({ tasks, viewOption }: TasksContainerProps) {
  const { categories, getCategoryColor, getCategory } = useCategoryConfig();

  const groupedTasks: TaskGroup[] = useMemo(() => {
    if (viewOption === "category") {
      const bucketMap = new Map<string, TaskGroup>(
        categories.map((category) => [
          category.id,
          {
            id: category.id,
            label: category.label,
            color: getCategoryColor(category.id),
            tasks: [] as Task[],
          },
        ]),
      );

      const uncategorized: Task[] = [];

      tasks.forEach((task) => {
        const resolved = task.category ? getCategory(task.category) : undefined;

        if (resolved) {
          const bucket = bucketMap.get(resolved.id);
          if (bucket) {
            bucket.tasks.push(task);
          } else {
            bucketMap.set(resolved.id, {
              id: resolved.id,
              label: resolved.label,
              color: getCategoryColor(resolved.id),
              tasks: [task],
            });
          }
        } else {
          uncategorized.push(task);
        }
      });

      const grouped = Array.from(bucketMap.values());

      if (uncategorized.length > 0) {
        grouped.push({
          id: "uncategorized",
          label: "Uncategorized",
          color: getCategoryColor(),
          tasks: uncategorized,
        });
      }

      return grouped;
    }

    const config = presentationConfigs[viewOption];
    return Object.entries(config).map(([key, value]) => ({
      id: key,
      label: value.label,
      color: value.color,
      tasks: tasks.filter(value.filter),
    }));
  }, [categories, getCategory, getCategoryColor, tasks, viewOption]);

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
