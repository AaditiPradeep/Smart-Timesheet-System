import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userData = JSON.parse(user);

  // If a role is required and user doesn't have it, redirect to login
  if (requiredRole && !requiredRole.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
