import { supabase } from './supabase';
import { Event, MarketplaceItem, Team, User } from '../types';

export const api = {
  events: {
    async getAll() {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          team:teams(
            id,
            name,
            description,
            logo,
            created_at
          ),
          registrations:event_registrations(
            id,
            status,
            message,
            proof_image,
            created_at,
            user:users(*)
          )
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          team:teams(
            id,
            name,
            description,
            logo,
            created_at,
            members:team_members(
              user:users(*)
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
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async register(eventId: string, message: string, proofImage: string) {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          message,
          proof_image: proofImage,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateRegistrationStatus(registrationId: string, status: 'accepted' | 'declined') {
      const { data, error } = await supabase
        .from('event_registrations')
        .update({ status })
        .eq('id', registrationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  marketplace: {
    async getAll() {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:users(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:users(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  },

  teams: {
    async getAll() {
      const { data, error } = await supabase
        .from('teams')
        .select(`
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
        .from('teams')
        .insert(team)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};