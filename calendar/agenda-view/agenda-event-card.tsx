"use client";

import { format, parseISO } from "date-fns";
import { Clock, Text } from "lucide-react";

import { EventDetailsDialog } from "../dialogs/event-details-dialog";
import { Event } from "../interfaces";
import { getCategoryColor, getEventBadgeClasses } from "@/utils/config-utils";
import { cn } from "@/lib/utils";

interface IProps {
  event: Event;
  eventCurrentDay?: number;
  eventTotalDays?: number;
}

export function AgendaEventCard({
  event,
  eventCurrentDay,
  eventTotalDays,
}: IProps) {
  const startDate = parseISO(event.start_date);
  const endDate = parseISO(event.end_date);

  const isAllDay =
    startDate.getHours() === 0 &&
    startDate.getMinutes() === 0 &&
    endDate.getHours() === 23 &&
    endDate.getMinutes() === 59;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <EventDetailsDialog event={event}>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "flex select-none items-center justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          getEventBadgeClasses(event.category)
        )}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1.5">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              className="event-dot shrink-0"
              style={{ fill: getCategoryColor(event.category) }}
            >
              <circle cx="4" cy="4" r="4" />
            </svg>

            <p className="font-medium">
              {eventCurrentDay && eventTotalDays && (
                <span className="mr-1 text-xs">
                  Day {eventCurrentDay} of {eventTotalDays} •{" "}
                </span>
              )}
              {event.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="size-3 shrink-0" />
            <p className="text-xs text-foreground">
              {isAllDay
                ? "All Day"
                : `${format(startDate, "h:mm a")} - ${format(
                    endDate,
                    "h:mm a"
                  )}`}
            </p>
          </div>

          {event.description && (
            <div className="flex items-center gap-1">
              <Text className="size-3 shrink-0" />
              <p className="text-xs text-foreground line-clamp-1">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </EventDetailsDialog>
  );
}
