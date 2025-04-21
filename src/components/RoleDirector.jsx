import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRedirector = () => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Wait for auth to load

  if (!currentUser || !userData) return <Navigate to="/login" />;

  if (!currentUser.emailVerified && userData.role !== "admin") {
    return <p>Please verify your email.</p>;
  }

  if (userData.role === "admin") return <Navigate to="/admin" />;
  if (userData.role === "organizer") {
    return userData.approved ? <Navigate to="/organizer" /> : <p>Your account is awaiting approval.</p>;
  }
  if (userData.role === "attendee") return <Navigate to="/attendee" />;

  return <p>Redirecting...</p>;
};

export default RoleRedirector;
