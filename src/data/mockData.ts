import { User, Team, Event, MarketplaceItem } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "tacticalOperator",
    email: "tactical@example.com",
    avatar:
      "https://images.pexels.com/photos/1553783/pexels-photo-1553783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    team: null,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "user-2",
    username: "airsoftSniper",
    email: "sniper@example.com",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    team: null,
    createdAt: "2023-06-20T14:45:00Z",
  },
  {
    id: "user-3",
    username: "teamLeader",
    email: "leader@example.com",
    avatar:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    team: null,
    createdAt: "2023-04-10T09:15:00Z",
  },
  {
    id: "user-4",
    username: "gearCollector",
    email: "collector@example.com",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    team: null,
    createdAt: "2023-07-05T16:20:00Z",
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Shadow Operators",
    description:
      "A tactical team focused on stealth and precision in urban environments.",
    logo: "https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    members: [mockUsers[0], mockUsers[1]],
    events: [],
    createdAt: "2023-05-20T11:00:00Z",
  },
  {
    id: "team-2",
    name: "Woodland Warriors",
    description:
      "Specializing in forest operations and long-range engagements.",
    logo: "https://images.pexels.com/photos/6941883/pexels-photo-6941883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    members: [mockUsers[2]],
    events: [],
    createdAt: "2023-06-25T13:30:00Z",
  },
  {
    id: "team-3",
    name: "Desert Foxes",
    description:
      "Experts in arid environment operations and quick tactical responses.",
    logo: "https://images.pexels.com/photos/6368445/pexels-photo-6368445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    members: [mockUsers[3]],
    events: [],
    createdAt: "2023-07-10T15:45:00Z",
  },
];

// Update user teams
mockUsers[0].team = mockTeams[0];
mockUsers[1].team = mockTeams[0];
mockUsers[2].team = mockTeams[1];
mockUsers[3].team = mockTeams[2];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Urban Assault",
    description:
      "A fast-paced CQB operation in an abandoned factory complex. Multiple objectives and respawn points.",
    location: "Abandoned Factory, 123 Industrial St, Cityville",
    date: "2025-08-15",
    startTime: "09:00",
    endTime: "17:00",
    canceled: false,
    team: mockTeams[0],
    image:
      "https://images.pexels.com/photos/5979962/pexels-photo-5979962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rules:
      "FPS limit: 350 for rifles, 400 for DMRs, 500 for bolt action. Eye protection mandatory. No blind firing.",
    maxParticipants: 40,
    participants: [mockUsers[0], mockUsers[1]],
    registrations: [],
    createdAt: "2024-06-01T10:00:00Z",
    field: "CQB",
  },
  {
    id: "event-2",
    title: "Urban Assault",
    description:
      "A fast-paced CQB operation in an abandoned factory complex. Multiple objectives and respawn points.",
    location: "Abandoned Factory, 123 Industrial St, Cityville",
    date: "2025-08-15",
    startTime: "09:00",
    endTime: "17:00",
    canceled: true,
    team: mockTeams[0],
    image:
      "https://images.pexels.com/photos/5979962/pexels-photo-5979962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rules:
      "FPS limit: 350 for rifles, 400 for DMRs, 500 for bolt action. Eye protection mandatory. No blind firing.",
    maxParticipants: 40,
    participants: [mockUsers[0], mockUsers[1]],
    registrations: [],
    createdAt: "2024-06-01T10:00:00Z",
    field: "CQB",
  },
];

// Update team events
mockTeams[0].events = [mockEvents[0]];

// Mock Marketplace Items
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "item-1",
    title: "Custom M4 AEG",
    description: "Upgraded internals, includes 3 magazines and battery.",
    price: 450,
    condition: "Good",
    category: "Guns",
    images: [
      "https://images.pexels.com/photos/313395/pexels-photo-313395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    seller: mockUsers[0],
    location: "New York, NY",
    createdAt: new Date().toISOString(),
    isTradeAllowed: true,
  },
];