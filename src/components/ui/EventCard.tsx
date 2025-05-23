import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Trees, Building2, Map } from 'lucide-react';
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getFieldIcon = () => {
    switch (event.field) {
      case 'Mato':
        return <Trees className="h-4 w-4 mr-2 text-orange-500" />;
      case 'CQB':
        return <Building2 className="h-4 w-4 mr-2 text-orange-500" />;
      case 'Misto':
        return <Map className="h-4 w-4 mr-2 text-orange-500" />;
    }
  };

  return (
    <Link 
      to={`/events/${event.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold truncate">{event.title}</h3>
          <p className="text-white/90 text-sm">
            Hosted by {event.team.name}
          </p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">{format(new Date(event.date), 'MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">{event.startTime} - {event.endTime}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm truncate">{event.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">{event.participants.length} / {event.maxParticipants} participants</span>
        </div>

        <div className="flex items-center text-gray-600">
          {getFieldIcon()}
          <span className="text-sm">{event.field}</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="bg-orange-500 text-white py-2 px-4 rounded-md text-center text-sm font-medium hover:bg-orange-600 transition-colors duration-200">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;