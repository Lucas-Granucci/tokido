"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, AlignLeft, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Event } from "../interfaces";
import { calendarClient } from "../calendarClient";
import { useEvents } from "@/contexts/events-context";
import { EditEventDialog } from "./edit-event-dialog";
import { useCategoryConfig } from "@/hooks/use-category-config";

interface EventDetailsDialogProps {
  event: Event;
  children: React.ReactNode;
}

export function EventDetailsDialog({
  event,
  children,
}: EventDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { refreshEvents } = useEvents();
  const { getCategory } = useCategoryConfig();

  const categoryConfig = getCategory(event.category);
  const CategoryIcon = categoryConfig?.Icon || Tag;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await calendarClient.deleteEvent(event.id);
      toast.success("Event deleted successfully");
      await refreshEvents();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold">{event.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Category */}
          <div className="flex items-start gap-3">
            <CategoryIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Category</p>
              <p className="text-sm text-muted-foreground">
                {categoryConfig?.label ?? event.category ?? "Uncategorized"}
              </p>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Start</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.start_date), "PPP p")}
              </p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">End</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.end_date), "PPP p")}
              </p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3">
              <AlignLeft className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="grid gap-0.5">
                <p className="text-sm font-medium leading-none">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10 hover:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/15"
          >
            {deleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <EditEventDialog event={event}>
            <Button variant="outline" className="cursor-pointer">
              Edit
            </Button>
          </EditEventDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
