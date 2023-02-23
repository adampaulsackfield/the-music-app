import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRouteLoggedIn = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRouteLoggedIn;
