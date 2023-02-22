import { useEffect } from 'react';
import { spotifyAuth } from '../../services/User.service';
import './Home.scss';

const Home = () => {
  useEffect(() => {
    // spotifyAuth();
  }, []);
  return <div>Home Page</div>;
};

export default Home;
