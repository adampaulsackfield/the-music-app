// IMPORTS
import { Link, Outlet } from 'react-router-dom';
import './Navbar.scss';

// CONTEXT
import { TokenContext } from '../../context/Token.Context';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { token, setToken } = useContext(TokenContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);

    toast.success('Logout Successful');
  };

  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>

        {token ? (
          <>
            <Link to='/'>Profile</Link>
            <Link to='#' onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            {/* TODO ! These links should not be visitable when logged in */}
            <Link to='/signup'>Sign Up</Link>
            <Link to='/signin'>Sign In</Link>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  );
};

export default Navbar;
