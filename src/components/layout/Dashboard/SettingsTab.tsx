import React from "react";
import { Edit, AlertTriangle } from "lucide-react";
import Button from "../../ui/Button";

interface SettingsTabProps {
  user: {
    username: string;
    email: string;
    avatar: string;
  };
  profileForm: {
    email: string;
    username: string;
  };
  previewUrl: string | null;
  error: string | null;
  onAvatarClick: () => void;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveChanges: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  profileForm,
  previewUrl,
  error,
  onAvatarClick,
  onProfileChange,
  onSaveChanges,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-8">
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <div className="relative inline-block mb-4">
            <img
              src={previewUrl || user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover"
            />
            <button
              onClick={onAvatarClick}
              className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={onProfileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={onProfileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button size="small" onClick={onSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4">Password</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button size="small">Update Password</Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Email notifications for new event invitations
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Email notifications for messages
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Email notifications for marketplace inquiries
              </span>
            </label>
          </div>
          <div className="mt-4">
            <Button size="small">Save Preferences</Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Danger Zone
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-700">Delete Account</h4>
                <p className="text-red-600 text-sm mt-1">
                  Once you delete your account, there is no going back. Please be
                  certain.
                </p>
                <button className="mt-4 bg-white border border-red-500 text-red-600 hover:bg-red-50 py-2 px-4 rounded-md transition-colors duration-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 