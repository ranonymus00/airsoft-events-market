import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Upload, AlertCircle } from "lucide-react";
import { api } from "../lib/api";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import FileUpload from "../components/ui/FileUpload";
import { uploadFilesBatch } from "../lib/upload";

const CreateTeam: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    play_style: undefined,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      let logoUrl = formData.logo;
      if (logoFile) {
        try {
          const [url] = await uploadFilesBatch([logoFile], "teams", "logos");
          logoUrl = url;
        } catch {
          setError("Failed to upload logo. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      // Validate required fields
      if (!formData.name || !logoUrl) {
        setError("Name and logo are required.");
        setIsSubmitting(false);
        return;
      }
      // Save team (API call)
      await api.teams.create({
        ...formData,
        logo: logoUrl,
        owner_id: authState.user?.id,
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
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Team Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <FileUpload
                          label={undefined}
                          accept="image/*"
                          name="logo"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData((prev) => ({
                                ...prev,
                                logo: URL.createObjectURL(file),
                              }));
                              setLogoFile(file);
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      {formData.logo && (
                        <img
                          src={formData.logo}
                          alt="Team Logo Preview"
                          className="mx-auto mt-2 w-24 h-24 object-cover rounded-full border"
                        />
                      )}
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
                    name="play_style"
                    value={formData.play_style || ""}
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
