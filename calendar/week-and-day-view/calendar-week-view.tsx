import {
  startOfWeek,
  addDays,
  format,
  parseISO,
  isSameDay,
  areIntervalsOverlapping,
} from "date-fns";
import { useMemo } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useEvents } from "@/contexts/events-context";

import { EventBlock } from "./event-block";
import { CalendarTimeline } from "./calendar-time-line";
import { WeekViewMultiDayEventsRow } from "./week-view-multi-day-events-row";

import { groupEvents, getEventBlockStyle } from "../calendar-utils";

import { Event } from "../interfaces";

const DESKTOP_HOUR_HEIGHT = 96;
const MOBILE_HOUR_HEIGHT = 72;
const MOBILE_MIN_WIDTH = 720;

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

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useEvents();

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const allWeekEvents = useMemo(
    () => [...singleDayEvents, ...multiDayEvents],
    [singleDayEvents, multiDayEvents]
  );

  const allDayWeekEvents = useMemo(
    () => allWeekEvents.filter((event) => isAllDayEvent(event)),
    [allWeekEvents]
  );

  const barEvents = useMemo(
    () => [...multiDayEvents, ...allDayWeekEvents],
    [multiDayEvents, allDayWeekEvents]
  );

  const timedWeekEvents = useMemo(
    () => allWeekEvents.filter((event) => !isAllDayEvent(event)),
    [allWeekEvents]
  );

  const earliestEventHour = useMemo(() => {
    if (timedWeekEvents.length === 0) return 6;

    const earliestStartHour = Math.min(
      ...timedWeekEvents.map((event) => parseISO(event.start_date).getHours())
    );

    return Math.max(0, Math.min(earliestStartHour, 6));
  }, [timedWeekEvents]);

  const visibleEndHour = useMemo(() => {
    if (timedWeekEvents.length === 0)
      return Math.min(24, earliestEventHour + 12);

    const latestEndHour = Math.max(
      ...timedWeekEvents.map((event) => {
        const end = parseISO(event.end_date);
        return end.getMinutes() > 0 ? end.getHours() + 1 : end.getHours();
      })
    );

    const paddedEnd = latestEndHour + 1; // one extra hour for breathing room

    return Math.min(24, Math.max(paddedEnd, earliestEventHour + 6));
  }, [timedWeekEvents, earliestEventHour]);

  const hours = useMemo(() => {
    const totalHours = Math.max(1, visibleEndHour - earliestEventHour);
    return Array.from(
      { length: totalHours },
      (_, index) => earliestEventHour + index
    );
  }, [earliestEventHour, visibleEndHour]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col sm:hidden">
        <div className="overflow-x-auto">
          <div
            className="min-w-full"
            style={{ minWidth: `${MOBILE_MIN_WIDTH}px` }}
          >
            <WeekViewMultiDayEventsRow
              selectedDate={selectedDate}
              multiDayEvents={barEvents}
              className="border-b bg-background"
            />

            {/* Week header */}
            <div className="grid grid-cols-7 divide-x border-b border-l bg-background">
              {weekDays.map((day, index) => (
                <span
                  key={index}
                  className="py-2 text-center text-[11px] font-medium text-muted-foreground"
                >
                  {format(day, "EEEEE")}{" "}
                  <span className="ml-1 font-semibold text-foreground">
                    {format(day, "d")}
                  </span>
                </span>
              ))}
            </div>

            <ScrollArea className="min-h-0 flex-1" type="always">
              <div className="flex">
                {/* Hours column */}
                <div className="relative w-18">
                  {hours.map((hour, index) => (
                    <div
                      key={hour}
                      className="relative"
                      style={{ height: `${MOBILE_HOUR_HEIGHT}px` }}
                    >
                      <div className="absolute -top-2.5 right-2 flex h-5 items-center">
                        {index !== 0 && (
                          <span className="text-[11px] text-muted-foreground">
                            {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Week grid */}
                <div className="relative z-0 flex-1 border-l pt-2">
                  <div className="grid grid-cols-7 divide-x">
                    {weekDays.map((day, dayIndex) => {
                      const dayEvents = singleDayEvents.filter(
                        (event) =>
                          !isAllDayEvent(event) &&
                          (isSameDay(parseISO(event.start_date), day) ||
                            isSameDay(parseISO(event.end_date), day))
                      );
                      const groupedEvents = groupEvents(dayEvents);

                      return (
                        <div key={dayIndex} className="relative">
                          {hours.map((hour, index) => {
                            return (
                              <div
                                key={hour}
                                className="relative"
                                style={{ height: `${MOBILE_HOUR_HEIGHT}px` }}
                              >
                                {index !== 0 && (
                                  <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                                )}

                                <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>
                              </div>
                            );
                          })}

                          {groupedEvents.map((group, groupIndex) =>
                            group.map((event) => {
                              let style = getEventBlockStyle(
                                event,
                                day,
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
                      );
                    })}
                  </div>

                  <CalendarTimeline
                    firstVisibleHour={earliestEventHour}
                    lastVisibleHour={visibleEndHour}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 flex-col sm:flex">
        <div className="sticky top-0 z-20 shrink-0 bg-background">
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={barEvents}
            className="hidden sm:flex"
          />

          {/* Week header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7 divide-x border-l">
              {weekDays.map((day, index) => (
                <span
                  key={index}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {format(day, "EE")}{" "}
                  <span className="ml-1 font-semibold text-foreground">
                    {format(day, "d")}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0" type="always">
          <div className="flex">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className="relative"
                  style={{ height: `${DESKTOP_HOUR_HEIGHT}px` }}
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

            {/* Week grid */}
            <div className="relative z-0 flex-1 border-l pt-2">
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(
                    (event) =>
                      !isAllDayEvent(event) &&
                      (isSameDay(parseISO(event.start_date), day) ||
                        isSameDay(parseISO(event.end_date), day))
                  );
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={dayIndex} className="relative">
                      {hours.map((hour, index) => {
                        return (
                          <div
                            key={hour}
                            className="relative"
                            style={{ height: `${DESKTOP_HOUR_HEIGHT}px` }}
                          >
                            {index !== 0 && (
                              <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                            )}

                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>
                          </div>
                        );
                      })}

                      {groupedEvents.map((group, groupIndex) =>
                        group.map((event) => {
                          let style = getEventBlockStyle(
                            event,
                            day,
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
                  );
                })}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={visibleEndHour}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
