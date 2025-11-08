import { supabase } from "../lib/supabase/client";
import type { Event, EventFormData } from "./interfaces";
import { getCurrentUserClient } from "@/lib/user-client";

export const calendarClient = {
  // get all events for current user
  async getEvents(): Promise<Event[]> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // create new event
  async createEvent(eventData: EventFormData): Promise<Event> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          name: eventData.name,
          category: eventData.category,
          description: eventData.description,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // delete event by id
  async deleteEvent(eventId: string): Promise<void> {
    const { user } = await getCurrentUserClient();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("user_id", user.id);

    if (error) throw error;
  },
};
