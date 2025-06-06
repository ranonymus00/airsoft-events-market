-- Add team_maps table for storing maps owned by teams
CREATE TABLE team_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  location text,
  google_maps_link text,
  field_type text,
  photos text[],
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by team
CREATE INDEX idx_team_maps_team_id ON team_maps(team_id);

-- Enable RLS
ALTER TABLE team_maps ENABLE ROW LEVEL SECURITY;

-- Allow team members to read maps
CREATE POLICY "Team members can read team maps" ON team_maps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_maps.team_id
      AND user_id = auth.uid()
    )
  );

-- Allow team members to insert/update/delete their own maps
CREATE POLICY "Team members can manage team maps" ON team_maps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_id = team_maps.team_id
      AND user_id = auth.uid()
    )
  );
