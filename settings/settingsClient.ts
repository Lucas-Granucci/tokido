import { supabase } from "@/lib/supabase/client";
import { getCurrentUserClient } from "@/lib/user-client";

export type SettingsTheme = "light" | "dark" | "system";

export type SettingsCategory = {
  id: string;
  label: string;
  color: string;
  icon: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  theme: SettingsTheme;
  categories: SettingsCategory[];
  updated_at: string;
};

export const DEFAULT_CATEGORIES: SettingsCategory[] = [
  { id: "school", label: "School", color: "#2563EB", icon: "GraduationCap" },
  { id: "research", label: "Research", color: "#7C3AED", icon: "Microscope" },
  { id: "coding", label: "Coding", color: "#0891B2", icon: "Code2" },
  { id: "personal", label: "Personal", color: "#059669", icon: "User" },
  { id: "work", label: "Work", color: "#D97706", icon: "Briefcase" },
  { id: "other", label: "Other", color: "#4B5563", icon: "MoreHorizontal" },
];

function normalizeCategories(categories?: unknown): SettingsCategory[] {
  if (!Array.isArray(categories)) return DEFAULT_CATEGORIES;

  const byId = new Map<string, SettingsCategory>();

  for (const item of categories.slice(0, 6)) {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      "label" in item &&
      "color" in item &&
      "icon" in item
    ) {
      const typed = item as SettingsCategory;
      if (typed.id && typed.label && typed.color && typed.icon) {
        byId.set(typed.id, typed);
      }
    }
  }

  for (const def of DEFAULT_CATEGORIES) {
    if (!byId.has(def.id)) {
      byId.set(def.id, def);
    }
  }

  return Array.from(byId.values()).slice(0, 6);
}

type UpdateSettingsInput = {
  theme?: SettingsTheme;
  categories?: SettingsCategory[];
};

async function ensureUserSettingsRow(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId }, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;

  return {
    ...(data as UserSettings),
    categories: normalizeCategories(data?.categories),
  };
}

export const settingsClient = {
  async getSettings(): Promise<UserSettings> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    return ensureUserSettingsRow(user.id);
  },

  async updateSettings(input: UpdateSettingsInput): Promise<UserSettings> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const payload: Partial<UserSettings> = { user_id: user.id };
    if (typeof input.theme !== "undefined") payload.theme = input.theme;
    if (typeof input.categories !== "undefined")
      payload.categories = input.categories;

    const { data, error } = await supabase
      .from("user_settings")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;
    return {
      ...(data as UserSettings),
      categories: normalizeCategories(data?.categories),
    };
  },
};
