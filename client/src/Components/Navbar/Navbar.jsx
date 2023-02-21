import { Link, Outlet } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/signup'>Sign Up</Link>
      </nav>

      <Outlet />
    </div>
  );
};

export default Navbar;
