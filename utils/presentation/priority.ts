import { Task } from "@/tasks/interfaces";
import type { PresentationConfig } from "@/types/render-config";

export const priority: PresentationConfig<Task> = {
  high: {
    label: "High",
    color: "#DC2626",
    filter: (task: Task) => task.priority === "High",
  },
  medium: {
    label: "Medium",
    color: "#F59E0B",
    filter: (task: Task) => task.priority === "Medium",
  },
  low: {
    label: "Low",
    color: "#16A34A",
    filter: (task: Task) => task.priority === "Low",
  },
};

export default priority;
