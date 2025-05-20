import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ user, allowedRole, redirectTo = "/login" }) => {
  if (!user) return <Navigate to={redirectTo} />;
  return user.role === allowedRole ? <Outlet /> : <Navigate to="/" />;
};

const PublicRoute = ({ user, redirectTo }) => {
  return user ? <Navigate to={redirectTo} /> : <Outlet />;
};

export { PublicRoute, PrivateRoute };
