import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { taskViewConfigs } from "./utils/view-config";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { tasksClient } from "@/tasks/tasksClient";
import { TaskFormData } from "@/tasks/interfaces";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.priority) {
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

      onSubmitSuccess();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task: " + error);
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
            placeholder="Read a book"
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
                {Object.values(taskViewConfigs.category).map((item) => (
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
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger id="priority-select">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(taskViewConfigs.priority).map((item) => (
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
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                />
                <span className="text-xs text-muted-foreground">hours</span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMinutes(Math.min(value, 59));
                  }}
                />
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
            onClick={handleSubmit}
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
