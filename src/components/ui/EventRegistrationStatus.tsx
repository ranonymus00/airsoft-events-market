import React from "react";
import { EventRegistration } from "../../types";
import { getStatusDisplay } from "../../utils/events";

interface EventRegistrationStatusProps {
  registration: EventRegistration;
}

const EventRegistrationStatus: React.FC<EventRegistrationStatusProps> = ({
  registration,
}) => {
  const status = getStatusDisplay(registration.status);

  return (
    <div className={`flex items-center ${status.bgColor} p-2 rounded-md`}>
      {status.icon}
      <span className={`ml-2 font-medium ${status.textColor}`}>
        {status.text}
      </span>
    </div>
  );
};

export default EventRegistrationStatus;
