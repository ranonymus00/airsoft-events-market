-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for events table
CREATE POLICY "Enable read access for all users" ON events
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON events
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Modified update policy with better error handling
CREATE POLICY "Enable update for event owners" ON events
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR auth.uid() IN (
            SELECT user_id FROM events WHERE id = events.id
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        OR auth.uid() IN (
            SELECT user_id FROM events WHERE id = events.id
        )
    );

CREATE POLICY "Enable delete for event owners" ON events
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for event_registrations table
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON event_registrations
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON event_registrations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for event owners" ON event_registrations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_registrations.event_id
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable delete for event owners" ON event_registrations
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_registrations.event_id
            AND events.user_id = auth.uid()
        )
    ); 