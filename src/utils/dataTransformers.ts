import {
  User,
  Team,
  Event,
  TeamMember,
  TeamApplication,
  EventRegistration,
} from "../types";

/**
 * Transforms nested team data from Supabase queries
 * Handles the common pattern: ?.team?.team || null
 */
export const transformUserTeam = (user: User): User => {
  if (!user) return user;
  return {
    ...user,
    team: user.team?.team ?? null,
  };
};

/**
 * Transforms an array of users with nested team data
 */
export const transformUsersWithTeams = (users: User[]): User[] => {
  return users.map(transformUserTeam);
};

/**
 * Transforms event data with nested user and team information
 */
export const transformEventData = (event: Event): Event => {
  if (!event) return event;
  const transformedEvent: Event = {
    ...event,
    user: transformUserTeam(event.user),
  };
  // Transform registrations if they exist
  if (event.registrations) {
    transformedEvent.registrations = event.registrations.map(
      (registration: EventRegistration) => ({
        ...registration,
        user: transformUserTeam(registration.user),
      })
    );
  }
  return transformedEvent;
};

/**
 * Transforms an array of events with nested data
 */
export const transformEventsData = (events: Event[]): Event[] => {
  return events.map(transformEventData).filter(Boolean) as Event[];
};

/**
 * Transforms team data with nested members
 */
export const transformTeamData = (team: Team): Team => {
  if (!team) return team;
  return {
    ...team,
    team_members:
      team.team_members?.map((member: TeamMember) => ({
        ...member,
        user: transformUserTeam(member.user),
      })) ?? [],
    team_applications:
      team.team_applications?.map((application: TeamApplication) => ({
        ...application,
        user: transformUserTeam(application.user),
      })) ?? [],
  };
};

/**
 * Transforms an array of teams with nested data
 */
export const transformTeamsData = (teams: Team[]): Team[] => {
  return teams.map(transformTeamData);
};
