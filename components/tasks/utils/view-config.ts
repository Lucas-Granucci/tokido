import { Task } from "@/lib/tasks/types";
import { ViewConfig } from "./view-types";

export const viewConfigs = {
  priority: {
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
  } as ViewConfig,

  duration: {
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
      filter: (task) =>
        (task.duration || 0) > 60 && (task.duration || 0) <= 120,
    },
    marathon: {
      label: "2+ hours",
      color: "#991B1B",
      filter: (task) => (task.duration || 0) > 120,
    },
  } as ViewConfig,

  category: {
    school: {
      label: "School",
      color: "#2563EB",
      filter: (task) => task.category === "School",
    },
    research: {
      label: "Research",
      color: "#7C3AED",
      filter: (task) => task.category === "Research",
    },
    coding: {
      label: "Coding",
      color: "#0891B2",
      filter: (task) => task.category === "Coding",
    },
    personal: {
      label: "Personal",
      color: "#059669",
      filter: (task) => task.category === "Personal",
    },
    work: {
      label: "Work",
      color: "#D97706",
      filter: (task) => task.category === "Work",
    },
    other: {
      label: "Other",
      color: "#4B5563",
      filter: (task) => !task.category || task.category === "Other",
    },
  } as ViewConfig,
};
