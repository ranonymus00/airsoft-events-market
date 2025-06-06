import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Event } from "../../types";
import Button from "./Button";
import Modal from "./Modal";
import TextInput from "./TextInput";
import TextareaInput from "./TextareaInput";
import FileUpload from "./FileUpload";

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
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Register for Event"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Number of Participants"
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
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          How many people are you registering for this event?
        </p>

        <TextareaInput
          label="Message to Organizer"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          rows={4}
          placeholder="Introduce yourself and explain why you want to join this event..."
          required
        />

        <FileUpload
          label="Proof of Equipment/Experience"
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
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Upload a photo of your equipment or previous event participation
        </p>

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
    </Modal>
  );
};

export default EventRegistrationForm;