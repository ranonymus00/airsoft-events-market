import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";

// Lazy load page components for better performance
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));

const EventsPage = lazy(() => import("./pages/dashboard/events"));
const MarketplacePage = lazy(() => import("./pages/dashboard/marketplace"));
const TeamPage = lazy(() => import("./pages/dashboard/team"));
const SettingsPage = lazy(() => import("./pages/dashboard/settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreateTeam = lazy(() => import("./pages/CreateTeam"));

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="events"
        element={
          <PrivateRoute>
            <EventsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="marketplace"
        element={
          <PrivateRoute>
            <MarketplacePage />
          </PrivateRoute>
        }
      />
      <Route
        path="team"
        element={
          <PrivateRoute>
            <TeamPage />
          </PrivateRoute>
        }
      />
      <Route
        path="settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="settings" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-48">
                  Loading...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<ItemDetails />} />
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-team" element={<CreateTeam />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
