import React from "react";
import { Calendar, ShoppingBag, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardSidebarProps {
  activeTab: string;
  user: {
    username: string;
    email: string;
    avatar: string;
  };
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  user,
}) => {
  const tabs = [
    { id: "events", label: "My Events", icon: Calendar },
    { id: "marketplace", label: "My Listings", icon: ShoppingBag },
    { id: "team", label: "My Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <Link
                    to={`/dashboard/${tab.id}`}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
