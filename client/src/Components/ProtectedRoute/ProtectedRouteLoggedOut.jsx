import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRouteLoggedOut = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRouteLoggedOut;
