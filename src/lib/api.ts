import { supabase } from "./supabase";
import { Team, Event } from "../types";

export const api = {
  events: {
    async getAll() {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          user:users!events_user_id_fkey(
            id,
            username,
            avatar,
            team:teams(
              id,
              name,
              logo
            )
          ),
          registrations:event_registrations!event_registrations_event_id_fkey(
            id,
            status,
            message,
            proof_image,
            created_at,
            number_of_participants,
            user:users!event_registrations_user_id_fkey(
              id,
              username,
              avatar,
              team:teams(
                id,
                name,
                logo
              )
            )
          )
        `
        )
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          user:users!events_user_id_fkey(
            id,
            username,
            avatar,
            team:teams(
              id,
              name,
              logo
            )
          ),
          registrations:event_registrations!event_registrations_event_id_fkey(
            id,
            status,
            message,
            proof_image,
            created_at,
            number_of_participants,
            user:users!event_registrations_user_id_fkey(
              id,
              username,
              avatar,
              team:teams(
                id,
                name,
                logo
              )
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },

    async register(eventId: string, message: string, proofImage: string, numberOfParticipants: number = 1) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to register for an event');
      }

      const { data, error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: user.id,
          message,
          proof_image: proofImage,
          number_of_participants: numberOfParticipants,
          status: 'pending'
        })
        .select(`
          id,
          status,
          message,
          proof_image,
          number_of_participants,
          created_at,
          user:users!event_registrations_user_id_fkey(
            id,
            username,
            avatar,
            team:teams(
              id,
              name,
              logo
            )
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },

    async updateRegistrationStatus(
      registrationId: string,
      status: "accepted" | "declined"
    ) {
      const { data, error } = await supabase
        .from("event_registrations")
        .update({ status })
        .eq("id", registrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, event: Partial<Event>) {
      const { data, error } = await supabase
        .from("events")
        .update(event)
        .eq("id", id)
        .select(`
          *,
          user:users!events_user_id_fkey(
            id,
            username,
            avatar,
            team:teams(
              id,
              name,
              logo
            )
          ),
          registrations:event_registrations(
            id,
            status,
            message,
            proof_image,
            created_at,
            user:users(*)
          )
        `);

      if (error) {
        console.error("Error updating event:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error(
          "No data returned from update. Check RLS policies and user permissions."
        );
        throw new Error(
          "No event was updated. Please check if you have the correct permissions."
        );
      }

      return data[0];
    },
  },

  marketplace: {
    async getAll() {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select(
          `
          *,
          seller:users(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select(
          `
          *,
          seller:users(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  },

  teams: {
    async getAll() {
      const { data, error } = await supabase.from("teams").select(`
          *,
          members:team_members(
            user:users(*)
          )
        `);

      if (error) throw error;
      return data;
    },

    async create(team: Partial<Team>) {
      const { data, error } = await supabase
        .from("teams")
        .insert(team)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};
