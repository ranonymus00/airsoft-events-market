import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Event } from "../../types";
import Button from "./Button";
import { getHostData, getParticipants } from "../../utils/events";

interface EventCardProps {
  event: Event;
}

/**
 * Card component for displaying a summary of an event.
 * Optimized with React.memo for performance.
 */
const EventCard: React.FC<EventCardProps> = React.memo(({ event }) => {
  return (
    <Link
      to={`/events/${event.id}`}
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative ${
        event.canceled ? "opacity-75" : ""
      }`}
    >
      {event.canceled && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full transform rotate-45 text-lg font-bold">
            CANCELED
          </div>
        </div>
      )}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title || "Event image"}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold truncate">
            {event.title}
          </h3>
          <p className="text-white/90 text-sm">
            Hosted by {getHostData(event.user).name}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">
            {event.start_time} - {event.end_time}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm truncate">
            {event.map
              ? `${event.map?.name} - ${event.map?.field_type}`
              : "No map"}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-sm">
            {getParticipants(event.registrations, event.max_participants)}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Button is for navigation, so ensure semantics are clear */}
          <Button
            size="small"
            className="w-full"
            aria-label="View event details"
          >
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
});

export default EventCard;
