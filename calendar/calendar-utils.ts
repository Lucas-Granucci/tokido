import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
  endOfYear,
  startOfYear,
  subYears,
  addYears,
  eachDayOfInterval,
  differenceInDays,
  parseISO,
  startOfDay,
  isSameDay,
} from "date-fns";
import type { CalendarViewType } from "@/types/views";
import type { CalendarCell } from "./interfaces";
import type { Event } from "./interfaces";

export const APP_TIMEZONE = "America/Chicago";
export function getTodayInTimeZone(timezone = APP_TIMEZONE) {
  const now = new Date();
  const localDateString = now.toLocaleDateString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [month, day, year] = localDateString.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function rangeText(view: CalendarViewType, date: Date) {
  const formatString = "MMM d, yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, formatString);
    default:
      return "Error while formatting ";
  }

  return `${format(start, formatString)} - ${format(end, formatString)}`;
}

export function navigateDate(
  date: Date,
  view: CalendarViewType,
  direction: "previous" | "next"
): Date {
  const operations = {
    agenda: direction === "next" ? addMonths : subMonths,
    year: direction === "next" ? addYears : subYears,
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
  };

  return operations[view](date, 1);
}
// ================================ Month View Helpers ================================
export function getCalendarCells(selectedDate: Date): CalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(
      currentYear,
      currentMonth - 1,
      daysInPrevMonth - firstDayOfMonth + i + 1
    ),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from(
    { length: 7 - ((totalDays % 7) % 7) },
    (_, i) => ({
      day: i + 1,
      currentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i + 1),
    })
  );

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions(
  multiDayEvents: Event[],
  singleDayEvents: Event[],
  selectedDate: Date
) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(
        parseISO(a.end_date),
        parseISO(a.start_date)
      );
      const bDuration = differenceInDays(
        parseISO(b.end_date),
        parseISO(b.start_date)
      );
      return (
        bDuration - aDuration ||
        parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
      );
    }),
    ...singleDayEvents.sort(
      (a, b) =>
        parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    ),
  ];

  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.start_date);
    const eventEnd = parseISO(event.end_date);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        eventDays.every((day) => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(
  date: Date,
  events: Event[],
  eventPositions: Record<string, number>
) {
  const eventsForDate = events.filter((event) => {
    const eventStart = parseISO(event.start_date);
    const eventEnd = parseISO(event.end_date);
    return (
      (date >= eventStart && date <= eventEnd) ||
      isSameDay(date, eventStart) ||
      isSameDay(date, eventEnd)
    );
  });

  return eventsForDate
    .map((event) => ({
      ...event,
      position: eventPositions[event.id] ?? -1,
      isMultiDay: event.start_date !== event.end_date,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });
}
