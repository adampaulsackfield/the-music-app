// IMPORTS
import { useContext, useEffect, useState } from "react";
import "./Profile.scss";

// SERVICES
import { getProfile } from "../../services/User.service.js";

// CONTEXTS
import { UserContext } from "../../context/User.context";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import Button from "../Button/Button";
import EditDetails from "../EditDetails/EditDetails";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState(user);
  const [showEditForm, setShowEditForm] = useState(false);
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

  const handleClick = () => {
    setShowEditForm(!showEditForm);
  };

  useEffect(() => {}, [showEditForm]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/signin");
    }
  });

  useEffect(() => {
    loadUser();
  }, []); // TODO The empty array is required, despite what VSCode says. Remove it and we have an infinite loop
  // TODO
  return (
    <div className="profile-wrap">
      {user && !showEditForm ? (
        <div className="profile__container">
          <img
            className="profile__container__image"
            src="https://via.placeholder.com/100"
          />
          <h2 className="profile__container__username">{user.username}</h2>
          <h3 className="profile__container__display">{user.displayName}</h3>
          <h3 className="profile__container__email">{user.email}</h3>
          <Button
            onClick={handleClick}
            buttonLabel={"Edit"}
            size="small"
          ></Button>
        </div>
      ) : (
        <div className="">
          <EditDetails
            user={user}
            handleClick={handleClick}
            setShowEditForm={setShowEditForm}
          ></EditDetails>
        </div>
      )}
    </div>
  );
};

export default Profile;
