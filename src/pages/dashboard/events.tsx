import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Calendar, User, ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import EmptySection from "../../components/ui/EmptySection";
import { getHostData, getParticipants } from "../../utils/events";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

import { useAuth } from "../../contexts/AuthContext";
import DashboardSidebar from "../../components/ui/DashboardSidebar";

const EventsPage: React.FC = () => {
  const { authState } = useAuth();
  const [events, setEvents] = React.useState<any[]>([]); // Use correct Event type if imported
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadUserEvents = React.useCallback(async () => {
    if (!authState?.user?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const allEvents = await ((window as any).api?.events?.getAll?.() ?? []);
      const filtered = allEvents.filter(
        (event: any) => event.user_id === authState.user.id
      );
      setEvents(filtered);
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [authState?.user?.id]);

  React.useEffect(() => {
    loadUserEvents();
  }, [loadUserEvents]);

  const handleEditEvent = React.useCallback((_event: any) => {
    // Future: Implement edit event modal/logic
    alert("Edit event not yet implemented");
  }, []);

  const handleDeleteEvent = React.useCallback(
    async (eventId: string) => {
      if (!window.confirm("Are you sure you want to delete this event?"))
        return;
      try {
        await (window as any).api?.events?.update?.(eventId, { deleted: true });
        await loadUserEvents();
      } catch {
        alert("Failed to delete event. Please try again.");
      }
    },
    [loadUserEvents]
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">
            Manage your profile, events, and marketplace items
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DashboardSidebar
            activeTab={"events"}
            user={authState.user}
          />

          <div className="lg:col-span-3">
            <Section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Events</h2>
                {/* Future: Add Create Event button/modal here */}
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id}>
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
                                Hosted by:{" "}
                                {event.user
                                  ? getHostData(event.user).name
                                  : "Unknown"}
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
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
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={
                    <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  }
                  title="No events yet"
                  description="You haven't created any events yet."
                  buttonText="Create Event"
                  onButtonClick={() => {}}
                />
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
