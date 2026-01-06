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
    <div className="flex h-full flex-col gap-4 overflow-hidden min-h-0">
      <Tabs
        defaultValue="month"
        className="flex w-full flex-1 flex-col overflow-hidden min-h-0"
        onValueChange={handleViewChange}
      >
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-background min-h-0">
          <div className="p-3 md:p-4">
            <CalendarHeader views={CalendarViews} activeView={activeView} />
          </div>
          <Separator />
          <div className="flex-1 overflow-hidden">
            {CalendarViews.map((item) => (
              <TabsContent
                value={item.value}
                key={item.value}
                className="m-0 h-full overflow-hidden p-0"
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
