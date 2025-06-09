import { CheckCircle, Clock, XCircle } from "lucide-react";
import { EventRegistration, User } from "../types";

// Returns icon and display info for a given registration status
export const getStatusDisplay = (status: string): {
  icon: JSX.Element;
  text: string;
  bgColor: string;
  textColor: string;
} => {
  switch (status) {
    case "accepted":
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: "Accepted",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      };
    case "declined":
      return {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        text: "Declined",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
      };
    default:
      return {
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        text: "Pending",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
      };
  }
};

// Returns a string like 'X / Y participants' for accepted registrations
export const getParticipants = (
  registrations: EventRegistration[],
  max_participants: number
): string => {
  const accepted = registrations?.filter((registration) => registration.status === "accepted") ?? [];
  const count = accepted.reduce((sum, reg) => sum + (reg.number_of_participants ?? 1), 0);
  return `${count} / ${max_participants ?? 0} participants`;
};

// Returns host display name and logo, prioritizing team if available
export const getHostData = (user: User): { name: string; logo: string } => {
  if (user?.team?.id) {
    return {
      name: user.team.name ?? '',
      logo: user.team.logo ?? '',
    };
  }
  return {
    name: user.username ?? '',
    logo: user.avatar ?? '',
  };
};
