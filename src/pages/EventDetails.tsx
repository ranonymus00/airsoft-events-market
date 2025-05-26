import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Info,
  AlertTriangle,
  ChevronLeft,
  Share2,
  Heart,
  User,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { mockEvents } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import EventRegistrationForm from "../components/ui/EventRegistrationForm";
import EventRegistrationStatus from "../components/ui/EventRegistrationStatus";
import EventRegistrationsList from "../components/ui/EventRegistrationsList";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find((event) => event.id === id);
  const { authState } = useAuth();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const userRegistration = event?.registrations.find(
    reg => reg.userId === authState.user?.id
  );

  const isEventOwner = authState.user?.team?.id === event?.team.id;

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6">
          The event you're looking for does not exist or has been removed.
        </p>
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

  const handleRegistrationSubmit = () => {
    setShowRegistrationForm(false);
    // Here you would typically refresh the event data
  };

  const handleUpdateRegistrationStatus = (registrationId: string, status: 'accepted' | 'declined') => {
    // Here you would typically make an API call to update the registration status
    console.log('Updating registration', registrationId, 'to', status);
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
        <div className="bg-white shadow-md rounded-lg -mt-20 relative z-10">
          {event.canceled && (
            <div className="bg-red-500 text-white text-center py-4 mb-4 rounded-md">
              <h2 className="text-2xl font-bold">
                This Event Has Been Canceled
              </h2>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  Hosted by{" "}
                  <span className="font-medium">{event.team.name}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: `Check out this airsoft event: ${event.title}`,
                        url: window.location.href,
                      });
                    }
                  }}
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
                  <p className="text-gray-700 mb-6 whitespace-pre-line">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-600">
                          {format(new Date(event.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-gray-600">
                          {event.startTime} - {event.endTime}
                        </p>
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
                      <Users className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Participants</p>
                        <p className="text-gray-600">
                          {event.participants.length} / {event.maxParticipants}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">
                    Rules & Requirements
                  </h2>
                  <div className="bg-gray-50 border-l-4 border-orange-500 p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {event.rules}
                    </p>
                  </div>
                </div>

                {/* Registrations List (for event owners) */}
                {isEventOwner && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Registrations</h2>
                    <EventRegistrationsList
                      registrations={event.registrations}
                      onUpdateStatus={handleUpdateRegistrationStatus}
                    />
                  </div>
                )}

                {/* Registration Form */}
                {showRegistrationForm && (
                  <EventRegistrationForm
                    eventId={event.id}
                    onSubmit={handleRegistrationSubmit}
                    onCancel={() => setShowRegistrationForm(false)}
                  />
                )}
              </div>

              <div>
                {/* Action Card */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                  <div className="mb-6">
                    {userRegistration ? (
                      <EventRegistrationStatus registration={userRegistration} />
                    ) : (
                      <button
                        onClick={() => setShowRegistrationForm(true)}
                        disabled={event.canceled || !authState.isAuthenticated}
                        className="w-full py-3 px-4 rounded-md font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Join Event
                      </button>
                    )}
                  </div>

                  {!authState.isAuthenticated && (
                    <div className="text-center text-sm text-gray-600">
                      <Link to="/login" className="text-orange-500 hover:text-orange-600">
                        Log in
                      </Link>{" "}
                      to join this event
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold mb-4">About the Host</h3>
                    <div className="flex items-start">
                      <img
                        src={event.team.logo}
                        alt={event.team.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{event.team.name}</h3>
                        <p className="text-gray-600 mb-2">
                          {event.team.members.length} members
                        </p>
                        <p className="text-gray-700">{event.team.description}</p>
                      </div>
                    </div>
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