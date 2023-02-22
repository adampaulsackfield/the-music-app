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

  // TODO - Add active link highlighting
  // TODO - Add Hamburger React for Mobile menu

  return (
    <>
      <nav className='nav'>
        <Link className='nav__logo' to='/'>
          The Music App
        </Link>

        <section className='nav__menu'>
          <Link className='nav__menu-link' to='/'>
            Home
          </Link>

          {token ? (
            <>
              <Link className='nav__menu-link' to='/profile'>
                Profile
              </Link>
              <Link className='nav__menu-link' to='#' onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              {/* TODO ! These links should not be visitable when logged in */}
              <Link className='nav__menu-link' to='/signup'>
                Sign Up
              </Link>
              <Link className='nav__menu-link' to='/signin'>
                Sign In
              </Link>
            </>
          )}
        </section>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
