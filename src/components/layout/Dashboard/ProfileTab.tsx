import React from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle } from "lucide-react";
import { Team, Event } from "../../../types";
import { MarketplaceItem } from "../../../types/dashboard";
import Button from "../../ui/Button";

interface ProfileTabProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  teams: Team[];
  loading: boolean;
  userEvents: Event[];
  userItems: MarketplaceItem[];
  userTeam?: { name: string };
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  searchTerm,
  onSearchChange,
  teams,
  loading,
  userEvents,
  userItems,
  userTeam,
}) => {
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Teams</h3>
          {!userTeam && (
            <Link to={"/create-team"}>
              <Button size="small" leftIcon={<PlusCircle className="h-5 w-5" />}>
                Create Team
              </Button>
            </Link>
          )}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg">{team.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {team.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {team.members.length} members
                    </p>
                  </div>
                  {!userTeam && (
                    <Button size="small">Join Team</Button>
                  )}
                </div>
              </div>
            ))}

            {filteredTeams.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  No teams found matching your search
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="font-bold text-lg mb-4">Activity Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Events Participation</p>
            <p className="text-2xl font-bold text-gray-800">
              {userEvents.length}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold text-gray-800">
              {userItems.length}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Team Status</p>
            <p className="text-2xl font-bold text-gray-800">
              {userTeam ? "Member" : "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab; 