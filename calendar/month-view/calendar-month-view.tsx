import { useEvents } from "@/contexts/events-context";
import { Event } from "../interfaces";
import { useMemo } from "react";
import {
  calculateMonthEventPositions,
  getCalendarCells,
} from "../calendar-utils";
import { DayCell } from "./day-cell";

interface IProps {
  singleDayEvents: Event[];
  multiDayEvents: Event[];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useEvents();
  const allEvents = [...singleDayEvents, ...multiDayEvents];
  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);
  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate
      ),
    [multiDayEvents, singleDayEvents, selectedDate]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 divide-x border-b">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 overflow-hidden flex-1"
        style={{
          gridTemplateRows: `repeat(${cells.length / 7}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell, index) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
            isLastColumn={(index + 1) % 7 === 0}
            isLastRow={index >= cells.length - 7}
          />
        ))}
      </div>
    </div>
  );
}
