import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Event, TeamMap } from "../../types";
import { api } from "../../lib/api";
import Button from "./Button";

interface CreateEventFormProps {
  onClose: () => void;
  event?: Event; // Optional event for edit mode
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onClose,
  event,
}) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    map_id: event?.map_id || "",
    date: event?.date || "",
    start_time: event?.start_time || "",
    end_time: event?.end_time || "",
    image: event?.image || "",
    rules: event?.rules || "",
    max_participants: event?.max_participants || 20,
  });
  const [teamMaps, setTeamMaps] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (authState.user?.team?.id) {
      api.teamMaps.getByTeam(authState.user.team.id).then((maps: TeamMap[]) => {
        setTeamMaps(maps.map((m) => ({ id: m.id, name: m.name })));
      });
    }
  }, [authState.user?.team?.id]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        map_id: event.map_id || "",
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        image: event.image,
        rules: event.rules,
        max_participants: event.max_participants,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) {
      alert("You must be logged in to create or edit an event");
      return;
    }
    if (event) {
      // Edit mode
      await api.events.update(event.id, {
        ...formData,
        user_id: authState.user.id,
      });
      onClose();
    } else {
      // Create mode
      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...formData,
        user_id: authState.user.id,
        user: authState.user,
        participants: [],
        registrations: [],
        created_at: new Date().toISOString(),
        canceled: false,
      };
      // Here you would typically make an API call to save the event
      // For now, we'll just navigate to the event page
      navigate(`/events/${newEvent.id}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-2xl w-full mx-4 overflow-auto h-[90dvh]">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">
            {event ? "Edit Event" : "Create New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      end_time: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Map
              </label>
              <select
                required
                value={formData.map_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, map_id: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a map</option>
                {teamMaps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rules
              </label>
              <textarea
                required
                value={formData.rules}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rules: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.max_participants}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    max_participants: parseInt(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="cancel" size="small" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="small">
                {event ? "Save Changes" : "Create Event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
