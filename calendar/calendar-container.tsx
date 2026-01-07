import { useMemo } from "react";
import type { CalendarViewOption, Event } from "./interfaces";
import { isSameDay, parseISO } from "date-fns";
import { useEvents } from "@/contexts/events-context";
import { CalendarMonthView } from "./month-view/calendar-month-view";
import { CalendarYearView } from "./year-view/calendar-year-view";
import { CalendarAgendaView } from "./agenda-view/calendar-agenda-view";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDayView } from "./week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "./week-and-day-view/calendar-week-view";

interface CalendarViewProps {
  events: Event[];
  viewOption: CalendarViewOption;
}

export function CalendarContainer({ events, viewOption }: CalendarViewProps) {
  const { selectedDate } = useEvents();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = parseISO(event.end_date);

      const selectedDateYear = selectedDate.getFullYear();
      const selectedDateMonth = selectedDate.getMonth();
      const selectedDateDay = selectedDate.getDate();

      if (viewOption.value === "year") {
        const yearStart = new Date(selectedDateYear, 0, 1);
        const yearEnd = new Date(selectedDateYear, 11, 31, 23, 59, 59, 999);
        return eventStartDate <= yearEnd && eventEndDate >= yearStart;
      }

      if (viewOption.value === "month" || viewOption.value === "agenda") {
        const monthStart = new Date(selectedDateYear, selectedDateMonth, 1);
        const monthEnd = new Date(
          selectedDateYear,
          selectedDateMonth + 1,
          0,
          23,
          59,
          59,
          999
        );
        return eventStartDate <= monthEnd && eventEndDate >= monthStart;
      }

      if (viewOption.value === "week") {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(selectedDate);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return eventStartDate <= weekEnd && eventEndDate >= weekStart;
      }

      if (viewOption.value === "day") {
        const dayStart = new Date(
          selectedDateYear,
          selectedDateMonth,
          selectedDateDay,
          0,
          0,
          0
        );
        const dayEnd = new Date(
          selectedDateYear,
          selectedDateMonth,
          selectedDateDay,
          23,
          59,
          59
        );
        return eventStartDate <= dayEnd && eventEndDate >= dayStart;
      }
    });
  }, [selectedDate, events, viewOption]);

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);
    return !isSameDay(startDate, endDate);
  });

  const eventStartDates = useMemo(() => {
    return filteredEvents.map((event) => ({
      ...event,
      endDate: event.start_date,
    }));
  }, [filteredEvents]);

  return (
    <ScrollArea className="h-full" type="always">
      <div className="h-full">
        {viewOption.value === "day" && (
          <CalendarDayView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {viewOption.value === "week" && (
          <CalendarWeekView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {viewOption.value === "month" && (
          <CalendarMonthView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {viewOption.value === "year" && (
          <CalendarYearView allEvents={eventStartDates} />
        )}
        {viewOption.value === "agenda" && (
          <CalendarAgendaView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
      </div>
    </ScrollArea>
  );
}
