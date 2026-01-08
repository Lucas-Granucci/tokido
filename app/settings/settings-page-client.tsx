"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  GraduationCap,
  Microscope,
  Code2,
  User,
  Briefcase,
  MoreHorizontal,
  Palette,
  Sparkles,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import { calendarClient } from "@/calendar/calendarClient";
import { settingsClient, DEFAULT_CATEGORIES } from "@/settings/settingsClient";
import type {
  SettingsCategory,
  SettingsTheme,
} from "@/settings/settingsClient";
import { tasksClient } from "@/tasks/tasksClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/contexts/settings-context";
import { useTasks } from "@/contexts/tasks-context";
import { useEvents } from "@/contexts/events-context";

const ICON_OPTIONS = [
  { value: "GraduationCap", label: "Graduation Cap", icon: GraduationCap },
  { value: "Microscope", label: "Microscope", icon: Microscope },
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "User", label: "User", icon: User },
  { value: "Briefcase", label: "Briefcase", icon: Briefcase },
  { value: "MoreHorizontal", label: "Other", icon: MoreHorizontal },
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
];

const THEME_OPTIONS = [
  { value: "light" as SettingsTheme, label: "Light", icon: Sun },
  { value: "dark" as SettingsTheme, label: "Dark", icon: Moon },
  { value: "system" as SettingsTheme, label: "System", icon: Monitor },
];

function CategoryGridItem({
  category,
  onChange,
}: {
  category: SettingsCategory;
  onChange: (updated: SettingsCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border shadow-sm transition-opacity hover:opacity-90">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: category.color }}
          />
          <Input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
            title="Pick color"
          />
        </div>
        <Input
          value={category.label}
          onChange={(e) => onChange({ ...category, label: e.target.value })}
          className="h-9 flex-1"
          placeholder="Category Label"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={category.icon}
          onValueChange={(value) => onChange({ ...category, icon: value })}
        >
          <SelectTrigger className="h-8 flex-1 text-xs">
            <SelectValue placeholder="Icon" />
          </SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-3 w-3" />
                  <span className="text-xs">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={category.color}
          onChange={(e) => onChange({ ...category, color: e.target.value })}
          className="h-8 w-20 text-xs font-mono"
          placeholder="#Hex"
        />
      </div>
    </div>
  );
}

export default function SettingsPageClient() {
  const { setTheme: setSystemTheme } = useTheme();
  const { updateSettings } = useSettings();
  const { refreshTasks } = useTasks();
  const { refreshEvents } = useEvents();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [theme, setTheme] = useState<SettingsTheme>("system");
  const [categories, setCategories] = useState<SettingsCategory[]>(() =>
    DEFAULT_CATEGORIES.map((c) => ({ ...c })),
  );
  const [initialCategories, setInitialCategories] = useState<
    SettingsCategory[]
  >(() => DEFAULT_CATEGORIES.map((c) => ({ ...c })));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const settings = await settingsClient.getSettings();
        if (!mounted) return;

        const nextTheme = settings.theme ?? "system";
        setTheme(nextTheme);
        setSystemTheme(nextTheme);
        const rawCategories = (settings.categories ?? DEFAULT_CATEGORIES).map(
          (c) => ({ ...c }),
        );
        setInitialCategories(rawCategories);
        const normalizedCategories = rawCategories.map((c) => ({
          ...c,
          label: c.label.trim(),
        }));
        setCategories(normalizedCategories);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setSystemTheme]);

  const categoryErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    categories.forEach((cat) => {
      if (!cat.label?.trim()) {
        errors[cat.id] = "Label is required";
      }
      if (!cat.color || !cat.color.startsWith("#")) {
        errors[cat.id] = "Color must be a hex value";
      }
      if (!cat.icon) {
        errors[cat.id] = "Icon is required";
      }
    });
    if (categories.length !== 6) {
      errors["_count"] = "Exactly 6 categories are required";
    }
    return errors;
  }, [categories]);

  const handleSave = async () => {
    if (Object.keys(categoryErrors).length > 0) {
      toast.error("Fix category validation issues before saving");
      return;
    }

    const nextCategories = categories.map((category) => ({
      ...category,
      label: category.label.trim(),
    }));

    const renamePairs = new Map<string, string>();
    const conflictingOldLabels = new Set<string>();

    nextCategories.forEach((category) => {
      const previous = initialCategories.find(
        (item) => item.id === category.id,
      );

      if (!previous) return;

      const nextLabel = category.label;

      const variants = new Set<string>();

      const addVariant = (value?: string | null) => {
        if (!value) return;
        variants.add(value);
        const trimmed = value.trim();
        if (trimmed) variants.add(trimmed);
      };

      addVariant(previous.label);

      Array.from(variants)
        .filter((oldLabel) => oldLabel && oldLabel !== nextLabel)
        .forEach((oldLabel) => {
          const existing = renamePairs.get(oldLabel);

          if (!existing) {
            renamePairs.set(oldLabel, nextLabel);
            return;
          }
          if (existing !== nextLabel) {
            conflictingOldLabels.add(oldLabel);
            renamePairs.delete(oldLabel);
          }
        });
    });

    try {
      setSaving(true);
      await updateSettings({
        theme,
        categories: nextCategories,
      });

      if (conflictingOldLabels.size > 0) {
        console.warn(
          "Conflicting category rename mappings skipped:",
          Array.from(conflictingOldLabels),
        );
        toast.warning(
          "Some categories could not be renamed because multiple new labels were detected. They were left unchanged.",
        );
      }

      if (renamePairs.size > 0) {
        const renameOperations: Promise<void>[] = [];

        renamePairs.forEach((newLabel, oldLabel) => {
          if (oldLabel === newLabel) return;
          renameOperations.push(tasksClient.renameCategory(oldLabel, newLabel));
          renameOperations.push(
            calendarClient.renameCategory(oldLabel, newLabel),
          );
        });

        if (renameOperations.length > 0) {
          await Promise.all(renameOperations);
          await Promise.all([refreshTasks(), refreshEvents()]);
        }
      }

      setInitialCategories(nextCategories.map((category) => ({ ...category })));
      setCategories(nextCategories);
      setSystemTheme(theme);
      toast.success("Settings saved");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetCategories = () => {
    setCategories(DEFAULT_CATEGORIES.map((c) => ({ ...c })));
    toast.info("Categories reset to defaults");
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <Card className="mx-auto w-full">
          <CardContent className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <Card className="mx-auto w-full">
          <CardContent className="space-y-6">
            {/* Theme Section */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-base font-medium">Theme</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Select your preferred interface appearance.
                </p>
              </div>
              <div className="w-[180px] shrink-0">
                <Select
                  value={theme}
                  onValueChange={(v) => {
                    setTheme(v as SettingsTheme);
                    setSystemTheme(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Categories Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base font-medium">
                    Categories
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Customize category labels, colors, and icons.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetCategories}
                  disabled={saving}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset defaults
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, idx) => (
                  <CategoryGridItem
                    key={category.id ?? idx}
                    category={category}
                    onChange={(updated) => {
                      setCategories((prev) =>
                        prev.map((item) =>
                          item.id === category.id
                            ? { ...item, ...updated }
                            : item,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
              {categoryErrors["_count"] && (
                <p className="text-sm text-destructive">
                  {categoryErrors["_count"]}
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
