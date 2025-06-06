import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Event } from "../../types";
import Button from "./Button";

interface EventFormData {
  message: string;
  proofImage: string;
  numberOfParticipants: number;
}

interface EventRegistrationFormProps {
  onSubmit:
    | ((
        message: string,
        proofImage: string,
        numberOfParticipants: number
      ) => void)
    | ((formData: EventFormData) => void);
  onCancel: () => void;
  event?: Event;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  onSubmit,
  onCancel,
  event,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    message: "",
    proofImage: "",
    numberOfParticipants: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) return;

    setIsSubmitting(true);

    try {
      (
        onSubmit as (
          message: string,
          proofImage: string,
          numberOfParticipants: number
        ) => void
      )(formData.message, formData.proofImage, formData.numberOfParticipants);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full h-[90dvh] overflow-auto mx-4 shadow-md">
        <h3 className="text-xl font-bold mb-4">Register for Event</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Participants
            </label>
            <input
              type="number"
              min="1"
              max={event?.max_participants}
              value={formData.numberOfParticipants}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numberOfParticipants: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              How many people are you registering for this event?
            </p>
          </div>

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
              Upload a photo of your equipment or previous event participation
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="cancel"
              size="small"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button size="small" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
