// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  team: Team | null;
  createdAt: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Team types
export interface Team {
  id: string;
  name: string;
  description: string;
  logo: string;
  members: User[];
  events: Event[];
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  team: Team;
  image: string;
  rules: string;
  maxParticipants: number;
  participants: User[];
  registrations: EventRegistration[];
  createdAt: string;
  field: "Mato" | "CQB" | "Misto";
  canceled: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  proofImage: string;
  createdAt: string;
}