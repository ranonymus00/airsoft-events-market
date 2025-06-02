import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Event } from "../../types";

interface EventFormData {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  rules: string;
  max_participants: number;
  field: "Mato" | "CQB" | "Misto";
}

interface EventRegistrationFormProps {
  onSubmit:
    | ((message: string, proofImage: string) => void)
    | ((formData: EventFormData) => void);
  onCancel: () => void;
  mode?: "create" | "edit";
  event?: Event;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  mode = "create",
  event,
}) => {
  const [formData, setFormData] = useState<
    EventFormData & { message: string; proofImage: string }
  >({
    title: "",
    description: "",
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    image: "",
    rules: "",
    max_participants: 20,
    field: "Mato",
    message: "",
    proofImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  useEffect(() => {
    if (mode === "edit" && event) {
      setFormData({
        ...event,
        message: "",
        proofImage: "",
      });
    }
  }, [mode, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) return;

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        (onSubmit as (message: string, proofImage: string) => void)(
          formData.message,
          formData.proofImage
        );
      } else {
        (onSubmit as (formData: EventFormData) => void)(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full h-[90dvh] overflow-auto mx-4 shadow-md">
        <h3 className="text-xl font-bold mb-4">
          {mode === "create" ? "Register for Event" : "Edit Event"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "edit" && (
            <>
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
                    Field Type
                  </label>
                  <select
                    value={formData.field}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        field: e.target.value as "Mato" | "CQB" | "Misto",
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
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
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
            </>
          )}

          {mode === "create" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message to Organizer
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Introduce yourself and explain why you want to join this event..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proof of Equipment/Experience
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        proofImage: imageUrl,
                      }));
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a photo of your equipment or previous event
                  participation
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : mode === "create"
                ? "Submit Registration"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
