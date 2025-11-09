import { Task } from "@/tasks/interfaces";
import type { PresentationConfig } from "@/types/render-config";

export const category: PresentationConfig<Task> = {
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
};

export default category;
