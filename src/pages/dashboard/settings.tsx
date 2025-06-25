import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../../components/ui/Button";
import AvatarUpload from "../../components/ui/AvatarUpload";
import { useAuth } from "../../contexts/AuthContext";
import DashboardSidebar from "../../components/ui/DashboardSidebar";
import { uploadFilesBatch } from "../../lib/upload";

const SettingsPage: React.FC = () => {
  const { authState, updateProfile } = useAuth();
  const user = authState.user;

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    user?.avatar || ""
  );
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (!user) return null;
  const username = user?.username || "";
  const avatar = user?.avatar || "";
  const email = user.email || "";

  const onSaveChanges = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    let imageUrl = "";
    if (selectedFile) {
      try {
        const [url] = await uploadFilesBatch([selectedFile], "users", "");
        imageUrl = url;

        const success = await updateProfile(imageUrl);
        if (!success) {
          setError("Failed to update profile. Please try again.");
        }
        setSuccess("Profile updated successfully.");
      } catch {
        setError("Failed to update profile. Please try again.");
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">
            Manage your profile, events, and marketplace items
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DashboardSidebar
            activeTab={"settings"}
            user={{ username, email, avatar }}
          />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Profile Information
                  </h3>
                  <div className="relative inline-block mb-4">
                    <AvatarUpload
                      src={previewUrl || avatar}
                      alt={username}
                      onChange={(file: File) => {
                        setPreviewUrl(URL.createObjectURL(file));
                        setSelectedFile(file);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={username}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                    {success && (
                      <p className="text-xs text-green-600 mt-1">{success}</p>
                    )}
                    <div className="mt-4">
                      <Button
                        size="small"
                        onClick={onSaveChanges}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
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
                  <h3 className="text-lg font-semibold mb-4">
                    Notification Preferences
                  </h3>
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
                        <h4 className="font-medium text-red-700">
                          Delete Account
                        </h4>
                        <p className="text-red-600 text-sm mt-1">
                          Once you delete your account, there is no going back.
                          Please be certain.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
