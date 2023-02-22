import "./SignUp.scss";
import { useState } from "react";
import { registerUser } from "../../services/User.service";
import { Link } from "react-router-dom";
import "./SignUp.scss";
import { useState } from "react";
import { registerUser } from "../../services/User.service";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  displayName: "",
};

const SignUp = () => {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.username === "" ||
      formData.displayName === ""
    ) {
      return toast.warning("Missing required fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.warning("Passwords do not match");
    }

    const response = await registerUser(formData);
    if (response.success) {
      toast.success(
        `${response.data.username} has successfully registered. Login to continue.`
      );
    } else {
      toast.error(response.data);
    }
    setFormData(initialState);
  };

  const handleInputChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="singup-wrap">
      <form className="signup" action="">
        <p className="signup_header">Sign up</p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className="signup_input"
          placeholder="Email"
        />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={(e) => handleInputChange(e)}
          className="signup_input"
          placeholder="Username"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className="signup_input"
          placeholder="Password"
        />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange(e)}
          className="signup_input"
          placeholder="Confirm Password"
        />

        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={(e) => handleInputChange(e)}
          className="signup_input"
          placeholder="Display Name"
        />
        <Link to="/signin" className="signup_anchor">
          Log in
        </Link>
        <button className="signup_button" onClick={handleSubmit}>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
