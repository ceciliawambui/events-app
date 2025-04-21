import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
