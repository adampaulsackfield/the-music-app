// IMPORTS
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SignIn.scss';

// SERVICES
import { loginUser } from '../../services/User.service';

// CONTEXT
import { TokenContext } from '../../context/Token.Context';

const initialState = {
  email: '',
  password: '',
};

const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const { setToken } = useContext(TokenContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.email === '' || formData.password === '') {
      return console.log('errorHandler');
    }

    const response = await loginUser(formData);

    if (response.success) {
      localStorage.setItem('token', response.data);
      setToken(response.data);
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
    <div className='signin-wrap'>
      <form action='' className='signin'>
        <p>Sign up</p>

        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          className='signin_input'
          placeholder='Email'
        />

        <input
          type='password'
          name='password'
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          className='signin_input'
          placeholder='Password'
        />

        <Link to='/signup' className='signin_anchor'>
          Create account
        </Link>

        <Link to='/signup' className='signin_anchor'>
          Forgotten password?
        </Link>

        <button className='signin_button' onClick={handleSubmit}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
