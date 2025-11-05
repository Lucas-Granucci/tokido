import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { viewConfigs } from "../tasks/types/view-config";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { tasksClient } from "@/lib/tasks/client";
import { PriorityType, TaskFormData } from "@/lib/tasks/types";

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.category || !formData.priority) {
        alert("Please fill in all required fields");
        return;
      }

      await tasksClient.createTask({
        name: formData.name,
        category: formData.category,
        priority: formData.priority,
        duration: formData.duration,
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
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {/* Task Name Field */}
        <Field>
          <FieldLabel htmlFor="task-name">Task Name</FieldLabel>
          <Input
            id="task-name"
            placeholder="Evil Rabbit"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </Field>

        {/* Grid Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category Field */}
          <Field>
            <FieldLabel htmlFor="category-select">Category</FieldLabel>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(viewConfigs.category).map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Priority Field */}
          <Field>
            <FieldLabel htmlFor="priority-select">Priority</FieldLabel>
            <Select
              value={formData.priority}
              onValueChange={(value: PriorityType) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger id="priority-select">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(viewConfigs.priority).map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Duration Field */}
          <Field>
            <FieldLabel htmlFor="duration">Duration</FieldLabel>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <span className="text-xs text-muted-foreground">hours</span>
              </div>
              <div className="flex-1">
                <Input type="number" min="0" max="59" placeholder="30" />
                <span className="text-xs text-muted-foreground">minutes</span>
              </div>
            </div>
          </Field>

          {/* Due Date Field */}
          <Field>
            <FieldLabel htmlFor="due-date" className="px-1">
              Due Date
            </FieldLabel>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="due-date"
                  className="w-48 justify-between font-normal"
                >
                  {formData.dueDate
                    ? formData.dueDate.toLocaleDateString()
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={formData.dueDate || undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dueDate: date || null }));
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Buttons */}
        <Field orientation="horizontal">
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={onSubmitSuccess}
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit"}
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
        </Field>
      </FieldGroup>
    </form>
  );
}
