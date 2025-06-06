import { User, Team } from "../types";

/**
 * Transforms nested team data from Supabase queries
 * Handles the common pattern: user.team?.team || null
 */
export const transformUserTeam = (user: any): User => {
  if (!user) return user;
  
  return {
    ...user,
    team: user.team?.team || null,
  };
};

/**
 * Transforms an array of users with nested team data
 */
export const transformUsersWithTeams = (users: any[]): User[] => {
  return users.map(transformUserTeam);
};

/**
 * Transforms event data with nested user and team information
 */
export const transformEventData = (event: any) => {
  if (!event) return event;

  const transformedEvent = {
    ...event,
    user: transformUserTeam(event.user),
  };

  // Transform registrations if they exist
  if (event.registrations) {
    transformedEvent.registrations = event.registrations.map((registration: any) => ({
      ...registration,
      user: transformUserTeam(registration.user),
    }));
  }

  return transformedEvent;
};

/**
 * Transforms an array of events with nested data
 */
export const transformEventsData = (events: any[]) => {
  return events.map(transformEventData);
};

/**
 * Transforms team data with nested members
 */
export const transformTeamData = (team: any): Team => {
  if (!team) return team;

  return {
    ...team,
    members: team.team_members?.map((member: any) => ({
      ...member,
      user: transformUserTeam(member.user || member.users),
    })) || [],
    applications: team.team_applications?.map((application: any) => ({
      ...application,
      user: transformUserTeam(application.user || application.users),
    })) || [],
  };
};

/**
 * Transforms an array of teams with nested data
 */
export const transformTeamsData = (teams: any[]): Team[] => {
  return teams.map(transformTeamData);
};