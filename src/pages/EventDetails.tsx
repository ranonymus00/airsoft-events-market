import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ChevronLeft,
  Share2,
  User,
  Edit,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import EventRegistrationForm from "../components/ui/EventRegistrationForm";
import EventRegistrationStatus from "../components/ui/EventRegistrationStatus";
import EventRegistrationsList from "../components/ui/EventRegistrationsList";
import { api } from "../lib/api";
import { Event, TeamMap } from "../types";
import Button from "../components/ui/Button";
import { getHostData, getParticipants } from "../utils/events";
import AdSpace from "../components/ui/AdSpace";
import CreateEventForm from "../components/ui/CreateEventForm";
import ImageSlider from "../components/ui/ImageSlider";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;

    try {
      const data = await api.events.getById(id);
      setEvent(data);
    } catch (err) {
      setError("Failed to load event");
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (
    message: string,
    proofImage: string,
    numberOfParticipants: number
  ) => {
    if (!event) return;

    try {
      await api.events.register(
        event.id,
        message,
        proofImage,
        numberOfParticipants
      );
      await loadEvent();
      setShowRegistrationForm(false);
    } catch (err) {
      console.error("Error submitting registration:", err);
    }
  };

  const handleUpdateRegistrationStatus = async (
    registrationId: string,
    status: "accepted" | "declined"
  ) => {
    try {
      await api.events.updateRegistrationStatus(registrationId, status);
      await loadEvent();
    } catch (err) {
      console.error("Error updating registration status:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !event) {
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

  const userRegistration = event.registrations?.find(
    (reg) => reg.user.id === authState.user?.id
  );

  const isEventOwner =
    authState.isAuthenticated && authState.user?.id === event.user_id;
  const isTeamMember =
    authState.user?.team?.id &&
    event.user?.team?.id &&
    authState.user?.team?.id === event.user?.team?.id;
  const canRegister =
    !event.canceled &&
    authState.isAuthenticated &&
    !isEventOwner &&
    !isTeamMember &&
    !userRegistration;

  const hostInfo = getHostData(event.user);

  // Map details section
  const renderMapSection = () => {
    if (!event?.map) return null;
    const map: TeamMap = event.map;
    return (
      <div className="prose max-w-none mb-8 border-t pt-6 mt-6">
        <h2 className="text-xl font-bold mb-2">Field Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Name:</span> {map.name}
            </p>
            <p>
              <span className="font-semibold">Field Type:</span>{" "}
              {map.field_type}
            </p>
            <p>
              <span className="font-semibold">Location:</span>
              <a
                href={map.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {map.location}
              </a>
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {map.description}
            </p>
          </div>
          {map.photos && map.photos.length > 0 && (
            <div>
              <ImageSlider images={map.photos} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/events"
          className="inline-flex items-center text-orange-500 hover:text-orange-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64 md:h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.canceled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-2xl font-bold">
                Event Canceled
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative inline-block">
                      <img
                        src={hostInfo.logo}
                        alt={hostInfo.name}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    </div>

                    <div className="text-gray-600">
                      <span className="flex items-center">
                        <User className="h-5 w-5 mr-1" />
                        Hosted by {hostInfo.name}
                      </span>
                      <span className="text-sm">
                        {getParticipants(
                          event.registrations,
                          event.max_participants
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Share2 className="h-5 w-5" />
                  </button>
                  {isEventOwner && (
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  <span>
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
                {/* Map location and link removed, now shown in map section below */}
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-bold mb-2">Rules</h2>
                <p className="text-gray-600">{event.rules}</p>
              </div>

              {renderMapSection()}

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Registrations</h2>
                </div>

                {userRegistration && (
                  <div className="mb-4">
                    <EventRegistrationStatus registration={userRegistration} />
                  </div>
                )}

                {canRegister && (
                  <Button
                    onClick={() => setShowRegistrationForm(true)}
                    className="w-full"
                  >
                    Join Event
                  </Button>
                )}

                <EventRegistrationsList
                  registrations={event.registrations}
                  onUpdateStatus={handleUpdateRegistrationStatus}
                  isEventOwner={isEventOwner}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AdSpace
              width="100%"
              height="600px"
              className="rounded-lg sticky top-24"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <AdSpace width="100%" height="90px" className="rounded-lg" />
      </div>

      {showRegistrationForm && (
        <EventRegistrationForm
          event={event}
          onSubmit={handleRegistrationSubmit}
          onCancel={() => setShowRegistrationForm(false)}
        />
      )}

      {showEditForm && (
        <CreateEventForm onClose={() => setShowEditForm(false)} event={event} />
      )}
    </div>
  );
};

export default EventDetails;
