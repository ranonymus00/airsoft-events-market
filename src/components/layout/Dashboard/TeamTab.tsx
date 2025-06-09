import React, { useState, useCallback, useMemo } from "react";
import { Check, X, AlertCircle, Users, AlertTriangle } from "lucide-react";
import { api } from "../../../lib/api";
import { TeamApplication, Team, TeamMap } from "../../../types";
import Button from "../../ui/Button";
import EmptySection from "../../ui/EmptySection";
import { useNavigate } from "react-router-dom";
import { uploadFilesBatch } from "../../../lib/upload";
import FileUpload from "../../ui/FileUpload";
import AvatarUpload from "../../ui/AvatarUpload";

interface TeamTabProps {
  applications: TeamApplication[] | undefined;
  team: Team | null;
}

const TeamTab: React.FC<TeamTabProps> = ({ applications, team }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "applications" | "settings" | "maps"
  >("settings");
  
  // Memoize initial form data to prevent unnecessary re-renders
  const initialFormData = useMemo(() => ({
    logo: team?.logo || "",
    name: team?.name || "",
    description: team?.description || "",
    play_style: team?.play_style || "",
  }), [team?.logo, team?.name, team?.description, team?.play_style]);

  const [formData, setFormData] = useState(initialFormData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [maps, setMaps] = useState<TeamMap[]>([]);
  const [loadingMaps, setLoadingMaps] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapModal, setMapModal] = useState<{
    open: boolean;
    map?: TeamMap | null;
  }>({
    open: false,
    map: null,
  });

  // Update form data when team changes
  React.useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Load maps only when needed and prevent duplicate calls
  const loadMaps = useCallback(async () => {
    if (!team?.id || loadingMaps || mapsLoaded) return;
    
    setLoadingMaps(true);
    try {
      const teamMaps = await api.teamMaps.getByTeam(team.id);
      setMaps(teamMaps);
      setMapsLoaded(true);
    } catch (err) {
      console.error("Error loading maps:", err);
      setMaps([]);
    } finally {
      setLoadingMaps(false);
    }
  }, [team?.id, loadingMaps, mapsLoaded]);

  // Load maps when switching to maps tab
  React.useEffect(() => {
    if (activeTab === "maps" && team?.id && !mapsLoaded) {
      loadMaps();
    }
  }, [activeTab, team?.id, mapsLoaded, loadMaps]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleApproveApplication = useCallback(async (applicationId: string) => {
    try {
      await api.teams.approveApplication(applicationId);
      // Note: Parent component should handle refreshing applications
    } catch (err) {
      console.error("Error approving application:", err);
      setError("Failed to approve application. Please try again.");
    }
  }, []);

  const handleRejectApplication = useCallback(async (applicationId: string) => {
    try {
      await api.teams.rejectApplication(applicationId);
      // Note: Parent component should handle refreshing applications
    } catch (err) {
      console.error("Error rejecting application:", err);
      setError("Failed to reject application. Please try again.");
    }
  }, []);

  const handleTeamUpdate = useCallback(async (teamData: Partial<Team>) => {
    if (!team?.id) return;

    try {
      await api.teams.update(team.id, teamData);
      // Note: Parent component should handle refreshing team data
    } catch (err) {
      console.error("Error updating team:", err);
      setError("Failed to update team. Please try again.");
    }
  }, [team?.id]);

  const handleDeleteMap = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this map?")) return;
    try {
      await api.teamMaps.delete(id);
      setMaps((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting map:", err);
      setError("Failed to delete map. Please try again.");
    }
  }, []);

  // Map modal for add/edit
  const handleMapModalSave = useCallback(async (form: Partial<TeamMap>, mapPhotoFiles: File[]) => {
    try {
      let photoUrls = form.photos || [];
      if (mapPhotoFiles && mapPhotoFiles.length > 0) {
        try {
          photoUrls = await uploadFilesBatch(mapPhotoFiles, "teams", "maps");
        } catch {
          setError("Failed to upload map photos. Please try again.");
          return;
        }
      }
      const cleanForm = { ...form, photos: photoUrls };
      let savedMap: TeamMap;
      if (mapModal.map) {
        savedMap = await api.teamMaps.update(mapModal.map.id, cleanForm);
        setMaps((prev) =>
          prev.map((m) => (m.id === savedMap.id ? savedMap : m))
        );
      } else {
        savedMap = await api.teamMaps.create({ ...cleanForm, team_id: team?.id });
        setMaps((prev) => [savedMap, ...prev]);
      }
      setMapModal({ open: false, map: null });
    } catch {
      setError("Failed to save map. Please try again.");
    }
  }, [mapModal.map, team?.id]);

  const MapModal: React.FC = React.memo(() => {
    const editing = !!mapModal.map;
    const [form, setForm] = React.useState<Partial<TeamMap>>(
      mapModal.map || {}
    );
    const [mapPhotoFiles, setMapPhotoFiles] = React.useState<File[]>([]);
    
    return !mapModal.open ? null : (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg h-[90dvh] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">
            {editing ? "Edit Map" : "Add Map"}
          </h3>
          <div className="space-y-3">
            <input
              className="w-full p-2 border rounded"
              placeholder="Map Name"
              value={form.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Location"
              value={form.location || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Google Maps Link"
              value={form.google_maps_link || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, google_maps_link: e.target.value }))
              }
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              className="w-full p-2 border rounded"
              value={form.field_type || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, field_type: e.target.value }))
              }
              required
            >
              <option value="">Select field type</option>
              <option value="Mato">Mato</option>
              <option value="CQB">CQB</option>
              <option value="Misto">Misto</option>
            </select>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            {/* Photo upload for multiple images */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Map Photos
            </label>
            <FileUpload
              multiple
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  setMapPhotoFiles(files);
                  setForm((prev) => ({
                    ...prev,
                    photos: files.map((f) => URL.createObjectURL(f)), // preview
                  }));
                }
              }}
              className="w-full p-2 border rounded"
            />
            {form.photos && form.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Map photo ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            <Button
              size="small"
              variant="secondary"
              onClick={() => setMapModal({ open: false, map: null })}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={() => handleMapModalSave(form, mapPhotoFiles)}
            >
              {editing ? "Save Changes" : "Add Map"}
            </Button>
          </div>
        </div>
      </div>
    );
  });

  const renderApplications = () => {
    if (!applications || applications.length === 0) {
      return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">No pending applications</p>
        </div>
      );
    }

    const pendingApplications = applications.filter(
      (app) => app.status === "pending"
    );

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
        <div className="space-y-4">
          {pendingApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={application.user.avatar}
                    alt={application.user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {application.user.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Applied{" "}
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="small"
                    variant="primary"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={() => handleApproveApplication(application.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => handleRejectApplication(application.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Team Settings</h3>
        </div>

        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Team Information</h3>
            <div className="relative inline-block mb-4">
              <AvatarUpload
                src={formData.logo}
                onChange={(file: File) => {
                  setFormData((prev) => ({
                    ...prev,
                    logo: URL.createObjectURL(file),
                  }));
                  setLogoFile(file);
                }}
                className="w-24 h-24 mx-auto mb-2"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <div className="mt-4">
              <Button size="small" onClick={() => handleTeamUpdate(formData)}>
                Save Changes
              </Button>
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
                  <h4 className="font-medium text-red-700">Delete Team</h4>
                  <p className="text-red-600 text-sm mt-1">
                    Once you delete your team, there is no going back. Please be
                    certain.
                  </p>
                  <button
                    className="mt-4 bg-white border border-red-500 text-red-600 hover:bg-red-50 py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this team?"
                        )
                      ) {
                        // handleTeamDelete();
                      }
                    }}
                  >
                    Delete Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMaps = () => {
    if (loadingMaps) {
      return (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading maps...</p>
        </div>
      );
    }
    
    if (!maps.length) {
      return (
        <EmptySection
          icon={<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
          title="No maps yet"
          description="Your team hasn't added any maps yet."
          buttonText="Add Map"
          onButtonClick={() => setMapModal({ open: true, map: null })}
        />
      );
    }
    
    return (
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <Button
            size="small"
            onClick={() => setMapModal({ open: true, map: null })}
          >
            Add Map
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maps.map((map) => (
            <div
              key={map.id}
              className="bg-white border rounded-lg p-4 flex flex-col"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{map.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{map.location}</p>
                <p className="text-xs text-gray-500 mb-2">{map.field_type}</p>
                {map.google_maps_link && (
                  <a
                    href={map.google_maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-xs"
                  >
                    Google Maps
                  </a>
                )}
                {map.description && (
                  <p className="mt-2 text-gray-700 text-sm">
                    {map.description}
                  </p>
                )}
                {map.photos && map.photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {map.photos.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={map.name + " photo " + (idx + 1)}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => setMapModal({ open: true, map })}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteMap(map.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {team ? (
        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("settings")}
                className={`${
                  activeTab === "settings"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Team Settings
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`${
                  activeTab === "applications"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab("maps")}
                className={`${
                  activeTab === "maps"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Maps
              </button>
            </nav>
          </div>

          {activeTab === "applications"
            ? renderApplications()
            : activeTab === "maps"
            ? renderMaps()
            : renderSettings()}
        </div>
      ) : (
        <EmptySection
          icon={<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
          title="No team found"
          description="You haven't created a team yet."
          buttonText="Create your Team"
          onButtonClick={() => navigate("/create-team")}
        />
      )}
      <MapModal />
    </div>
  );
};

export default TeamTab;