import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { EventFormData } from "./interfaces";
import { calendarClient } from "./calendarClient";
import { taskViewConfigs } from "@/tasks/utils/view-config";

interface IProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ onSubmitSuccess, onCancel }: IProps) {
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    category: "",
    description: "",
    start_date: null,
    end_date: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.start_date ||
      !formData.end_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate that end date is after start date
    if (formData.end_date <= formData.start_date) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      setLoading(true);

      await calendarClient.createEvent({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        start_date: null,
        end_date: null,
      });

      onSubmitSuccess();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {/* Event Name Field */}
        <Field>
          <FieldLabel htmlFor="event-name">Event Name</FieldLabel>
          <Input
            id="event-name"
            placeholder="Team meeting"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </Field>

        {/* Description field */}
        <Field>
          <FieldLabel htmlFor="event-description">Description</FieldLabel>
          <Input
            id="event-description"
            placeholder="Event description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </Field>

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

        {/* Grid Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date Field */}
          <Field>
            <FieldLabel htmlFor="start-date" className="px-1">
              Start Date
            </FieldLabel>
            <Popover
              open={startDatePickerOpen}
              onOpenChange={setStartDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="due-date"
                  className="w-48 justify-between font-normal"
                >
                  {formData.start_date
                    ? formData.start_date.toLocaleDateString()
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
                  selected={formData.start_date || undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData((prev) => ({
                      ...prev,
                      start_date: date || null,
                    }));
                    setStartDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* End Date Field */}
          <Field>
            <FieldLabel htmlFor="end-date" className="px-1">
              End Date
            </FieldLabel>
            <Popover
              open={endDatePickerOpen}
              onOpenChange={setEndDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="due-date"
                  className="w-48 justify-between font-normal"
                >
                  {formData.end_date
                    ? formData.end_date.toLocaleDateString()
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
                  selected={formData.end_date || undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setFormData((prev) => ({
                      ...prev,
                      end_date: date || null,
                    }));
                    setEndDatePickerOpen(false);
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
