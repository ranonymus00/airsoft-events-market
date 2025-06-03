import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Event } from "../../types";
import Button from "./Button";

interface CreateEventFormProps {
  onClose: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    maps_link: "",
    date: "",
    start_time: "",
    end_time: "",
    image: "",
    rules: "",
    max_participants: 20,
    field_type: "Mato" as "Mato" | "CQB" | "Misto",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authState.user) {
      alert("You must be logged in to create an event");
      return;
    }

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
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

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
              setFormData((prev) => ({ ...prev, description: e.target.value }))
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
              Field Type
            </label>
            <select
              value={formData.field_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  field_type: e.target.value as "Mato" | "CQB" | "Misto",
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Mato">Mato</option>
              <option value="CQB">CQB</option>
              <option value="Misto">Misto</option>
            </select>
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
                setFormData((prev) => ({ ...prev, start_time: e.target.value }))
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
                setFormData((prev) => ({ ...prev, end_time: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps Link
          </label>
          <input
            type="url"
            required
            value={formData.maps_link}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, maps_link: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://maps.google.com/..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Add a Google Maps link to help participants find the exact location
          </p>
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
          <Button type="submit" size="small">Create Event</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
