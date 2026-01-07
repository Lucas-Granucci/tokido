import { Clock } from "lucide-react";
import {
  parseISO,
  areIntervalsOverlapping,
  format,
  isSameDay,
  addDays,
  subDays,
} from "date-fns";
import { useMemo, useRef } from "react";

import { useEvents } from "@/contexts/events-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { MonthEventBadge } from "../month-view/month-event-badge";

import { EventBlock } from "./event-block";
import { CalendarTimeline } from "./calendar-time-line";
import { DayViewMultiDayEventsRow } from "./day-view-multi-day-events-row";

import {
  groupEvents,
  getEventBlockStyle,
  getCurrentEvents,
} from "../calendar-utils";

import { Event } from "../interfaces";

const isAllDayEvent = (event: Event) => {
  const start = parseISO(event.start_date);
  const end = parseISO(event.end_date);

  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    start.getSeconds() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59
  );
};

interface IProps {
  singleDayEvents: Event[];
  multiDayEvents: Event[];
}

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate } = useEvents();
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  const eventsForDay = useMemo(
    () => [...singleDayEvents, ...multiDayEvents],
    [singleDayEvents, multiDayEvents]
  );

  const allDayEvents = useMemo(
    () => eventsForDay.filter((event) => isAllDayEvent(event)),
    [eventsForDay]
  );

  const timedEvents = useMemo(
    () => eventsForDay.filter((event) => !isAllDayEvent(event)),
    [eventsForDay]
  );

  const groupedEvents = useMemo(
    () => groupEvents([...timedEvents]),
    [timedEvents]
  );

  const earliestEventHour = useMemo(() => {
    if (timedEvents.length === 0) return 6;

    const earliestStartHour = Math.min(
      ...timedEvents.map((event) => parseISO(event.start_date).getHours())
    );

    return Math.max(0, Math.min(earliestStartHour, 6));
  }, [timedEvents]);

  const visibleEndHour = useMemo(() => {
    if (timedEvents.length === 0) return Math.min(24, earliestEventHour + 12);

    const latestEndHour = Math.max(
      ...timedEvents.map((event) => {
        const end = parseISO(event.end_date);
        return end.getMinutes() > 0 ? end.getHours() + 1 : end.getHours();
      })
    );

    return Math.min(24, Math.max(latestEndHour, earliestEventHour + 6));
  }, [timedEvents, earliestEventHour]);

  const hours = useMemo(() => {
    const totalHours = Math.max(1, visibleEndHour - earliestEventHour);
    return Array.from(
      { length: totalHours },
      (_, index) => earliestEventHour + index
    );
  }, [earliestEventHour, visibleEndHour]);

  const sortedEventsForSidebar = useMemo(
    () =>
      [...eventsForDay].sort(
        (a, b) =>
          parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
      ),
    [eventsForDay]
  );

  const currentEvents = useMemo(() => {
    if (!isSameDay(selectedDate, new Date())) return [];
    return getCurrentEvents(eventsForDay) ?? [];
  }, [eventsForDay, selectedDate]);

  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToPrevDay = () => setSelectedDate(subDays(selectedDate, 1));

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const deltaX = touchEndX - touchStartX.current;
    const duration = Date.now() - touchStartTime.current;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    if (duration < 600 && Math.abs(deltaX) > 50) {
      if (deltaX < 0) goToNextDay();
      else goToPrevDay();
    }
  };

  return (
    <div
      className="flex h-full flex-1 min-h-0 flex-col gap-6 lg:flex-row"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-1 flex-col gap-3 lg:min-h-0">
        <ScrollArea className="flex-1 lg:min-h-0" type="always">
          <div className="flex min-h-full flex-col">
            <div>
              <DayViewMultiDayEventsRow
                selectedDate={selectedDate}
                multiDayEvents={multiDayEvents}
              />

              {allDayEvents.length > 0 && (
                <div className="flex border-b">
                  <div className="w-16 sm:w-18"></div>
                  <div className="flex flex-1 flex-col gap-1 border-l py-1">
                    {allDayEvents.map((event) => (
                      <MonthEventBadge
                        key={event.id}
                        event={event}
                        cellDate={selectedDate}
                        position="none"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="relative z-20 flex border-b">
                <div className="w-16 sm:w-18"></div>
                <span className="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
                  {format(selectedDate, "EE")}{" "}
                  <span className="font-semibold text-foreground">
                    {format(selectedDate, "d")}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex">
              <div className="relative w-16 sm:w-18">
                {hours.map((hour, index) => (
                  <div
                    key={hour}
                    className="relative"
                    style={{ height: "96px" }}
                  >
                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                      {index !== 0 && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date().setHours(hour, 0, 0, 0), "hh a")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative flex-1 border-l">
                <div className="relative">
                  {hours.map((hour, index) => (
                    <div
                      key={hour}
                      className="relative"
                      style={{ height: "96px" }}
                    >
                      {index !== 0 && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>
                    </div>
                  ))}

                  {groupedEvents.map((group, groupIndex) =>
                    group.map((event) => {
                      let style = getEventBlockStyle(
                        event,
                        new Date(selectedDate),
                        groupIndex,
                        groupedEvents.length,
                        { from: earliestEventHour, to: visibleEndHour }
                      );

                      const hasOverlap = groupedEvents.some(
                        (otherGroup, otherIndex) =>
                          otherIndex !== groupIndex &&
                          otherGroup.some((otherEvent) =>
                            areIntervalsOverlapping(
                              {
                                start: parseISO(event.start_date),
                                end: parseISO(event.end_date),
                              },
                              {
                                start: parseISO(otherEvent.start_date),
                                end: parseISO(otherEvent.end_date),
                              }
                            )
                          )
                      );

                      if (!hasOverlap)
                        style = { ...style, width: "100%", left: "0%" };

                      return (
                        <div
                          key={event.id}
                          className="absolute p-1"
                          style={style}
                        >
                          <EventBlock event={event} />
                        </div>
                      );
                    })
                  )}
                </div>

                <CalendarTimeline
                  firstVisibleHour={earliestEventHour}
                  lastVisibleHour={visibleEndHour}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <aside className="hidden w-full flex-col border-t lg:flex lg:w-72 lg:border-t-0 lg:border-l lg:min-h-0">
        <div className="border-b p-4">
          <DatePicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            className="mx-auto w-full max-w-[320px]"
            initialFocus
          />
        </div>

        <ScrollArea className="flex-1 lg:min-h-0" type="always">
          <div className="border-b p-4">
            <p className="text-sm font-semibold text-foreground">
              Happening now
            </p>
            {currentEvents.length > 0 ? (
              <div className="mt-3 space-y-3">
                {currentEvents.map((event) => {
                  const startDate = parseISO(event.start_date);
                  const endDate = parseISO(event.end_date);
                  const allDay = isAllDayEvent(event);

                  return (
                    <div
                      key={event.id}
                      className="space-y-1 rounded-md border p-3"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {event.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>
                          {allDay
                            ? "All day"
                            : `${format(startDate, "h:mm a")} - ${format(
                                endDate,
                                "h:mm a"
                              )}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing in progress right now.
              </p>
            )}
          </div>

          <div className="space-y-4 p-4">
            <p className="text-sm font-semibold text-foreground">
              All events today
            </p>
            {sortedEventsForSidebar.length > 0 ? (
              <div className="space-y-3">
                {sortedEventsForSidebar.map((event) => {
                  const startDate = parseISO(event.start_date);
                  const endDate = parseISO(event.end_date);
                  const allDay = isAllDayEvent(event);

                  return (
                    <div
                      key={event.id}
                      className="space-y-1 rounded-md border p-3"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {event.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>
                          {allDay
                            ? "All day"
                            : `${format(startDate, "h:mm a")} - ${format(
                                endDate,
                                "h:mm a"
                              )}`}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No events scheduled for this day.
              </p>
            )}
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
