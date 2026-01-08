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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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

const THEME_OPTIONS: SettingsTheme[] = ["light", "dark", "system"];

const ICON_BADGE_ELEMENTS = {
  GraduationCap: <GraduationCap className="h-3 w-3" />,
  Microscope: <Microscope className="h-3 w-3" />,
  Code2: <Code2 className="h-3 w-3" />,
  User: <User className="h-3 w-3" />,
  Briefcase: <Briefcase className="h-3 w-3" />,
  Palette: <Palette className="h-3 w-3" />,
  Sparkles: <Sparkles className="h-3 w-3" />,
  MoreHorizontal: <MoreHorizontal className="h-3 w-3" />,
} as const;

type IconKey = keyof typeof ICON_BADGE_ELEMENTS;

function CategoryRow({
  category,
  onChange,
}: {
  category: SettingsCategory;
  onChange: (updated: SettingsCategory) => void;
}) {
  return (
    <div className="grid gap-3 rounded-lg border p-3 sm:p-4 md:grid-cols-[1fr_140px_180px] items-center">
      <div className="flex flex-col gap-2">
        <FieldLabel className="text-sm font-medium">Label</FieldLabel>
        <Input
          value={category.label}
          onChange={(e) => onChange({ ...category, label: e.target.value })}
          placeholder="Category label"
        />
        <FieldDescription className="text-xs">
          Shown in tasks and events.
        </FieldDescription>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel className="text-sm font-medium">Color</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            className="h-10 w-16 p-1"
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
          />
          <Input
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
            placeholder="#2563EB"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel className="text-sm font-medium">Icon</FieldLabel>
        <Select
          value={category.icon}
          onValueChange={(value) => onChange({ ...category, icon: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border"
            style={{ color: category.color }}
          >
            {ICON_BADGE_ELEMENTS[category.icon as IconKey] ??
              ICON_BADGE_ELEMENTS.MoreHorizontal}
          </span>
        </div>
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
        <ScrollArea className="flex-1 min-h-0 pr-3 md:pr-0" type="always">
          <div className="flex min-h-0 flex-col gap-4 pb-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-[520px] w-full rounded-xl" />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ScrollArea className="flex-1 min-h-0 pr-3 md:pr-0" type="always">
        <div className="flex min-h-0 flex-col gap-6 pb-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your appearance and category preferences.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred appearance mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel className="text-sm font-medium">
                    Theme selection
                  </FieldLabel>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {THEME_OPTIONS.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={theme === option ? "default" : "outline"}
                        className="w-full justify-center"
                        onClick={() => {
                          setTheme(option);
                          setSystemTheme(option);
                        }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Button>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Customize labels, colors, and icons. Exactly 6 categories are
                  stored.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetCategories}
                disabled={saving}
              >
                Reset to defaults
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, idx) => (
                <CategoryRow
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

              {categoryErrors["_count"] && (
                <p className="text-sm text-destructive">
                  {categoryErrors["_count"]}
                </p>
              )}

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetCategories}
                  disabled={saving}
                >
                  Reset
                </Button>
                <Button type="button" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
