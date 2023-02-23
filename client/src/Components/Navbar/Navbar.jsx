// IMPORTS
import {
  Link,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
  redirect,
} from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.scss";

// CONTEXT
import { TokenContext } from "../../context/Token.context";
import { useContext, useEffect } from "react";

const Navbar = () => {
  const { token, setToken } = useContext(TokenContext);
  const navigate = useNavigate();
  let shouldRedirect = false;
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    shouldRedirect = true;
    toast.success("Logout Successful");
  };

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/");
    }
  });

  // TODO - Add Hamburger React for Mobile menu

  return (
    <>
      <nav className="nav">
        <Link className="nav__logo" to="/">
          The Music App
        </Link>

        <section className="nav__menu">
          <Link className="nav__menu-link" to="/">
            Home
          </Link>

          {token ? (
            <>
              <Link className="nav__menu-link" to="/profile">
                Profile
              </Link>
              <Link className="nav__menu-link" to="#" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link className="nav__menu-link" to="/signup">
                Sign Up
              </Link>
              <Link className="nav__menu-link" to="/signin">
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
