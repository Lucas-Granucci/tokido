import { TodayButton } from "./today-button";
import { DateNavigator } from "./date-navigator";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { CalendarViewType } from "@/types/views";
import type { CalendarViewOption } from "../interfaces";

interface IProps {
  views: CalendarViewOption[];
  activeView: CalendarViewType;
}

export function CalendarHeader({ views, activeView }: IProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold hidden md:block">Calendar</h1>

      <div className="flex flex-col md:flex-row items-center justify-between p-2 rounded-lg border gap-4 md:gap-0 bg-background">
        <div className="flex items-center w-full md:w-auto gap-3 justify-between md:justify-start">
          <TodayButton />
          <DateNavigator view={activeView} />
        </div>

        <TabsList className="flex w-full md:w-auto h-10 md:h-9">
          {views.map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              className="flex-1 justify-center gap-2"
            >
              <item.icon className="h-4 w-4" />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
}
