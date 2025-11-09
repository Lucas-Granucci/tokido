import { Task } from "../interfaces";
import { TaskViewConfig } from "../interfaces";

export const taskViewConfigs = {
  priority: {
    high: {
      label: "High",
      color: "#DC2626",
      filter: (task: Task) => task.priority === "High",
      eventBadgeClasses:
        "border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]/90 dark:border-[#DC2626]/30 dark:bg-[#DC2626]/20 dark:text-[#DC2626]/80 [&_.event-dot]:fill-[#DC2626]",
    },
    medium: {
      label: "Medium",
      color: "#F59E0B",
      filter: (task: Task) => task.priority === "Medium",
      eventBadgeClasses:
        "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]/90 dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]/80 [&_.event-dot]:fill-[#F59E0B]",
    },
    low: {
      label: "Low",
      color: "#16A34A",
      filter: (task: Task) => task.priority === "Low",
      eventBadgeClasses:
        "border-[#16A34A]/20 bg-[#16A34A]/10 text-[#16A34A]/90 dark:border-[#16A34A]/30 dark:bg-[#16A34A]/20 dark:text-[#16A34A]/80 [&_.event-dot]:fill-[#16A34A]",
    },
  } as TaskViewConfig,

  duration: {
    short: {
      label: "<5 min",
      color: "#22C55E",
      filter: (task) => (task.duration || 0) <= 5,
      eventBadgeClasses:
        "border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]/90 dark:border-[#22C55E]/30 dark:bg-[#22C55E]/20 dark:text-[#22C55E]/80 [&_.event-dot]:fill-[#22C55E]",
    },
    medium: {
      label: "<15 min",
      color: "#84CC16",
      filter: (task) => (task.duration || 0) > 5 && (task.duration || 0) <= 15,
      eventBadgeClasses:
        "border-[#84CC16]/20 bg-[#84CC16]/10 text-[#84CC16]/90 dark:border-[#84CC16]/30 dark:bg-[#84CC16]/20 dark:text-[#84CC16]/80 [&_.event-dot]:fill-[#84CC16]",
    },
    long: {
      label: "<30 min",
      color: "#EAB308",
      filter: (task) => (task.duration || 0) > 15 && (task.duration || 0) <= 30,
      eventBadgeClasses:
        "border-[#EAB308]/20 bg-[#EAB308]/10 text-[#EAB308]/90 dark:border-[#EAB308]/30 dark:bg-[#EAB308]/20 dark:text-[#EAB308]/80 [&_.event-dot]:fill-[#EAB308]",
    },
    extended: {
      label: "<1 hour",
      color: "#F97316",
      filter: (task) => (task.duration || 0) > 30 && (task.duration || 0) <= 60,
      eventBadgeClasses:
        "border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]/90 dark:border-[#F97316]/30 dark:bg-[#F97316]/20 dark:text-[#F97316]/80 [&_.event-dot]:fill-[#F97316]",
    },
    lengthy: {
      label: "<2 hours",
      color: "#EF4444",
      filter: (task) =>
        (task.duration || 0) > 60 && (task.duration || 0) <= 120,
      eventBadgeClasses:
        "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]/90 dark:border-[#EF4444]/30 dark:bg-[#EF4444]/20 dark:text-[#EF4444]/80 [&_.event-dot]:fill-[#EF4444]",
    },
    marathon: {
      label: "2+ hours",
      color: "#991B1B",
      filter: (task) => (task.duration || 0) > 120,
      eventBadgeClasses:
        "border-[#991B1B]/20 bg-[#991B1B]/10 text-[#991B1B]/90 dark:border-[#991B1B]/30 dark:bg-[#991B1B]/20 dark:text-[#991B1B]/80 [&_.event-dot]:fill-[#991B1B]",
    },
  } as TaskViewConfig,

  category: {
    school: {
      label: "School",
      color: "#2563EB",
      filter: (task) => task.category === "School",
      eventBadgeClasses:
        "border-[#2563EB]/20 bg-[#2563EB]/10 text-[#2563EB]/90 dark:border-[#2563EB]/30 dark:bg-[#2563EB]/20 dark:text-[#2563EB]/80 [&_.event-dot]:fill-[#2563EB]",
    },
    research: {
      label: "Research",
      color: "#7C3AED",
      filter: (task) => task.category === "Research",
      eventBadgeClasses:
        "border-[#7C3AED]/20 bg-[#7C3AED]/10 text-[#7C3AED]/90 dark:border-[#7C3AED]/30 dark:bg-[#7C3AED]/20 dark:text-[#7C3AED]/80 [&_.event-dot]:fill-[#7C3AED]",
    },
    coding: {
      label: "Coding",
      color: "#0891B2",
      filter: (task) => task.category === "Coding",
      eventBadgeClasses:
        "border-[#0891B2]/20 bg-[#0891B2]/10 text-[#0891B2]/90 dark:border-[#0891B2]/30 dark:bg-[#0891B2]/20 dark:text-[#0891B2]/80 [&_.event-dot]:fill-[#0891B2]",
    },
    personal: {
      label: "Personal",
      color: "#059669",
      filter: (task) => task.category === "Personal",
      eventBadgeClasses:
        "border-[#059669]/20 bg-[#059669]/10 text-[#059669]/90 dark:border-[#059669]/30 dark:bg-[#059669]/20 dark:text-[#059669]/80 [&_.event-dot]:fill-[#059669]",
    },
    work: {
      label: "Work",
      color: "#D97706",
      filter: (task) => task.category === "Work",
      eventBadgeClasses:
        "border-[#D97706]/20 bg-[#D97706]/10 text-[#D97706]/90 dark:border-[#D97706]/30 dark:bg-[#D97706]/20 dark:text-[#D97706]/80 [&_.event-dot]:fill-[#D97706]",
    },
    other: {
      label: "Other",
      color: "#4B5563",
      filter: (task) => !task.category || task.category === "Other",
      eventBadgeClasses:
        "border-[#4B5563]/20 bg-[#4B5563]/10 text-[#4B5563]/90 dark:border-[#4B5563]/30 dark:bg-[#4B5563]/20 dark:text-[#4B5563]/80 [&_.event-dot]:fill-[#4B5563]",
    },
  } as TaskViewConfig,
};
