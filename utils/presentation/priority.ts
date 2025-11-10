import { Task } from "@/tasks/interfaces";
import type { PresentationConfig } from "@/types/render-config";
import { Flag, FlagTriangleRight, FlagOff } from "lucide-react";

export const priority: PresentationConfig<Task> = {
  high: {
    label: "High",
    color: "#DC2626",
    icon: Flag,
    filter: (task: Task) => task.priority === "High",
  },
  medium: {
    label: "Medium",
    color: "#F59E0B",
    icon: FlagTriangleRight,
    filter: (task: Task) => task.priority === "Medium",
  },
  low: {
    label: "Low",
    color: "#16A34A",
    icon: FlagOff,
    filter: (task: Task) => task.priority === "Low",
  },
};

export default priority;
