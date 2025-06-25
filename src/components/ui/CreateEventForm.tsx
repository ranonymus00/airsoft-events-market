import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Event, TeamMap } from "../../types";
import { api } from "../../lib/api";
import Button from "./Button";
import Modal from "./Modal";
import TextInput from "./TextInput";
import TextareaInput from "./TextareaInput";
import SelectInput from "./SelectInput";
import FileUpload from "./FileUpload";
import { uploadFilesBatch } from "../../lib/upload";

interface CreateEventFormProps {
  onClose: () => void;
  event?: Event & { imageFile?: File }; // Optional event for edit mode
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onClose,
  event,
}) => {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [teamMaps, setTeamMaps] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (authState.user?.team?.id) {
      api.teamMaps.getByTeam(authState.user.team.id).then((maps: TeamMap[]) => {
        setTeamMaps(maps.map((m) => ({ id: m.id, name: m.name })));
      });
    }
  }, [authState.user?.team?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) {
      alert("You must be logged in to create or edit an event");
      return;
    }
    let imageUrl = event?.image || "";
    if (imageFile) {
      try {
        const [url] = await uploadFilesBatch([imageFile], "events", "images");
        imageUrl = url;
      } catch {
        alert("Failed to upload event image. Please try again.");
        return;
      }
    }

    if (event) {
      try {
        // Edit mode
        await api.events.update(event.id, {
          ...formData,
          image: imageUrl,
          user_id: authState.user.id,
        });
        onClose();
      } catch (err) {
        alert("Failed to edit the event. Please try again.");
        console.log("Failed to edit the event. Please try again.", err);
        return;
      }
    } else {
      try {
        // Create mode
        const newEvent: Partial<Event> = {
          id: crypto.randomUUID(),
          ...formData,
          image: imageUrl,
          user_id: authState.user.id,
          created_at: new Date().toISOString(),
          canceled: false,
        };
        await api.events.create(newEvent);
        onClose();
      } catch (err) {
        alert("Failed to edit the event. Please try again.");
        console.log("Failed to edit the event. Please try again.", err);
        return;
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={event ? "Edit Event" : "Create New Event"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <TextareaInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Start Time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="End Time"
            name="end_time"
            type="time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <SelectInput
          label="Map"
          name="map_id"
          value={formData.map_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a map</option>
          {teamMaps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </SelectInput>

        <FileUpload
          label="Event Image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({
                ...prev,
                image: URL.createObjectURL(file),
              }));
              setImageFile(file);
            }
          }}
          className="w-full p-2 border rounded"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Event Preview"
            className="mx-auto mt-2 w-32 h-32 object-cover rounded border"
          />
        )}

        <TextareaInput
          label="Rules"
          name="rules"
          value={formData.rules}
          onChange={handleInputChange}
          rows={4}
          required
        />

        <TextInput
          label="Max Participants"
          name="max_participants"
          type="number"
          min="1"
          value={formData.max_participants}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              max_participants: parseInt(e.target.value),
            }))
          }
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="cancel" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="small">
            {event ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventForm;
