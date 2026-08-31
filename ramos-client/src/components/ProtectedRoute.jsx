import {
  Navigate,
} from "react-router-dom";

import {
  getCurrentUser,
} from "../services/authService";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const token =
    localStorage.getItem("token");

  const user =
    getCurrentUser();

  // Not logged in
  if (!token || !user) {
    return (
      <Navigate
        to="/auth/signin"
        replace
      />
    );
  }

  // User does not have required role
  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;