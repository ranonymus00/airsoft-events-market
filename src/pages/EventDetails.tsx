import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, Info, AlertTriangle, 
  ChevronLeft, Share2, Heart, User, MessageSquare 
} from 'lucide-react';
import { format } from 'date-fns';
import { mockEvents } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find(event => event.id === id);
  const { authState } = useAuth();
  
  const [isJoined, setIsJoined] = useState(
    event?.participants.some(participant => participant.id === authState.user?.id)
  );

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for does not exist or has been removed.</p>
        <Link 
          to="/events" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Events
        </Link>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const canEdit = authState.user?.team?.id === event?.team.id;

  const handleJoin = () => {
    if (!authState.isAuthenticated) {
      alert('Please log in to join this event');
      return;
    }
    if (event.canceled) {
      alert('This event has been canceled');
      return;
    }
    setIsJoined(!isJoined);
  };

  const handleCancelEvent = () => {
    if (!canEdit) return;
    // Here you would typically make an API call to update the event
    // For now we'll just show an alert
    alert('Event canceled');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this airsoft event: ${event.title}`,
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      alert('Share functionality is not supported on this browser');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-4 left-4">
          <Link 
            to="/events" 
            className="inline-flex items-center bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {event.canceled && (
          <div className="bg-red-500 text-white text-center py-4 mb-4 rounded-md">
            <h2 className="text-2xl font-bold">This Event Has Been Canceled</h2>
          </div>
        )}
        {canEdit && (
          <div className="mb-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Edit Event
            </button>
            <button
              onClick={handleCancelEvent}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              {event.canceled ? 'Reactivate Event' : 'Cancel Event'}
            </button>
          </div>
        )}
        <div className="bg-white shadow-md rounded-lg -mt-20 relative z-10">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                <p className="text-gray-600 mb-4">Hosted by <span className="font-medium">{event.team.name}</span></p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {/* Event Details */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Event Details</h2>
                  <p className="text-gray-700 mb-6 whitespace-pre-line">{event.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-600">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>
                    
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-gray-600">{event.field}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Participants</p>
                        <p className="text-gray-600">{event.participants.length} / {event.maxParticipants}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rules */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Rules & Requirements</h2>
                  <div className="bg-gray-50 border-l-4 border-orange-500 p-4">
                    <p className="text-gray-700 whitespace-pre-line">{event.rules}</p>
                  </div>
                </div>
                
                {/* Host Information */}
                <div>
                  <h2 className="text-xl font-bold mb-4">About the Host</h2>
                  <div className="flex items-start">
                    <img 
                      src={event.team.logo} 
                      alt={event.team.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{event.team.name}</h3>
                      <p className="text-gray-600 mb-2">{event.team.members.length} members</p>
                      <p className="text-gray-700">{event.team.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                {/* Action Card */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                  <div className="mb-6">
                    <button
                      onClick={handleJoin}
                      className={`w-full py-3 px-4 rounded-md font-bold ${
                        isJoined 
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      } transition-colors duration-200`}
                    >
                      {isJoined ? 'Leave Event' : 'Join Event'}
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold mb-4">Participants ({event.participants.length})</h3>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {event.participants.map(participant => (
                        <div key={participant.id} className="flex items-center">
                          <img 
                            src={participant.avatar} 
                            alt={participant.username}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <span className="text-gray-800">{participant.username}</span>
                        </div>
                      ))}
                    </div>
                    
                    {event.participants.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No participants yet</p>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Questions?</h3>
                      {authState.isAuthenticated && (
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                          Contact Host
                        </button>
                      )}
                    </div>
                    
                    {!authState.isAuthenticated && (
                      <Link 
                        to="/login" 
                        className="flex items-center justify-center space-x-1 w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>Login to Contact Host</span>
                      </Link>
                    )}
                    
                    {authState.isAuthenticated && (
                      <button className="flex items-center justify-center space-x-1 w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        <MessageSquare className="h-4 w-4" />
                        <span>Send Message</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;