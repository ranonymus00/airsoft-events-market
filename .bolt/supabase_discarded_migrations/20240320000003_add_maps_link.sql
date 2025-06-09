-- Add maps_link column to events table
ALTER TABLE events
ADD COLUMN maps_link TEXT;

-- Update existing events with Google Maps links based on their locations
UPDATE events
SET maps_link = CASE
    WHEN location LIKE '%Lisbon%' THEN 'https://maps.google.com/?q=Lisbon,Portugal'
    WHEN location LIKE '%Porto%' THEN 'https://maps.google.com/?q=Porto,Portugal'
    WHEN location LIKE '%Braga%' THEN 'https://maps.google.com/?q=Braga,Portugal'
    WHEN location LIKE '%Faro%' THEN 'https://maps.google.com/?q=Faro,Portugal'
    WHEN location LIKE '%Coimbra%' THEN 'https://maps.google.com/?q=Coimbra,Portugal'
    WHEN location LIKE '%Aveiro%' THEN 'https://maps.google.com/?q=Aveiro,Portugal'
    WHEN location LIKE '%Setúbal%' THEN 'https://maps.google.com/?q=Setubal,Portugal'
    WHEN location LIKE '%Viseu%' THEN 'https://maps.google.com/?q=Viseu,Portugal'
    WHEN location LIKE '%Leiria%' THEN 'https://maps.google.com/?q=Leiria,Portugal'
    WHEN location LIKE '%Guarda%' THEN 'https://maps.google.com/?q=Guarda,Portugal'
    ELSE 'https://maps.google.com/?q=Portugal'
END; 