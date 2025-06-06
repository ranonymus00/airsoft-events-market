-- Migration: Remove field_type and location from events, add map_id referencing team_maps, and enforce ownership

-- Remove old columns
ALTER TABLE events DROP COLUMN IF EXISTS field_type;
ALTER TABLE events DROP COLUMN IF EXISTS location;
ALTER TABLE events DROP COLUMN IF EXISTS maps_link;

-- Add map_id referencing team_maps
ALTER TABLE events ADD COLUMN map_id uuid REFERENCES team_maps(id) ON DELETE SET NULL;

-- Optional: If you want to enforce that only the event owner's team maps can be used, you must do this in the API/business logic, as Postgres cannot join across users easily in a foreign key.

-- Update RLS: Only allow inserting/updating events with map_id belonging to a map owned by the user's team
DROP POLICY IF EXISTS "Team members can insert events" ON events;
CREATE POLICY "Team members can insert events" ON events
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN team_maps m ON m.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND m.id = events.map_id
    )
  );

DROP POLICY IF EXISTS "Team members can update events" ON events;
CREATE POLICY "Team members can update events" ON events
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN team_maps m ON m.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND m.id = events.map_id
    )
  );

-- Allow reading as before
