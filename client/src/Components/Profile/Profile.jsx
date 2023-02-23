// IMPORTS
import { useContext, useEffect } from "react";
import "./Profile.scss";

// SERVICES
import { getProfile } from "../../services/User.service.js";

// CONTEXTS
import { UserContext } from "../../context/User.context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  let shouldRedirect = false;
  const navigate = useNavigate();

  const loadUser = async () => {
    const response = await getProfile();

    if (response.success) {
      setUser(response.data);
    } else {
      // TODO - Have Faith in Constantin's fix.
      shouldRedirect = true;
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/signin");
    }
  });

  useEffect(() => {
    loadUser();
  }, []); // TODO The empty array is required, despite what VSCode says. Remove it and we have an infinite loop

  return (
    <div>
      {user && (
        <div>
          <h2>Username: {user.username}</h2>
          <h3>Display Name: {user.displayName}</h3>
          <h3>Email: {user.email}</h3>
        </div>
      )}
    </div>
  );
};

export default Profile;
