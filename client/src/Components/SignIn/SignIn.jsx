import "./SignIn.scss";
import { useState, useContext } from "react";
import { loginUser } from "../../services/User.service";
import { TokenContext } from "../../context/Token.Context";
import { toast } from "react-toastify";

const initialState = {
  email: '',
  password: '',
};

const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const { setToken } = useContext(TokenContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      return console.log("errorHandler");

    if (formData.email === '' || formData.password === '') {
      return console.log('errorHandler');
    }

    const response = await loginUser(formData);


    if (response.success) {
      localStorage.setItem('token', response.data);
      setToken(response.data);
      toast.success("Login Successful");
    } else {
      toast.error(response.data);
      toast.success('Login Successful');
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
    <div>
      <form action="" className="SignIn">
        <p>Sign up</p>

        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className="SignIn_input"
          placeholder="Email"
        />
        <Link to="/signup" className="signin_anchor">
          Create account
        </Link>
        <Link to="/signup" className="signin_anchor">
          Forgotten password?
        </Link>

        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className='SignIn-input'
          placeholder='Password'
        />

        <button className='SignIn-button' onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
