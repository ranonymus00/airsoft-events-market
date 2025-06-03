import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, Calendar, User, ChevronRight } from "lucide-react";
import { Event } from "../../../types";
import Button from "../../ui/Button";
import EmptySection from "../../ui/EmptySection";
import { getParticipants } from "../../../utils/events";

interface EventsTabProps {
  events: Event[];
  loading: boolean;
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  loading,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Button
          size="small"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={onCreateEvent}
        >
          Create Event
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full sm:w-40 h-32 object-cover rounded-md"
                />

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Team: {event.user?.username || event.user?.team?.name}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditEvent(event)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                      <span>
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1 text-orange-500" />
                      <span>
                        {getParticipants(
                          event.registrations,
                          event.max_participants
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Link to={`/events/${event.id}`}>
                      <Button
                        variant="link"
                        rightIcon={<ChevronRight className="h-5 w-5" />}
                      >
                        View details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptySection
          icon={<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
          title="No events found"
          description="You haven't created any events yet."
          buttonText="Create First Event"
          onButtonClick={onCreateEvent}
        />
      )}
    </div>
  );
};

export default EventsTab; 