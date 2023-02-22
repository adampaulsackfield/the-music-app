import axios from 'axios';

const URL = 'http://localhost:5550/api/users';

export const registerUser = async (user) => {
  try {
    const response = await axios.post(URL, user);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (user) => {
  try {
    const response = await axios.post(`${URL}/login`, user);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const spotifyAuth = async () => {
  try {
    const options = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    const response = await axios.get(
      'http://localhost:5550/api/spotify/auth',
      options
    );
    console.log('response', response);
  } catch (error) {
    console.log('error', error);
  }
};
