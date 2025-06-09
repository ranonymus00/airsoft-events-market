-- Insert sample events with varied content
INSERT INTO events (
  title,
  description,
  location,
  date,
  start_time,
  end_time,
  user_id,
  image,
  rules,
  max_participants,
  field_type,
  canceled
) VALUES
-- Event 1: Detailed CQB event
(
  'Urban Warfare CQB Tournament',
  'Join us for an intense CQB tournament in our urban warfare facility. This event features multiple game modes including Team Deathmatch, Capture the Flag, and Search & Destroy. The facility includes a 3-story building with multiple entry points, tight corridors, and strategic positions. Perfect for players who enjoy fast-paced, close-quarters combat. Bring your CQB-appropriate gear and be ready for intense action!',
  'Urban Combat Center, Lisbon',
  '2024-04-15',
  '09:00',
  '17:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/cqb-event.jpg',
  '1. FPS limit: 350 for AEGs, 400 for DMRs\n2. Eye protection mandatory\n3. Minimum age: 16\n4. No full-auto in buildings\n5. Bang rule in effect',
  24,
  'CQB',
  false
),

-- Event 2: Simple outdoor event
(
  'Weekend Woodland Skirmish',
  'Casual woodland game. Bring your gear and join the fun!',
  'Forest Field, Porto',
  '2024-04-20',
  '10:00',
  '16:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/woodland.jpg',
  'Standard safety rules apply',
  40,
  'Mato',
  false
),

-- Event 3: Mixed terrain event
(
  'Urban-Forest Hybrid Game',
  'Experience the best of both worlds in our unique urban-forest hybrid field. The field features a mix of dense woodland areas and urban structures, perfect for players who enjoy both long-range engagements and close-quarters combat. The terrain includes natural cover, man-made structures, and strategic positions that will test your tactical skills.',
  'Hybrid Field Complex, Braga',
  '2024-04-25',
  '09:30',
  '17:30',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/hybrid-field.jpg',
  '1. FPS limit: 400 for AEGs\n2. Eye and face protection required\n3. No full-auto in buildings\n4. Minimum engagement distance: 10m for DMRs',
  32,
  'Misto',
  false
),

-- Event 4: Night game
(
  'Night Ops CQB',
  'Night operations in our CQB facility. Bring your night vision or flashlights!',
  'Night Combat Center, Faro',
  '2024-05-01',
  '20:00',
  '23:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/night-game.jpg',
  '1. Red light only\n2. No white light\n3. Eye protection mandatory',
  16,
  'CQB',
  false
),

-- Event 5: Large outdoor event
(
  'Summer Airsoft Festival',
  'Join us for our biggest event of the year! A full day of airsoft action featuring multiple game modes, food vendors, and gear demonstrations. The field includes various terrain types, from open fields to dense woodland areas, perfect for all play styles. Special guest instructors will be present for training sessions.',
  'Mega Field Complex, Coimbra',
  '2024-05-15',
  '08:00',
  '18:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/summer-fest.jpg',
  '1. FPS limit: 400 for AEGs, 450 for DMRs\n2. Full face protection required\n3. Minimum age: 16\n4. No full-auto in buildings\n5. Bang rule in effect\n6. Bring your own food and water',
  100,
  'Misto',
  false
),

-- Event 6: Team training
(
  'Team Training Day',
  'Structured training day for teams. Focus on tactics and coordination.',
  'Training Ground, Aveiro',
  '2024-05-20',
  '09:00',
  '15:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/training.jpg',
  'Team registration required',
  20,
  'Mato',
  false
),

-- Event 7: Detailed CQB scenario
(
  'Hostage Rescue Operation',
  'Intense CQB scenario game. Rescue the hostages and eliminate the threat!',
  'Urban Training Center, Setúbal',
  '2024-05-25',
  '10:00',
  '16:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/hostage.jpg',
  '1. FPS limit: 350\n2. Full face protection\n3. No full-auto\n4. Scenario rules will be briefed',
  30,
  'CQB',
  false
),

-- Event 8: Simple woodland game
(
  'Forest Patrol',
  'Basic woodland game. Perfect for beginners!',
  'Woodland Field, Viseu',
  '2024-06-01',
  '10:00',
  '15:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/forest.jpg',
  'Standard safety rules',
  25,
  'Mato',
  false
),

-- Event 9: Mixed terrain tournament
(
  'Tactical Challenge Cup',
  'Competitive tournament across multiple terrain types. Prizes for top teams!',
  'Challenge Field, Leiria',
  '2024-06-10',
  '09:00',
  '18:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/tournament.jpg',
  '1. Team registration required\n2. FPS limit: 400\n3. Full face protection\n4. Tournament rules will be provided',
  48,
  'Misto',
  false
),

-- Event 10: Canceled event
(
  'Winter Airsoft Challenge',
  'Annual winter event with special scenarios and challenges.',
  'Winter Field, Guarda',
  '2024-06-15',
  '09:00',
  '16:00',
  (SELECT id FROM users LIMIT 1),
  'https://example.com/winter.jpg',
  '1. Cold weather gear recommended\n2. FPS limit: 400\n3. Full face protection required',
  35,
  'Misto',
  true
); 