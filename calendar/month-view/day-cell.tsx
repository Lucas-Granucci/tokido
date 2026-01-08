import { useEvents } from "@/contexts/events-context";
import { CalendarCell, Event } from "../interfaces";
import { useMemo } from "react";
import { getMonthCellEvents } from "../calendar-utils";
import { cn } from "@/lib/utils";
import { isToday, startOfDay } from "date-fns";
import { MonthEventBadge } from "./month-event-badge";
import { useCategoryConfig } from "@/hooks/use-category-config";

interface IProps {
  cell: CalendarCell;
  events: Event[];
  eventPositions: Record<string, number>;
  isLastColumn?: boolean;
  isLastRow?: boolean;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({
  cell,
  events,
  eventPositions,
  isLastColumn,
  isLastRow,
}: IProps) {
  const { setSelectedDate } = useEvents();
  const { getCategoryColor } = useCategoryConfig();
  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions]
  );
  const isSunday = date.getDay() === 0;

  const handleClick = () => {
    setSelectedDate(date);
    // handle going to day view
  };

  return (
    <div className="h-full">
      <div
        className={cn(
          "flex h-full flex-col gap-0.5 py-1 lg:pb-1 lg:pt-0.5",
          !isLastColumn && "border-r",
          !isLastRow && "border-b"
        )}
      >
        <button
          onClick={handleClick}
          className={cn(
            "flex size-6 ml-0.5 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:px-2 cursor-pointer",
            !currentMonth && "opacity-20",
            isToday(date) &&
              "bg-primary font-bold text-primary-foreground hover:bg-primary"
          )}
        >
          {day}
        </button>

        <div
          className={cn(
            "flex h-6 gap-1 px-2 items-center lg:items-stretch lg:flex-1 lg:flex-col lg:px-0",
            !currentMonth && "opacity-50"
          )}
        >
          {[0, 1, 2].map((position) => {
            const event = cellEvents.find((e) => e.position === position);
            const eventKey = event
              ? `event-${event.id}-${position}`
              : `empty-${position}`;

            return (
              <div
                key={eventKey}
                className={cn(!event && "hidden h-6.5 lg:block")}
              >
                {event && (
                  <>
                    <div
                      className="size-1.5 rounded-full lg:hidden shrink-0"
                      style={{
                        backgroundColor: getCategoryColor(event.category),
                      }}
                    />
                    <MonthEventBadge
                      className="hidden lg:flex"
                      event={event}
                      cellDate={startOfDay(date)}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {cellEvents.length > MAX_VISIBLE_EVENTS && (
          <p
            className={cn(
              "h-4.5 px-1.5 text-xs font-semibold text-muted-foreground",
              !currentMonth && "opacity-50"
            )}
          >
            <span className="sm:hidden">
              +{cellEvents.length - MAX_VISIBLE_EVENTS}
            </span>
            <span className="hidden sm:inline">
              {cellEvents.length - MAX_VISIBLE_EVENTS} more...
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
