"use client";

import { startOfToday } from "date-fns";
import { Event } from "@/calendar/interfaces";
import { calendarClient } from "@/calendar/calendarClient";
import React, { createContext, useContext, useEffect, useState } from "react";

interface EventContextType {
  events: Event[];
  loading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  refreshEvents: () => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const EventsContext = createContext<EventContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const eventData = await calendarClient.getEvents();
      setEvents(eventData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      // Optimistically update the UI
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      await calendarClient.deleteEvent(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      await refreshEvents(); // get correct state
      throw error;
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        selectedDate,
        setSelectedDate,
        refreshEvents,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a EventsProvider");
  }
  return context;
}
