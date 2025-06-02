/*
  # Initial Schema Setup
  
  1. Tables
    - Users table for authentication and profiles
    - Teams table for organizing groups
    - Team members for team membership
    - Events table for airsoft events
    - Event registrations for event sign-ups
    - Marketplace items for gear trading
  
  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Policies for reading, creating, and updating data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo text,
  created_at timestamptz DEFAULT now()
);

-- Team members table (create this AFTER teams table)
CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- Now we can enable RLS and create policies for teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can update team"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = id
      AND user_id = auth.uid()
    )
  );

-- Enable RLS and create policies for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image text,
  rules text,
  max_participants integer NOT NULL,
  field_type text NOT NULL,
  canceled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Event owners can update their events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Event owners can delete their events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  message text,
  proof_image text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read event registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team members can update registration status"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN team_members tm ON tm.team_id = e.team_id
      WHERE e.id = event_registrations.event_id
      AND tm.user_id = auth.uid()
    )
  );

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal NOT NULL,
  condition text NOT NULL,
  category text NOT NULL,
  images text[] NOT NULL,
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location text NOT NULL,
  is_trade_allowed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read marketplace items"
  ON marketplace_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own items"
  ON marketplace_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);