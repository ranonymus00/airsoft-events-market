import { supabase } from "./supabase";
import { Team, Event, TeamMap } from "../types";

import {
  transformEventsData,
  transformEventData,
  transformTeamsData,
  transformTeamData,
} from "../utils/dataTransformers";

export const api = {
  events: {
    async getAll() {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          user:users!events_user_id_fkey(
            username,
            avatar,
            team:team_members!user_id(
              team:teams(
                id,
                name,
                logo
              )
            )
          ),
          map:team_maps!map_id(
            name,
            field_type
          ),
          registrations:event_registrations!event_registrations_event_id_fkey(
            id,
            status
          )
        `
        )
        .order("date", { ascending: true });

      if (error) throw error;
      return transformEventsData(data);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          map:team_maps!map_id(*),
          user:users!events_user_id_fkey(
            username,
            avatar,
            team:team_members!user_id(
              team:teams(
                id,
                name,
                logo
              )
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
              team:team_members!user_id(
                team:teams(
                  id,
                  name,
                  logo
                )
              )
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return transformEventData(data);
    },

    async register(
      eventId: string,
      message: string,
      proofImage: string,
      numberOfParticipants: number = 1
    ) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User must be authenticated to register for an event");
      }

      const { data, error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: user.id,
          message,
          proof_image: proofImage,
          number_of_participants: numberOfParticipants,
          status: "pending",
        })
        .select(
          `
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
            team:team_members!user_id(
              team:teams(
                id,
                name,
                logo
              )
            )
          )
        `
        )
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
        .eq("id", id).select(`
          *,
          map:team_maps!map_id(*),
          user:users!events_user_id_fkey(
            username,
            avatar,
            team:team_members!user_id(
              team:teams(
                id,
                name,
                logo
              )
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
              username,
              avatar,
              team:team_members!user_id(
                team:teams(
                  id,
                  name,
                  logo
                )
              )
            )
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

      return transformEventData(data[0]);
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
    getAll: async (): Promise<Team[]> => {
      const { data, error } = await supabase.from("teams").select(`
          *,
          users!teams_owner_id_fkey(
            id,
            username,
            email,
            avatar,
            created_at
          ),
          team_members!team_members_team_id_fkey(
            joined_at,
            users!team_members_user_id_fkey(
              id,
              username,
              email,
              avatar,
              created_at
            )
          ),
          team_applications!team_applications_team_id_fkey(
            status,
            created_at,
            updated_at,
            users!team_applications_user_id_fkey(
              id,
              username,
              email,
              avatar
            )
          )
        `);
      if (error) throw error;
      return transformTeamsData(data);
    },

    getUserTeam: async (userId: string): Promise<Team> => {
      const { data, error } = await supabase
        .from("teams")
        .select(
          `
          *,
          team_members!team_members_team_id_fkey(
            joined_at,
            users!team_members_user_id_fkey(
              id,
              username,
              email,
              avatar,
              created_at
            )
          ),
          team_applications!team_applications_team_id_fkey(
            status,
            created_at,
            updated_at,
            users!team_applications_user_id_fkey(
              id,
              username,
              email,
              avatar
            )
          )
        `
        )
        .eq("owner_id", userId)
        .single();
      if (error) throw error;
      return transformTeamData(data);
    },

    create: async (team: Partial<Team>): Promise<Team> => {
      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert([team])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add owner to team_members
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: newTeam.id,
            user_id: team.owner_id,
            joined_at: new Date().toISOString(),
          },
        ]);

      if (memberError) throw memberError;

      // Get the complete team data with all relationships
      const { data, error } = await supabase
        .from("teams")
        .select(
          `
          *,
          users!teams_owner_id_fkey(
            id,
            username,
            email,
            avatar,
            created_at
          ),
          team_members!team_members_team_id_fkey(
            joined_at,
            users!team_members_user_id_fkey(
              id,
              username,
              email,
              avatar,
              created_at
            )
          ),
          team_applications!team_applications_team_id_fkey(
            status,
            created_at,
            updated_at,
            users!team_applications_user_id_fkey(
              id,
              username,
              email,
              avatar
            )
          )
        `
        )
        .eq("id", newTeam.id)
        .single();

      if (error) throw error;
      return transformTeamData(data);
    },

    update: async (teamId: string, team: Partial<Team>): Promise<Team> => {
      const { data, error } = await supabase
        .from("teams")
        .update(team)
        .eq("id", teamId)
        .select(
          `
          *,
          users!teams_owner_id_fkey(
            id,
            username,
            email,
            avatar,
            created_at
          ),
          team_members!team_members_team_id_fkey(
            joined_at,
            users!team_members_user_id_fkey(
              id,
              username,
              email,
              avatar,
              created_at
            )
          ),
          team_applications!team_applications_team_id_fkey(
            status,
            created_at,
            updated_at,
            users!team_applications_user_id_fkey(
              id,
              username,
              email,
              avatar
            )
          )
        `
        )
        .single();
      console.log(data, error);
      if (error) throw error;
      return transformTeamData(data);
    },

    apply: async (teamId: string): Promise<void> => {
      const { error } = await supabase.from("team_applications").insert([
        {
          team_id: teamId,
          status: "pending",
        },
      ]);
      if (error) throw error;
    },

    approveApplication: async (applicationId: string): Promise<void> => {
      const { error: applicationError } = await supabase
        .from("team_applications")
        .update({ status: "approved" })
        .eq("id", applicationId);

      if (applicationError) throw applicationError;

      const { data: application, error: fetchError } = await supabase
        .from("team_applications")
        .select("user_id, team_id")
        .eq("id", applicationId)
        .single();

      if (fetchError) throw fetchError;

      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            user_id: application.user_id,
            team_id: application.team_id,
            joined_at: new Date().toISOString(),
          },
        ]);

      if (memberError) throw memberError;
    },

    rejectApplication: async (applicationId: string): Promise<void> => {
      const { error } = await supabase
        .from("team_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);
      if (error) throw error;
    },
  },

  teamMaps: {
    async getByTeam(teamId: string) {
      const { data, error } = await supabase
        .from("team_maps")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    async create(map: Partial<TeamMap>) {
      const { data, error } = await supabase
        .from("team_maps")
        .insert([map])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, map: Partial<TeamMap>) {
      const { data, error } = await supabase
        .from("team_maps")
        .update(map)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from("team_maps").delete().eq("id", id);
      if (error) throw error;
    },
  },
};
