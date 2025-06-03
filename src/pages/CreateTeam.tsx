import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { User } from "../types";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";

const CreateTeam: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    playStyle: "",
    logo: "",
  });

  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data: users } = await supabase
          .from("users")
          .select("*")
          .neq("id", authState.user?.id);

        if (users) {
          setUsers(users);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    if (authState.user) {
      loadUsers();
    }
  }, [authState.user]);

  // Filter out the current user and selected members from potential members
  const availableMembers = users.filter(
    (user) => !selectedMembers.includes(user)
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberAdd = (user: User) => {
    setSelectedMembers((prev) => [...prev, user]);
  };

  const handleMemberRemove = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((member) => member.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.location || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const team = await api.teams.create({
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
      });

      // Navigate to success page or show success message
      navigate("/dashboard", {
        state: {
          message:
            "Team created successfully! You can now start managing your team and organizing events.",
        },
      });
    } catch (err) {
      setError("Failed to create team. Please try again.");
      console.error("Team creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-800 p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">
                  Create a New Team
                </h1>
              </div>
              <p className="mt-2 text-gray-300">
                Build your airsoft team and start organizing events together
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-500 hover:text-orange-600">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Handle file upload
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    logo: reader.result as string,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us about your team..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Play Style
                  </label>
                  <select
                    name="playStyle"
                    value={formData.playStyle}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select play style</option>
                    <option value="casual">Casual</option>
                    <option value="competitive">Competitive</option>
                    <option value="milsim">Milsim</option>
                    <option value="speedsoft">Speedsoft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members
                  </label>

                  {/* Selected Members */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Selected Members:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center bg-gray-100 rounded-full pl-2 pr-3 py-1"
                        >
                          <img
                            src={member.avatar}
                            alt={member.username}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-800">
                            {member.username}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMemberRemove(member.id)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Add Members:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableMembers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleMemberAdd(user)}
                          className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                        >
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-800">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button size="small" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Creating Team..." : "Create Team"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
