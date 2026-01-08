"use client";

import {
  AlertTriangle,
  CalendarClock,
  CalendarRange,
  Clock3,
  ListTodo,
  Play,
} from "lucide-react";
import {
  addDays,
  endOfDay,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import type { CSSProperties } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTasks } from "@/contexts/tasks-context";
import { useEvents } from "@/contexts/events-context";
import { getPriorityColor } from "@/utils/config-utils";
import { useCategoryConfig } from "@/hooks/use-category-config";
const safeParseDate = (value?: string | null) => {
  if (!value) return null;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function OverviewPageClient() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { events, loading: eventsLoading } = useEvents();
  const {
    getCategory,
    getCategoryColor,
    getEventBadgeClasses,
    getEventBadgeStyle,
  } = useCategoryConfig();

  const today = startOfDay(new Date());
  const now = new Date();
  const endOfSoon = endOfDay(addDays(today, 2));
  const endOfWeek = endOfDay(addDays(today, 6));

  const tasksOverdue = tasks.filter((task) => {
    const due = safeParseDate(task.due_date);
    if (!due) return false;
    return isBefore(due, today);
  });

  const tasksDueSoon = tasks.filter((task) => {
    const due = safeParseDate(task.due_date);
    if (!due) return false;
    return !isBefore(due, today) && isBefore(due, endOfSoon);
  });

  const tasksNoDueDate = tasks.filter((task) => !safeParseDate(task.due_date));

  const ongoingEvents = events.filter((event) => {
    const start = safeParseDate(event.start_date);
    const end = safeParseDate(event.end_date);
    if (!start || !end) return false;
    return isWithinInterval(now, { start, end });
  });

  const eventsToday = events.filter((event) => {
    const start = safeParseDate(event.start_date);
    if (!start) return false;
    return isSameDay(start, today);
  });

  const eventsThisWeek = events.filter((event) => {
    const start = safeParseDate(event.start_date);
    if (!start) return false;
    return !isBefore(start, today) && isBefore(start, endOfWeek);
  });

  const upcomingEvents = events
    .map((event) => ({ event, start: safeParseDate(event.start_date) }))
    .filter((item) => item.start && !isBefore(item.start, today))
    .sort((a, b) => (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0))
    .slice(0, 5)
    .map((item) => item.event);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto sm:overflow-hidden min-h-0">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:snap-none xl:grid-cols-4">
        <div className="min-w-[190px] shrink-0 snap-center sm:min-w-0 sm:w-full">
          <StatCard
            title="Total Tasks"
            description="All pending tasks"
            value={tasks.length}
            icon={<ListTodo className="h-5 w-5" />}
            tone="neutral"
            loading={tasksLoading}
          />
        </div>
        <div className="min-w-[190px] shrink-0 snap-center sm:min-w-0 sm:w-full">
          <StatCard
            title="Overdue"
            description="Need attention"
            value={tasksOverdue.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            tone="destructive"
            loading={tasksLoading}
          />
        </div>
        <div className="min-w-[190px] shrink-0 snap-center sm:min-w-0 sm:w-full">
          <StatCard
            title="Due Soon"
            description="Next 3 days"
            value={tasksDueSoon.length}
            icon={<Clock3 className="h-5 w-5" />}
            tone="warning"
            loading={tasksLoading}
          />
        </div>
        <div className="min-w-[190px] shrink-0 snap-center sm:min-w-0 sm:w-full">
          <StatCard
            title="Ongoing Events"
            description="Happening now"
            value={ongoingEvents.length}
            icon={<Play className="h-5 w-5" />}
            tone="success"
            loading={eventsLoading}
          />
        </div>
      </div>

      <div className="grid flex-1 min-h-0 gap-3 sm:gap-4 lg:grid-cols-2">
        <Card className="flex flex-col overflow-hidden min-h-80 max-h-[55vh] sm:max-h-none">
          <CardHeader className="space-y-0 px-3 py-2 sm:px-5 sm:py-2.5">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Task Overview</CardTitle>
              <Badge variant="outline">Live</Badge>
            </div>
            <CardDescription>
              Overdue, coming soon, and tasks without a due date.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full" type="always">
              <section className="space-y-3 px-3 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3">
                <TaskGroup
                  title="Overdue"
                  tone="destructive"
                  tasks={tasksOverdue}
                  empty="You're all caught up!"
                  getCategoryColor={getCategoryColor}
                  getCategory={getCategory}
                />

                <TaskGroup
                  title="Due Soon"
                  tone="warning"
                  tasks={tasksDueSoon}
                  empty="No tasks due soon."
                  getCategoryColor={getCategoryColor}
                  getCategory={getCategory}
                />

                <TaskGroup
                  title="No Due Date"
                  tone="neutral"
                  tasks={tasksNoDueDate}
                  empty="Everything has a date."
                  getCategoryColor={getCategoryColor}
                  getCategory={getCategory}
                />
              </section>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[320px] max-h-[55vh] sm:max-h-none">
          <CardHeader className="space-y-0 px-3 py-2 sm:px-5 sm:py-2.5">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Event Overview</CardTitle>
              <Badge variant="outline">Calendar</Badge>
            </div>
            <CardDescription>
              What&apos;s happening today and what&apos;s coming up next.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full" type="always">
              <section className="space-y-3 px-3 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3">
                <EventGroup
                  title="Happening Today"
                  tone="success"
                  events={eventsToday}
                  empty="No events today."
                  getEventBadgeStyle={getEventBadgeStyle}
                  getEventBadgeClasses={getEventBadgeClasses}
                />
                <EventGroup
                  title="This Week"
                  tone="warning"
                  events={eventsThisWeek}
                  empty="Nothing scheduled this week."
                  getEventBadgeStyle={getEventBadgeStyle}
                  getEventBadgeClasses={getEventBadgeClasses}
                />
                <EventGroup
                  title="Upcoming"
                  tone="neutral"
                  events={upcomingEvents}
                  empty="No upcoming events."
                  getEventBadgeStyle={getEventBadgeStyle}
                  getEventBadgeClasses={getEventBadgeClasses}
                />
              </section>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type Tone = "destructive" | "warning" | "neutral" | "success";

const toneStyles: Record<Tone, { badge: string; dot: string }> = {
  destructive: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  warning: {
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
  },
  neutral: {
    badge: "bg-muted text-foreground border-border",
    dot: "bg-muted-foreground",
  },
  success: {
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
};

interface StatCardProps {
  title: string;
  description: string;
  value: number;
  icon: React.ReactNode;
  tone: Tone;
  loading?: boolean;
}

function StatCard({
  title,
  description,
  value,
  icon,
  tone,
  loading,
}: StatCardProps) {
  return (
    <Card className="border bg-background shadow-none gap-2.5 py-2.5 px-3 sm:gap-5 sm:py-5 sm:px-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-0.5 sm:px-3 sm:pb-1.5">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${toneStyles[tone].badge}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">
          {loading ? <span className="text-muted-foreground">—</span> : value}
        </p>
      </CardContent>
    </Card>
  );
}

interface TaskGroupProps {
  title: string;

  tasks: ReturnType<typeof useTasks>["tasks"];

  empty: string;

  tone: Tone;

  getCategoryColor: (label?: string | null) => string;

  getCategory: ReturnType<typeof useCategoryConfig>["getCategory"];
}

function TaskGroup({
  title,

  tasks,

  empty,

  tone,

  getCategoryColor,

  getCategory,
}: TaskGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${toneStyles[tone].dot}`} />
        <p className="font-medium">{title}</p>
        <Badge variant="outline" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="grid gap-1 md:grid-cols-2">
          {tasks.map((task) => {
            const priorityColor = getPriorityColor(task.priority);

            const categoryColor = getCategoryColor(task.category);

            const category = getCategory(task.category);
            return (
              <div
                key={task.id}
                className="flex flex-col gap-1.5 rounded-lg border p-2 text-sm transition hover:bg-muted/50 sm:p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="line-clamp-2 font-medium">{task.name}</p>
                  <Badge
                    variant="outline"
                    className="text-[0.7rem]"
                    style={{
                      color: priorityColor,
                      borderColor: `${priorityColor}33`,
                    }}
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>

                  <Badge
                    variant="secondary"
                    className="ml-auto text-[0.7rem]"
                    style={{
                      backgroundColor: `${categoryColor}14`,

                      color: categoryColor,
                    }}
                  >
                    {category?.label ?? "Uncategorized"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface EventGroupProps {
  title: string;
  events: ReturnType<typeof useEvents>["events"];
  empty: string;
  tone: Tone;
  getEventBadgeStyle: (label?: string | null) => CSSProperties;
  getEventBadgeClasses: (label?: string | null) => string;
}

function EventGroup({
  title,
  events,
  empty,
  tone,
  getEventBadgeStyle,
  getEventBadgeClasses,
}: EventGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${toneStyles[tone].dot}`} />
        <p className="font-medium">{title}</p>
        <Badge variant="outline" className="ml-auto">
          {events.length}
        </Badge>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const badgeStyle = getEventBadgeStyle(event.category);
            return (
              <div
                key={event.id}
                className={`flex items-center gap-2.5 rounded-lg border p-2 text-sm transition hover:bg-muted/50 sm:p-3 ${getEventBadgeClasses(
                  event.category,
                )}`}
                style={badgeStyle}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    <p className="font-medium leading-tight">{event.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.start_date).toLocaleString()} —{" "}
                    {new Date(event.end_date).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
