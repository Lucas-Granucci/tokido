import { Task } from "@/tasks/interfaces";
import type { PresentationConfig } from "@/types/render-config";

export const duration: PresentationConfig<Task> = {
  short: {
    label: "<5 min",
    color: "#22C55E",
    filter: (task) => (task.duration || 0) <= 5,
  },
  medium: {
    label: "<15 min",
    color: "#84CC16",
    filter: (task) => (task.duration || 0) > 5 && (task.duration || 0) <= 15,
  },
  long: {
    label: "<30 min",
    color: "#EAB308",
    filter: (task) => (task.duration || 0) > 15 && (task.duration || 0) <= 30,
  },
  extended: {
    label: "<1 hour",
    color: "#F97316",
    filter: (task) => (task.duration || 0) > 30 && (task.duration || 0) <= 60,
  },
  lengthy: {
    label: "<2 hours",
    color: "#EF4444",
    filter: (task) => (task.duration || 0) > 60 && (task.duration || 0) <= 120,
  },
  marathon: {
    label: "2+ hours",
    color: "#991B1B",
    filter: (task) => (task.duration || 0) > 120,
  },
};

export default duration;
