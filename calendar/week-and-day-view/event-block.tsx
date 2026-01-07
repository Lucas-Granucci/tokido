import { format, differenceInMinutes, parseISO } from "date-fns";

import { EventDetailsDialog } from "../dialogs/event-details-dialog";
import { cn } from "@/lib/utils";
import { getCategoryColor, getEventBadgeClasses } from "@/utils/config-utils";

import type { HTMLAttributes } from "react";
import { Event } from "../interfaces";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export function EventBlock({ event, className, style, ...rest }: IProps) {
  const start = parseISO(event.start_date);
  const end = parseISO(event.end_date);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightInPixels = (durationInMinutes / 60) * 96 - 8;

  const calendarWeekEventCardClasses = cn(
    "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    getEventBadgeClasses(event.category),
    durationInMinutes < 35 && "py-0 justify-center",
    className
  );

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
        className={calendarWeekEventCardClasses}
        style={{ ...style, height: `${heightInPixels}px` }}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <div className="flex items-center gap-1.5 truncate">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            className="event-dot shrink-0"
            style={{ fill: getCategoryColor(event.category) }}
          >
            <circle cx="4" cy="4" r="4" />
          </svg>

          <p className="truncate font-semibold">{event.name}</p>
        </div>

        {durationInMinutes > 25 && (
          <p>
            {format(start, "h:mm a")} - {format(end, "h:mm a")}
          </p>
        )}
      </div>
    </EventDetailsDialog>
  );
}
