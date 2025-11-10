import { toast } from "sonner";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
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

import { calendarClient } from "./calendarClient";
import type { EventFormData } from "./interfaces";
import presentationConfigs from "@/utils/presentation-configs";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface IProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ onSubmitSuccess, onCancel }: IProps) {
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    category: "",
    description: "",
    start_date: null,
    end_date: null,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to combine date and time
  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Helper function to set start of day
  const setStartOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Helper function to set end of day
  const setEndOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date <= formData.start_date
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let finalStartDate = formData.start_date;
      let finalEndDate = formData.end_date;

      if (finalStartDate && finalEndDate) {
        if (allDay) {
          finalStartDate = setStartOfDay(finalStartDate);
          finalEndDate = setEndOfDay(finalEndDate);
        } else {
          console.log("Start time:", startTime, "End time:", endTime); // Debug log
          finalStartDate = combineDateAndTime(finalStartDate, startTime);
          finalEndDate = combineDateAndTime(finalEndDate, endTime);
        }
      }

      await calendarClient.createEvent({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        start_date: finalStartDate,
        end_date: finalEndDate,
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        start_date: null,
        end_date: null,
      });
      setStartTime("09:00");
      setEndTime("17:00");
      setAllDay(false);
      setErrors({});

      onSubmitSuccess();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        {/* Event Name Field */}
        <Field>
          <FieldLabel htmlFor="event-name" className="text-sm font-medium">
            Event Name
          </FieldLabel>
          <Input
            id="event-name"
            placeholder="Team meeting, Birthday party..."
            className={cn(errors.name && "border-destructive")}
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        {/* Description field */}
        <Field>
          <FieldLabel
            htmlFor="event-description"
            className="text-sm font-medium"
          >
            Description
          </FieldLabel>
          <Textarea
            id="event-description"
            placeholder="Describe your event (optional)"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
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

          {/* All Day Toggle */}
          <Field>
            <FieldLabel className="text-sm font-medium opacity-0 pointer-events-none">
              &nbsp; {/* Invisible label for alignment */}
            </FieldLabel>
            <div className="flex items-center gap-3 h-10 px-3 border border-transparent">
              <Switch
                id="all-day"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
              <Label
                htmlFor="all-day"
                className="text-sm font-medium cursor-pointer"
              >
                All Day Event
              </Label>
            </div>
          </Field>
        </div>

        {/* Start Date & Time */}
        <Field>
          <FieldLabel className="text-sm font-medium">
            Start Date & Time
          </FieldLabel>
          <div className="flex gap-3">
            {/* Start Date Picker */}
            <div className="flex-1">
              <Popover
                open={startDatePickerOpen}
                onOpenChange={setStartDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground",
                      errors.start_date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date
                      ? formData.start_date.toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_date || undefined}
                    onSelect={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        start_date: date || null,
                      }));
                      setStartDatePickerOpen(false);
                      if (errors.start_date)
                        setErrors((prev) => ({ ...prev, start_date: "" }));
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Time Picker */}
            {!allDay && (
              <div className="flex-1">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            )}
          </div>
          {errors.start_date && <FieldError>{errors.start_date}</FieldError>}
        </Field>

        {/* End Date & Time */}
        <Field>
          <FieldLabel className="text-sm font-medium">
            End Date & Time
          </FieldLabel>
          <div className="flex gap-3">
            {/* End Date Picker */}
            <div className="flex-1">
              <Popover
                open={endDatePickerOpen}
                onOpenChange={setEndDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground",
                      errors.end_date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date
                      ? formData.end_date.toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.end_date || undefined}
                    onSelect={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        end_date: date || null,
                      }));
                      setEndDatePickerOpen(false);
                      if (errors.end_date)
                        setErrors((prev) => ({ ...prev, end_date: "" }));
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Time Picker */}
            {!allDay && (
              <div className="flex-1">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            )}
          </div>
          {errors.end_date && <FieldError>{errors.end_date}</FieldError>}
        </Field>

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
              "Create Event"
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
