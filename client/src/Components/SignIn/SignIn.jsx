// IMPORTS
import { useState, useContext, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SignIn.scss";

// SERVICES
import { loginUser } from "../../services/User.service";

// CONTEXT
import { TokenContext } from "../../context/Token.context";

const initialState = {
  email: "",
  password: "",
};

const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const { setToken, token } = useContext(TokenContext);
  const navigate = useNavigate();
  const shouldRedirect = false;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      return console.log("errorHandler");
    }

    const response = await loginUser(formData);

    if (response.success) {
      localStorage.setItem("token", response.data);
      setToken(response.data);
      toast.success("Login Successful");
      shouldRedirect = true;

      // TODO - Redirect still isn't working
      //redirect("/profile");
    } else {
      toast.error(response.data);
    }

    setFormData(initialState);
  };

  useEffect(() => {
    if (shouldRedirect) {
      return navigate("/profile");
    }
  }, [token]);

  const handleInputChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="signin-wrap">
      <form action="" className="signin">
        <p className="signin__header">Sign in</p>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className="signin__input"
          placeholder="Email"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className="signin__input"
          placeholder="Password"
        />

        <Link to="/signup" className="signin__anchor">
          Create account
        </Link>

        <Link to="/signup" className="signin__anchor">
          Forgotten password?
        </Link>

        <button className="signin__button" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
