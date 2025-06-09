/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `avatar` (text)
      - `created_at` (timestamp)
    
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `logo` (text)
      - `created_at` (timestamp)
    
    - `team_members`
      - `team_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `joined_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `team_id` (uuid, foreign key)
      - `image` (text)
      - `rules` (text)
      - `max_participants` (integer)
      - `field_type` (text)
      - `canceled` (boolean)
      - `created_at` (timestamp)
    
    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `message` (text)
      - `proof_image` (text)
      - `number_of_participants` (integer)
      - `created_at` (timestamp)
    
    - `marketplace_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `condition` (text)
      - `category` (text)
      - `images` (text[])
      - `seller_id` (uuid, foreign key)
      - `location` (text)
      - `is_trade_allowed` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS marketplace_items CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
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
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo text,
  created_at timestamptz DEFAULT now()
);

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

-- Team members table
CREATE TABLE team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Events table with explicit foreign key reference
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  image text,
  rules text,
  max_participants integer NOT NULL,
  field_type text NOT NULL,
  canceled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = events.team_id
      AND user_id = auth.uid()
    )
  );

-- Event registrations table
CREATE TABLE event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  message text,
  proof_image text,
  number_of_participants integer DEFAULT 1,
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
CREATE TABLE marketplace_items (
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