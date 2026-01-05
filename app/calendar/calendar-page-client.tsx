"use client";

import { useState } from "react";
import { Columns2, Grid2X2, List, Grid3X3, CalendarRange } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarContainer } from "@/calendar/calendar-container";
import { CalendarHeader } from "@/calendar/header/calendar-header";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex flex-col h-full gap-4">
      <h1 className="text-3xl font-bold hidden md:block">Calendar</h1>

      <Tabs
        defaultValue="month"
        className="w-full flex-1 flex flex-col"
        onValueChange={handleViewChange}
      >
        <div className="flex-1 rounded-lg border bg-background  flex flex-col overflow-hidden">
          <div className="p-4">
            <CalendarHeader views={CalendarViews} activeView={activeView} />
          </div>
          <Separator />
          <div className="flex-1 overflow-auto">
            {CalendarViews.map((item) => (
              <TabsContent
                value={item.value}
                key={item.value}
                className="h-full m-0 p-0"
              >
                <CalendarContainer events={events} viewOption={item} />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
