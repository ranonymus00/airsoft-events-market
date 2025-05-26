import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { EventRegistration } from '../../types';

interface EventRegistrationStatusProps {
  registration: EventRegistration;
}

const EventRegistrationStatus: React.FC<EventRegistrationStatusProps> = ({ registration }) => {
  const getStatusDisplay = () => {
    switch (registration.status) {
      case 'accepted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: 'Accepted',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700'
        };
      case 'declined':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          text: 'Declined',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          text: 'Pending',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={`flex items-center ${status.bgColor} p-2 rounded-md`}>
      {status.icon}
      <span className={`ml-2 font-medium ${status.textColor}`}>{status.text}</span>
    </div>
  );
};

export default EventRegistrationStatus