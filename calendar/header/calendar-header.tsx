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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      <div className="flex items-center w-full md:w-auto gap-4 justify-start">
        <div className="flex items-center gap-3">
          <TodayButton />
          <DateNavigator view={activeView} />
        </div>
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
  );
}
