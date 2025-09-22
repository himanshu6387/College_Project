import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `https://college-backend-s592.onrender.com/api/user/userLogin`,
        { email, password }
      );

      // Save token & user in context
      login(res.data.token, res.data.user);

      // Redirect
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className="container mt-5 p-4 rounded-5"
      style={{ maxWidth: '500px', boxShadow: '0 0 10px 5px gray' }}
    >
      <h3 className="text-center mb-4 text-decoration-underline">Login</h3>

      <form onSubmit={loginHandler}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <p className="text-center mt-3">
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default Login;
