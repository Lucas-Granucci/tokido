import { CalendarViewType } from "@/tasks/utils/view-types";
import React from "react";
import { Clock, Grid2X2, List, Grid3X3, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarView {
  value: CalendarViewType;
  title: string;
  icon: React.ElementType;
}

export default function CalendarPageClient() {
  const CalendarViews: CalendarView[] = [
    { value: "day", title: "Day", icon: Clock },
    { value: "week", title: "Week", icon: Flag },
    { value: "month", title: "Month", icon: Grid2X2 },
    { value: "year", title: "Year", icon: Grid3X3 },
    { value: "agenda", title: "Agenda", icon: List },
  ];

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Calendar</h1>

      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="w-full">
          {CalendarViews.map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              className="w-full justify-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CalendarViews.map((item) => (
          <TabsContent value={item.value} key={item.value}>
            <h1>{item.title}</h1>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
