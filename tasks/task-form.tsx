import { toast } from "sonner";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { CalendarIcon, ChevronDownIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { tasksClient } from "@/tasks/tasksClient";
import type { TaskFormData } from "@/tasks/interfaces";
import presentationConfigs from "@/utils/presentation-configs";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSubmitSuccess, onCancel }: TaskFormProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    category: "",
    priority: "",
    duration: 0,
    dueDate: null,
  });
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }
    if (hours === 0 && minutes === 0) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const totalMinutes = hours * 60 + minutes;

      setLoading(true);

      await tasksClient.createTask({
        name: formData.name,
        category: formData.category,
        priority: formData.priority,
        duration: totalMinutes,
        dueDate: formData.dueDate,
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        priority: "",
        duration: 0,
        dueDate: null,
      });
      setHours(0);
      setMinutes(0);
      setErrors({});

      onSubmitSuccess();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        {/* Task Name Field */}
        <Field>
          <FieldLabel htmlFor="task-name" className="text-sm font-medium">
            Task Name
          </FieldLabel>
          <Input
            id="task-name"
            placeholder="Read a book, Complete project report..."
            className={cn(errors.name && "border-destructive")}
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        {/* Grid Fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category Field */}
          <Field>
            <FieldLabel
              htmlFor="category-select"
              className="text-sm font-medium"
            >
              Category
            </FieldLabel>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, category: value }));
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: "" }));
              }}
            >
              <SelectTrigger
                id="category-select"
                className={cn(errors.category && "border-destructive")}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(presentationConfigs.category).map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </Field>

          {/* Priority Field */}
          <Field>
            <FieldLabel
              htmlFor="priority-select"
              className="text-sm font-medium"
            >
              Priority
            </FieldLabel>
            <Select
              value={formData.priority}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, priority: value }));
                if (errors.priority)
                  setErrors((prev) => ({ ...prev, priority: "" }));
              }}
            >
              <SelectTrigger
                id="priority-select"
                className={cn(errors.priority && "border-destructive")}
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(presentationConfigs.priority).map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && <FieldError>{errors.priority}</FieldError>}
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Duration Field */}
          <Field>
            <FieldLabel className="text-sm font-medium">Duration</FieldLabel>
            <div className="flex gap-3">
              {/* Hours Input */}
              <div className="flex-1">
                <div className="space-y-1">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="0"
                    className={cn(
                      "w-full",
                      errors.duration && "border-destructive"
                    )}
                    value={hours}
                    onChange={(e) => {
                      const value = Math.min(23, parseInt(e.target.value) || 0);
                      setHours(value);
                      if (errors.duration)
                        setErrors((prev) => ({ ...prev, duration: "" }));
                    }}
                  />
                  <span className="text-xs text-muted-foreground">hours</span>
                </div>
              </div>

              {/* Minutes Input */}
              <div className="flex-1">
                <div className="space-y-1">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    className={cn(
                      "w-full",
                      errors.duration && "border-destructive"
                    )}
                    value={minutes}
                    onChange={(e) => {
                      const value = Math.min(59, parseInt(e.target.value) || 0);
                      setMinutes(value);
                      if (errors.duration)
                        setErrors((prev) => ({ ...prev, duration: "" }));
                    }}
                  />
                  <span className="text-xs text-muted-foreground">minutes</span>
                </div>
              </div>
            </div>
            {errors.duration && <FieldError>{errors.duration}</FieldError>}
          </Field>

          {/* Due Date Field */}
          <Field>
            <FieldLabel className="text-sm font-medium">Due Date</FieldLabel>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? formData.dueDate.toLocaleDateString()
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate || undefined}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dueDate: date || null }));
                    setDatePickerOpen(false);
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            className="flex-1 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
