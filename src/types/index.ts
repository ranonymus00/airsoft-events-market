// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  team: Team | null;
  created_at: string;
  password: string;
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
  location?: string;
  owner_id: string;
  owner?: User;
  team_members: TeamMember[];
  team_applications: TeamApplication[];
  events: Event[];
  created_at: string;
  updated_at?: string;
  play_style?: "casual" | "competitive" | "milsim" | "speedsoft";
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  joined_at: string;
  user: User;
}

export interface TeamApplication {
  id: string;
  user_id: string;
  team_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user: User;
}

export interface TeamMap {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  location?: string;
  google_maps_link?: string;
  field_type?: string;
  photos?: string[];
  created_at: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  map_id?: string; // Relates to TeamMap
  map?: TeamMap; // Populated when joined
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
  canceled: boolean;
  deleted?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  user: User;
  status: "pending" | "accepted" | "declined";
  message: string;
  proof_image: string;
  number_of_participants: number;
  created_at: string;
}

// Marketplace types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  seller: User;
  location: string;
  created_at: string;
  is_trade_allowed?: boolean;
  isTradeAllowed?: boolean; // Legacy support
}

// Form types
export interface EventFormData {
  title: string;
  description: string;
  image: string;
  date: string;
  start_time: string;
  end_time: string;
  rules: string;
  max_participants: number;
  map_id: string;
}

// Dashboard types
export interface DashboardState {
  activeTab: string;
  searchTerm: string;
  error: string | null;
  selectedFile: File | null;
  previewUrl: string | null;
  profileForm: {
    email: string;
    username: string;
  };
  showCreateEventForm: boolean;
  showEditEventForm: boolean;
  selectedEvent: Event | null;
  userEvents: Event[];
  userItems: MarketplaceItem[];
  teams: Team[];
  loading: {
    events: boolean;
    items: boolean;
    teams: boolean;
  };
}

export interface DashboardProps {
  authState: {
    isAuthenticated: boolean;
    loading: boolean;
    user?: {
      id: string;
      email: string;
      username: string;
      avatar: string;
      team?: {
        name: string;
      };
    };
  };
  updateProfile: (data: {
    avatar: string;
    email: string;
    username: string;
  }) => Promise<boolean>;
}
