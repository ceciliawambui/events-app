import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import EventDetails from "./components/EventDetails";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RoleRedirector from "./components/RoleDirector";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import OrganizerDashboard from "./pages/Dashboards/OrganizerDahboard";
import AttendeeDashboard from "./pages/Dashboards/AttendeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountSettings from "./pages/AccountSettings";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import OrganizerProfile from "./pages/OrganizerProfile";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/organizer/:organizerId" element={<OrganizerProfile />} />
          <Route path="/create-event" element={<ProtectedRoute><CreateEvent currentUser={currentUser} /></ProtectedRoute>} />
          <Route path="/edit-event/:eventId" element={<CreateEvent currentUser={currentUser} />} />
          <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/redirect" element={<ProtectedRoute><RoleRedirector /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/attendee" element={<ProtectedRoute><AttendeeDashboard /></ProtectedRoute>} />
          <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
