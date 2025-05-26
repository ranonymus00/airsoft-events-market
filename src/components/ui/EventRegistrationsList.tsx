import React from 'react';
import { EventRegistration } from '../../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

interface EventRegistrationsListProps {
  registrations: EventRegistration[];
  onUpdateStatus: (registrationId: string, status: 'accepted' | 'declined') => void;
}

const EventRegistrationsList: React.FC<EventRegistrationsListProps> = ({
  registrations,
  onUpdateStatus
}) => {
  return (
    <div className="space-y-4">
      {registrations.map(registration => (
        <div key={registration.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img
                src={registration.user.avatar}
                alt={registration.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">{registration.user.username}</h4>
                <p className="text-sm text-gray-500">
                  Registered {format(new Date(registration.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            {registration.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdateStatus(registration.id, 'accepted')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                  title="Accept registration"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onUpdateStatus(registration.id, 'declined')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Decline registration"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <p className="text-gray-700">{registration.message}</p>
          </div>

          <div className="mt-3">
            <img
              src={registration.proofImage}
              alt="Proof of equipment/experience"
              className="w-full max-w-md rounded-lg"
            />
          </div>
        </div>
      ))}

      {registrations.length === 0 && (
        <p className="text-center text-gray-500 py-8">No registrations yet</p>
      )}
    </div>
  );
};

export default EventRegistrationsList