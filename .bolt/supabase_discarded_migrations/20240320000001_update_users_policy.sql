-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Enable public read access for users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Users can create their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can read event registrations" ON event_registrations;
DROP POLICY IF EXISTS "Enable read access for event registrations" ON event_registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON event_registrations;

-- Create new policies that allow anonymous access
CREATE POLICY "Enable anonymous read access for users"
ON users
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Enable anonymous read access for events"
ON events
FOR SELECT
TO anon, authenticated
USING (true);

-- Event registrations policies
CREATE POLICY "Enable read access for event registrations"
ON event_registrations
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON event_registrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update the events table to ensure user_id is properly referenced
ALTER TABLE events
DROP CONSTRAINT IF EXISTS events_user_id_fkey,
ADD CONSTRAINT events_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

-- Update event_registrations table to ensure proper foreign key
ALTER TABLE event_registrations
DROP CONSTRAINT IF EXISTS event_registrations_user_id_fkey,
ADD CONSTRAINT event_registrations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE; 