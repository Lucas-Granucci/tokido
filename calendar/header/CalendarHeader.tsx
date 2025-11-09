import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarViewOption } from "../interfaces";
import { DateNavigator } from "./date-navigator";
import { TodayButton } from "./today-button";
import { CalendarViewType } from "../types";

interface CalendarHeaderProps {
  views: CalendarViewOption[];
  activeView: CalendarViewType;
}

export function CalendarHeader({ views, activeView }: CalendarHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Calendar</h1>

      <div className="flex items-center justify-between p-2 rounded-lg border">
        <div className="flex items-center gap-3">
          <TodayButton />
          <DateNavigator view={activeView} />
        </div>

        <TabsList className="flex">
          {views.map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              className="flex-1 justify-center gap-2"
            >
              <item.icon />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
}
