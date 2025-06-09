import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { Event, Team, MarketplaceItem } from "../types";
import CreateEventForm from "../components/ui/CreateEventForm";
import DashboardSidebar from "../components/layout/Dashboard/DashboardSidebar";
import ProfileTab from "../components/layout/Dashboard/ProfileTab";
import EventsTab from "../components/layout/Dashboard/EventsTab";
import MarketplaceTab from "../components/layout/Dashboard/MarketplaceTab";
import SettingsTab from "../components/layout/Dashboard/SettingsTab";
import TeamTab from "../components/layout/Dashboard/TeamTab";
import FileUpload from "../components/ui/FileUpload";

const Dashboard: React.FC = () => {
  const { authState, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from query param
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    email: authState?.user?.email || "",
    username: authState?.user?.username || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [showEditEventForm, setShowEditEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // State for data from API with loading flags to prevent duplicate calls
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [userItems, setUserItems] = useState<MarketplaceItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState({
    events: false,
    items: false,
    teams: false,
  });
  const [dataLoaded, setDataLoaded] = useState({
    events: false,
    items: false,
    teams: false,
  });

  // Load user's events with duplicate call prevention
  const loadUserEvents = useCallback(async () => {
    if (!authState?.user?.id || loading.events || dataLoaded.events) return;

    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const events = await api.events.getAll();
      const filteredEvents = events.filter(
        (event) => event.user_id === authState?.user?.id
      );
      setUserEvents(filteredEvents);
      setDataLoaded((prev) => ({ ...prev, events: true }));
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  }, [authState?.user?.id, loading.events, dataLoaded.events]);

  const loadUserItems = useCallback(async () => {
    if (!authState?.user?.id || loading.items || dataLoaded.items) return;

    setLoading((prev) => ({ ...prev, items: true }));
    try {
      const items = await api.marketplace.getAll();
      const filteredItems = items.filter(
        (item) => item.seller.id === authState?.user?.id
      );
      setUserItems(filteredItems);
      setDataLoaded((prev) => ({ ...prev, items: true }));
    } catch (err) {
      console.error("Error loading marketplace items:", err);
    } finally {
      setLoading((prev) => ({ ...prev, items: false }));
    }
  }, [authState?.user?.id, loading.items, dataLoaded.items]);

  const loadTeams = useCallback(async () => {
    if (loading.teams || dataLoaded.teams) return;

    setLoading((prev) => ({ ...prev, teams: true }));
    try {
      const teams = await api.teams.getAll();
      setTeams(teams);
      setDataLoaded((prev) => ({ ...prev, teams: true }));
    } catch (err) {
      console.error("Error loading teams:", err);
    } finally {
      setLoading((prev) => ({ ...prev, teams: false }));
    }
  }, [loading.teams, dataLoaded.teams]);

  // Load data only when user is available and data hasn't been loaded yet
  useEffect(() => {
    if (authState?.user?.id) {
      if (!dataLoaded.events) loadUserEvents();
      if (!dataLoaded.items) loadUserItems();
      if (!dataLoaded.teams) loadTeams();
    }
  }, [authState?.user?.id, dataLoaded.events, dataLoaded.items, dataLoaded.teams, loadUserEvents, loadUserItems, loadTeams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState?.isAuthenticated && !authState?.loading) {
      navigate("/login");
    }

    setProfileForm({
      email: authState?.user?.email || "",
      username: authState?.user?.username || "",
    });
  }, [authState, navigate]);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
  }, []);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      let avatarUrl = authState?.user?.avatar;

      if (selectedFile) {
        avatarUrl = previewUrl || "";
      }

      const success = await updateProfile({
        avatar: avatarUrl,
        email: profileForm.email,
        username: profileForm.username,
      });

      if (!success) {
        throw new Error("Failed to update profile");
      }

      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (error: unknown) {
      setError("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  }, [authState?.user?.avatar, selectedFile, previewUrl, updateProfile, profileForm.email, profileForm.username]);

  const handleEditEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEditEventForm(true);
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.events.update(eventId, { deleted: true });
      // Refresh events after deletion
      setDataLoaded((prev) => ({ ...prev, events: false }));
      await loadUserEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    }
  }, [loadUserEvents]);

  const handleApplyToTeam = useCallback(async (teamId: string) => {
    if (!authState?.user?.id) return;

    try {
      await api.teams.apply(teamId);
      // Refresh teams after application
      setDataLoaded((prev) => ({ ...prev, teams: false }));
      await loadTeams();
    } catch (err) {
      console.error("Error applying to team:", err);
      setError("Failed to apply to team. Please try again.");
    }
  }, [authState?.user?.id, loadTeams]);

  // Update tab in URL when changed
  useEffect(() => {
    if (activeTab !== searchParams.get("tab")) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, searchParams, setSearchParams]);

  // Sync tab with URL if changed externally
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [location.search, activeTab]);

  if (!authState?.user) {
    return null;
  }

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
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={authState.user}
          />

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <ProfileTab
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                teams={teams}
                loading={loading.teams}
                userEvents={userEvents}
                userItems={userItems}
                userTeam={authState.user.team || undefined}
                onApplyToTeam={handleApplyToTeam}
                currentUserId={authState.user.id}
              />
            )}

            {activeTab === "events" && (
              <EventsTab
                events={userEvents}
                loading={loading.events}
                onCreateEvent={() => setShowCreateEventForm(true)}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {activeTab === "marketplace" && (
              <MarketplaceTab
                items={userItems}
                loading={loading.items}
                onCreateListing={() => {}}
                onEditListing={() => {}}
                onDeleteListing={() => {}}
              />
            )}

            {activeTab === "team" && (
              <TeamTab
                applications={authState.user.team?.team_applications}
                team={authState.user.team || null}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                user={authState.user}
                profileForm={profileForm}
                previewUrl={previewUrl}
                error={error}
                onAvatarClick={handleAvatarClick}
                onProfileChange={handleProfileChange}
                onSaveChanges={handleSaveChanges}
              />
            )}
          </div>
        </div>
      </div>

      {showCreateEventForm && (
        <CreateEventForm onClose={() => setShowCreateEventForm(false)} />
      )}

      {showEditEventForm && selectedEvent && (
        <CreateEventForm
          onClose={() => {
            setShowEditEventForm(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}

      <FileUpload
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </div>
  );
};

export default Dashboard;