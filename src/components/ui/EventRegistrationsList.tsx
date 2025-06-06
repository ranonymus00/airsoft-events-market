import React from "react";
import { EventRegistration } from "../../types";
import { CheckCircle, XCircle } from "lucide-react";
import { getStatusDisplay } from "../../utils/events";

interface EventRegistrationsListProps {
  registrations: EventRegistration[];
  onUpdateStatus: (
    registrationId: string,
    status: "accepted" | "declined"
  ) => void;
  isEventOwner: boolean;
}

const EventRegistrationsList: React.FC<EventRegistrationsListProps> = ({
  registrations,
  onUpdateStatus,
  isEventOwner,
}) => {
  return (
    <div className="space-y-4">
      {registrations.map((registration) => {
        const status = getStatusDisplay(registration.status);

        if (registration.status !== "accepted" && !isEventOwner) return <></>;

        return (
          <div
            key={registration.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={registration.user.avatar}
                  alt={registration.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-2">
                  <h4 className="font-medium text-gray-900">
                    {registration.user.username}
                    {registration.user.team
                      ? ` - ${registration.user.team.name}`
                      : ""}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Registered{" "}
                    {new Date(registration.created_at).toLocaleDateString()}
                    <span className="ml-1">
                      ({registration.number_of_participants} participants)
                    </span>
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${status.bgColor} ${status.textColor}`}
                  >
                    {status.text}
                  </span>
                </div>
              </div>

              {isEventOwner && registration.status === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpdateStatus(registration.id, "accepted")}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                    title="Accept registration"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onUpdateStatus(registration.id, "declined")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Decline registration"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {isEventOwner && (
              <>
                <div className="mt-3">
                  <p className="text-gray-700">{registration.message}</p>
                </div>

                <div className="mt-3">
                  <img
                    src={registration.proof_image}
                    alt="Proof of equipment/experience"
                    className="w-full max-w-md rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        );
      })}

      {registrations.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          {isEventOwner
            ? "No registrations yet"
            : "No confirmed participants yet"}
        </p>
      )}
    </div>
  );
};

export default EventRegistrationsList;
