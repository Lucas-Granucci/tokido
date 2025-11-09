"use client";

import { useState } from "react";
import { Columns2, Grid2X2, List, Grid3X3, CalendarRange } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarContainer } from "@/calendar/calendar-container";
import { CalendarHeader } from "@/calendar/header/calendar-header";

import { useEvents } from "@/contexts/events-context";
import type { CalendarViewType } from "@/types/views";
import type { CalendarViewOption } from "@/calendar/interfaces";

export default function CalendarPageClient() {
  const { events, loading } = useEvents();
  const [activeView, setActiveView] = useState<CalendarViewType>("month");

  const handleViewChange = (view: string) => {
    setActiveView(view as CalendarViewType);
  };

  const CalendarViews: CalendarViewOption[] = [
    { value: "day", title: "Day", icon: List },
    { value: "week", title: "Week", icon: Columns2 },
    { value: "month", title: "Month", icon: Grid2X2 },
    { value: "year", title: "Year", icon: Grid3X3 },
    { value: "agenda", title: "Agenda", icon: CalendarRange },
  ];

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Tabs
      defaultValue="month"
      className="w-full"
      onValueChange={handleViewChange}
    >
      <CalendarHeader views={CalendarViews} activeView={activeView} />

      {CalendarViews.map((item) => (
        <TabsContent value={item.value} key={item.value}>
          <CalendarContainer events={events} viewOption={item} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
