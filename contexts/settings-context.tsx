"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  settingsClient,
  DEFAULT_CATEGORIES,
  type SettingsCategory,
  type SettingsTheme,
} from "@/settings/settingsClient";
import { getCategoryIcon } from "@/utils/category-icons";

type CategoryWithIcon = SettingsCategory & { Icon: LucideIcon };

type SettingsContextValue = {
  categories: CategoryWithIcon[];
  theme: SettingsTheme;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (input: {
    theme?: SettingsTheme;
    categories?: SettingsCategory[];
  }) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

function attachIcons(categories: SettingsCategory[]): CategoryWithIcon[] {
  return categories.map((category) => ({
    ...category,
    Icon: getCategoryIcon(category.icon),
  }));
}

let cachedCategories = attachIcons(DEFAULT_CATEGORIES);
export function getCachedCategories(): CategoryWithIcon[] {
  return cachedCategories;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] =
    useState<CategoryWithIcon[]>(cachedCategories);
  const [theme, setTheme] = useState<SettingsTheme>("system");
  const [loading, setLoading] = useState<boolean>(true);

  const hydrate = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await settingsClient.getSettings();
      const nextCategories = attachIcons(settings.categories);
      cachedCategories = nextCategories;
      setCategories(nextCategories);
      setTheme(settings.theme ?? "system");
    } catch (error) {
      console.error("Error loading settings:", error);
      const fallbackCategories = attachIcons(DEFAULT_CATEGORIES);
      cachedCategories = fallbackCategories;
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const refreshSettings = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  const updateSettings = useCallback(
    async (input: {
      theme?: SettingsTheme;
      categories?: SettingsCategory[];
    }) => {
      try {
        setLoading(true);
        const updated = await settingsClient.updateSettings(input);
        const nextCategories = attachIcons(updated.categories);
        cachedCategories = nextCategories;
        setCategories(nextCategories);
        setTheme(updated.theme ?? "system");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value: SettingsContextValue = {
    categories,
    theme,
    loading,
    refreshSettings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
