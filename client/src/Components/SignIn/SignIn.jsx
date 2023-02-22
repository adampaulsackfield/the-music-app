import "./SignIn.scss";
import { useState, useContext } from "react";
import { loginUser } from "../../services/User.service";
import { TokenContext } from "../../context/Token.Context";

const initialState = {
  email: "",
  password: "",
};
const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const { setToken } = useContext(TokenContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.email === "" || formData.password === "") {
      return console.log("errorHandler");
    }

    const response = await loginUser(formData);
    if (response.success) {
      localStorage.setItem("token", response.data);
      setToken(response.data);
    }
    setFormData(initialState);
    console.log(response);
  };

  const handleInputChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="signin-wrap">
      <form className="signin" action="">
        <p className="signin_header">Sign In</p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className="signin_input"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className="signin_input"
          placeholder="Password"
        />
        <a className="signin_anchor">Create account</a>
        <a className="signin_anchor">Forgotten password?</a>

        <button className="signin_button" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
