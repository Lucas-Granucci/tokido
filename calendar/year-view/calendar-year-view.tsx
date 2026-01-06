import { useMemo } from "react";
import { addMonths, startOfYear } from "date-fns";
import { Event } from "../interfaces";

import { YearViewMonth } from "./year-view-month";
import { useEvents } from "@/contexts/events-context";

interface IProps {
  allEvents: Event[];
}

export function CalendarYearView({ allEvents }: IProps) {
  const { selectedDate } = useEvents();

  const months = useMemo(() => {
    const yearStart = startOfYear(selectedDate);
    return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
  }, [selectedDate]);

  return (
    <div className="h-full p-2 sm:p-3 md:p-4">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month) => (
          <YearViewMonth
            key={month.toString()}
            month={month}
            events={allEvents}
          />
        ))}
      </div>
    </div>
  );
}
