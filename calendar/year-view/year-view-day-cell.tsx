import { isToday } from "date-fns";

import { useEvents } from "@/contexts/events-context";
import { cn } from "@/lib/utils";
import { useCategoryConfig } from "@/hooks/use-category-config";

import { Event } from "@/calendar/interfaces";

interface IProps {
  day: number;
  date: Date;
  events: Event[];
}

export function YearViewDayCell({ day, date, events }: IProps) {
  const { setSelectedDate } = useEvents();
  const { getCategoryColor } = useCategoryConfig();

  const maxIndicators = 3;
  const eventCount = events.length;

  const handleClick = () => {
    setSelectedDate(date);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex h-11 flex-1 flex-col items-center justify-start gap-0.5 rounded-md pt-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs font-medium",
          isToday(date) && "bg-primary font-semibold text-primary-foreground"
        )}
      >
        {day}
      </div>

      {eventCount > 0 && (
        <div className="mt-0.5 flex gap-0.5">
          {eventCount <= maxIndicators ? (
            events.map((event) => (
              <div
                key={event.id}
                className="size-1.5 rounded-full"
                style={{ backgroundColor: getCategoryColor(event.category) }}
              />
            ))
          ) : (
            <>
              <div
                className="size-1.5 rounded-full"
                style={{
                  backgroundColor: getCategoryColor(events[0].category),
                }}
              />
              <span className="text-[7px] text-muted-foreground">
                +{eventCount - 1}
              </span>
            </>
          )}
        </div>
      )}
    </button>
  );
}
