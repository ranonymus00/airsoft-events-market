import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventCard from './EventCard';
import { Event } from '../../types';

const mockEvent: Event = {
  id: 'test-event-1',
  title: 'Test Event',
  description: 'A test event description',
  location: 'Test Location',
  date: '2025-08-15',
  startTime: '09:00',
  endTime: '17:00',
  team: {
    id: 'team-1',
    name: 'Test Team',
    description: 'Test team description',
    logo: 'test-logo.jpg',
    members: [],
    events: [],
    created_at: '2024-03-15',
  },
  image: 'test-image.jpg',
  rules: 'Test rules',
  maxParticipants: 20,
  participants: [],
  created_at: '2024-03-15',
  field_type: 'CQB'
};

describe('EventCard', () => {
  const renderEventCard = () => {
    return render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    );
  };

  it('renders event title', () => {
    renderEventCard();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders event location', () => {
    renderEventCard();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('renders event date', () => {
    renderEventCard();
    expect(screen.getByText('August 15, 2025')).toBeInTheDocument();
  });

  it('renders event time', () => {
    renderEventCard();
    expect(screen.getByText('09:00 - 17:00')).toBeInTheDocument();
  });

  it('renders participants count', () => {
    renderEventCard();
    expect(screen.getByText('0 / 20 participants')).toBeInTheDocument();
  });

  it('renders team name', () => {
    renderEventCard();
    expect(screen.getByText('Hosted by Test Team')).toBeInTheDocument();
  });

  it('renders field type', () => {
    renderEventCard();
    expect(screen.getByText('CQB')).toBeInTheDocument();
  });
});