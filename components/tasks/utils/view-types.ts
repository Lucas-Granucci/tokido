import { Task } from "@/lib/tasks/types";

export interface ViewConfig {
  [key: string]: {
    label: string;
    color: string;
    filter: (task: Task) => boolean;
    sort?: (a: Task, b: Task) => number;
  };
}

export type ViewType = "priority" | "category" | "duration";

export interface TaskGroup {
  id: string;
  label: string;
  color: string;
  tasks: Task[];
}
