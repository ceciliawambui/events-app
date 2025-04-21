import LandingPage from "./components/LandingPage"
import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router-dom"
import EventDetails from "./components/EventDetails"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import RoleRedirector from "./components/RoleDirector"
import AdminDashboard from "./pages/Dashboards/AdminDashboard"
import OrganizerDashboard from "./pages/Dashboards/OrganizerDahboard"
import AttendeeDashboard from "./pages/Dashboards/AttendeeDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/redirect" element={<ProtectedRoute><RoleRedirector /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/attendee" element={<ProtectedRoute><AttendeeDashboard /></ProtectedRoute>} />
        <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />

    </>
  )
}

export default App
