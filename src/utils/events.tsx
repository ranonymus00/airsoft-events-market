import { CheckCircle, Clock, XCircle } from "lucide-react";

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
