// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  team: Team | null;
  created_at: string;
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
  created_at: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  maps_link: string;
  date: string;
  start_time: string;
  end_time: string;
  user_id: string;
  user: User;
  image: string;
  rules: string;
  max_participants: number;
  participants: User[];
  registrations: EventRegistration[];
  created_at: string;
  field_type: "Mato" | "CQB" | "Misto";
  canceled: boolean;
  deleted?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  proofImage: string;
  number_of_participants: number;
  created_at: string;
}