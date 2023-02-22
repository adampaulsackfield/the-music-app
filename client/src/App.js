// IMPORTS
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

// COMPONENTS
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Profile from './components/Profile/Profile';

// CONTEXT
import { TokenContext } from './context/Token.context';
import { UserContext } from './context/User.context';

const jwtToken = localStorage.getItem('token');

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, [token]);

  return (
    <div className='App'>
      <TokenContext.Provider value={{ token, setToken }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route element={<Navbar />}>
              <Route path='/' element={<Home />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/profile' element={<Profile />} />
            </Route>
          </Routes>

          <ToastContainer
            position='top-right'
            closeOnClick
            pauseOnHover
            theme='dark'
          />
        </UserContext.Provider>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
