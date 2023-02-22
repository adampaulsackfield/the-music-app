// IMPORTS
import { useContext, useEffect } from 'react';
import './Profile.scss';

// SERVICES
import { getProfile } from '../../services/User.service.js';

// CONTEXTS
import { UserContext } from '../../context/User.context';

// TODO - Ensure only logged in people can view profile

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const { username, displayName, email } = user;

  const loadUser = async () => {
    const response = await getProfile();

    if (response.success) {
      setUser(response.data);
    } else {
      // TODO - Handle Error
    }
  };

  useEffect(() => {
    loadUser();
  }, []); // TODO The empty array is required, despite what VSCode says. Remove it and we have an infinite loop

  return (
    <div>
      {user && (
        <div>
          <h2>Username: {username}</h2>
          <h3>Display Name: {displayName}</h3>
          <h3>Email: {email}</h3>
        </div>
      )}
    </div>
  );
};

export default Profile;
