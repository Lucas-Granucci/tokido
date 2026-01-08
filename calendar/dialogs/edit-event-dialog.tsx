"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { calendarClient } from "../calendarClient";
import type { Event, EventFormData } from "../interfaces";
import { useCategoryConfig } from "@/hooks/use-category-config";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEvents } from "@/contexts/events-context";

interface IProps {
  event: Event;
  children: React.ReactNode;
}

export function EditEventDialog({ event, children }: IProps) {
  const [open, setOpen] = useState(false);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [multiDay, setMultiDay] = useState(false);
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
  const { categories } = useCategoryConfig();
  const { refreshEvents } = useEvents();

  // Initialize form with event data
  useEffect(() => {
    if (open && event) {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);

      // Check if all-day event (starts at 00:00, ends at 23:59)
      const isAllDay =
        start.getHours() === 0 &&
        start.getMinutes() === 0 &&
        end.getHours() === 23 &&
        end.getMinutes() === 59;

      // Check if multi-day event
      const startDay = new Date(start);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(end);
      endDay.setHours(0, 0, 0, 0);
      const isMultiDay = endDay > startDay;

      setAllDay(isAllDay);
      setMultiDay(isMultiDay);
      setFormData({
        name: event.name,
        category: event.category,
        description: event.description || "",
        start_date: start,
        end_date: end,
      });

      if (!isAllDay) {
        setStartTime(
          `${start.getHours().toString().padStart(2, "0")}:${start
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        );
        setEndTime(
          `${end.getHours().toString().padStart(2, "0")}:${end
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        );
      }
    }
  }, [open, event]);

  // Helper function to combine date and time
  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const timeToMinutes = (time: string): number => {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    return hours * 60 + minutes;
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
    if (multiDay) {
      if (!formData.end_date) {
        newErrors.end_date = "End date is required for multi-day events";
      }
      if (
        formData.start_date &&
        formData.end_date &&
        formData.end_date <= formData.start_date
      ) {
        newErrors.end_date = "End date must be after start date";
      }
    } else if (!allDay && startTime && endTime) {
      if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
        newErrors.end_time = "End time must be after start time";
      }
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
      let finalEndDate = multiDay ? formData.end_date : formData.start_date;

      if (finalStartDate && finalEndDate) {
        if (allDay) {
          finalStartDate = setStartOfDay(finalStartDate);
          finalEndDate = setEndOfDay(finalEndDate);
        } else {
          finalStartDate = combineDateAndTime(finalStartDate, startTime);
          finalEndDate = combineDateAndTime(finalEndDate, endTime);
        }
      }

      await calendarClient.editEvent(event.id, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        start_date: finalStartDate,
        end_date: finalEndDate,
      });

      toast.success("Event updated successfully");
      await refreshEvents();
      setOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

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
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Field>

            {/* Category and Options Row */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
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
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          {item.Icon && <item.Icon className="h-4 w-4" />}
                          {item.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <FieldError>{errors.category}</FieldError>}
              </Field>

              <div className="flex flex-wrap gap-4 pt-1 sm:pt-8">
                <div className="flex items-center gap-2">
                  <Switch
                    id="all-day"
                    checked={allDay}
                    onCheckedChange={(checked) => {
                      setAllDay(checked);
                      if (checked) {
                        setErrors((prev) => {
                          const { end_time, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                  />
                  <Label
                    htmlFor="all-day"
                    className="text-sm cursor-pointer select-none"
                  >
                    All Day
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="multi-day"
                    checked={multiDay}
                    onCheckedChange={(checked) => {
                      setMultiDay(checked);
                      if (!checked) {
                        setErrors((prev) => {
                          const { end_date, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                  />
                  <Label
                    htmlFor="multi-day"
                    className="text-sm cursor-pointer select-none"
                  >
                    Multi-Day
                  </Label>
                </div>
              </div>
            </div>

            {/* Date & Time Fields */}
            {!multiDay && !allDay ? (
              // Single-day timed event
              <Field>
                <FieldLabel className="text-sm font-medium">
                  Date & Time
                </FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2">
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
                            errors.start_date && "border-destructive",
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
                              setErrors((prev) => ({
                                ...prev,
                                start_date: "",
                              }));
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (errors.end_time)
                          setErrors((prev) => ({ ...prev, end_time: "" }));
                      }}
                      className="bg-background"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (errors.end_time)
                          setErrors((prev) => ({ ...prev, end_time: "" }));
                      }}
                      className="bg-background"
                    />
                  </div>
                </div>
                {errors.start_date && (
                  <FieldError>{errors.start_date}</FieldError>
                )}
                {errors.end_time && <FieldError>{errors.end_time}</FieldError>}
              </Field>
            ) : (
              <>
                {/* Start Date & Time */}
                <Field>
                  <FieldLabel className="text-sm font-medium">
                    Start Date{!allDay && " & Time"}
                  </FieldLabel>
                  <div className="flex flex-col sm:flex-row gap-3">
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
                              errors.start_date && "border-destructive",
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
                                setErrors((prev) => ({
                                  ...prev,
                                  start_date: "",
                                }));
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {!allDay && (
                      <div className="flex-1">
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            if (errors.end_time)
                              setErrors((prev) => ({ ...prev, end_time: "" }));
                          }}
                          className="bg-background"
                        />
                      </div>
                    )}
                  </div>
                  {errors.start_date && (
                    <FieldError>{errors.start_date}</FieldError>
                  )}
                </Field>

                {/* End Date & Time (multi-day only) */}
                {multiDay && (
                  <Field>
                    <FieldLabel className="text-sm font-medium">
                      End Date{!allDay && " & Time"}
                    </FieldLabel>
                    <div className="flex flex-col sm:flex-row gap-3">
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
                                errors.end_date && "border-destructive",
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
                                  setErrors((prev) => ({
                                    ...prev,
                                    end_date: "",
                                  }));
                              }}
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {!allDay && (
                        <div className="flex-1">
                          <Input
                            type="time"
                            value={endTime}
                            onChange={(e) => {
                              setEndTime(e.target.value);
                              if (errors.end_time)
                                setErrors((prev) => ({
                                  ...prev,
                                  end_time: "",
                                }));
                            }}
                            className="bg-background"
                          />
                        </div>
                      )}
                    </div>
                    {errors.end_date && (
                      <FieldError>{errors.end_date}</FieldError>
                    )}
                  </Field>
                )}
              </>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer sm:w-auto"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
