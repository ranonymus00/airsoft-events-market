import { CheckCircle, Clock, XCircle } from "lucide-react";
import { EventRegistration, User } from "../types";

export const getStatusDisplay = (status: string) => {
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

export const getParticipants = (
  registrations: EventRegistration[],
  max_participants: number
) => {
  return `${registrations
    ?.filter((registration) => registration.status === "accepted")
    .reduce(
      (sum, reg) => sum + (reg.number_of_participants || 1),
      0
    )} / ${max_participants} participants`;
};

export const getHostData = (user: User) => {
  if (user?.team?.id) {
    return {
      name: user.team.name,
      logo: user.team.logo,
    };
  } else {
    return {
      name: user.username,
      logo: user.avatar,
    };
  }
};
