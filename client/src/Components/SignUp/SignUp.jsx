// IMPORTS
import { useState } from "react";
import { toast } from "react-toastify";
import "./SignUp.scss";

// SERVICES
import { registerUser } from "../../services/User.service";

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
        <p className="signup__header">Sign up</p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className="signup__input"
          placeholder="Email"
        />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={(e) => handleInputChange(e)}
          className="signup__input"
          placeholder="Username"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className="signup__input"
          placeholder="Password"
        />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange(e)}
          className="signup__input"
          placeholder="Confirm Password"
        />

        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={(e) => handleInputChange(e)}
          className="signup__input"
          placeholder="Display Name"
        />

        <button className="signup__button" onClick={handleSubmit}>
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
