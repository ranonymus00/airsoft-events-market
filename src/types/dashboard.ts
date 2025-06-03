import { Event, Team } from "./index";

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  isTradeAllowed: boolean;
  images: string[];
  seller: {
    id: string;
  };
}

export interface EventFormData {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  rules: string;
  max_participants: number;
  field_type: "Mato" | "CQB" | "Misto";
}

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
  updateProfile: (data: { avatar: string; email: string; username: string }) => Promise<boolean>;
} 