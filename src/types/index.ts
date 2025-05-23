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
  createdAt: string;
  field: "Mato" | "CQB" | "Misto";
  canceled: boolean;
}

// Marketplace types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: 'Guns' | 'Accessories' | 'Gear' | 'Clothing' | 'Other';
  images: string[];
  seller: User;
  location: string;
  createdAt: string;
  isTradeAllowed: boolean;
}