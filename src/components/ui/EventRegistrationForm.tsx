import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface EventRegistrationFormProps {
  eventId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  onSubmit,
  onCancel
}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user) return;

    setIsSubmitting(true);
    
    try {
      // Here you would typically upload the image to storage and create the registration
      // For demo purposes, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit();
    } catch (error) {
      console.error('Error submitting registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Register for Event</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message to Organizer
          </label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            rows={4}
            placeholder="Introduce yourself and explain why you want to join this event..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof of Equipment/Experience
          </label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload a photo of your equipment or previous event participation
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm