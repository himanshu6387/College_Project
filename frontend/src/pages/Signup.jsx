// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `https://college-backend-s592.onrender.com/api/user/userRegister`,
        { name, email, password }
      );
      setLoading(true)

      alert(res.data.message || 'User registered successfully!');

      // Redirect to login after signup
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div
      className="container mt-5 p-4 rounded-5"
      style={{ maxWidth: '500px', boxShadow: '0 0 10px 5px gray' }}
    >

    {loading && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-opacity-70 z-50">
          <img
            src="https://vmsmobile.azurewebsites.net/images/Spinner-3.gif"
            alt="Loading..."
            className="w-16 h-16"
          />
          <p className=' text-center text-green-500 mt-2 text-xl font-bold bg-white p-3 rounded-md text-shadow-amber-300'>Loading...</p>
        </div>
      )}

      <h3 className="text-center mb-4">Sign Up</h3>

      <form onSubmit={signupHandler}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <button className="btn btn-success w-100">Sign Up</button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to={"/"}>Login</Link>
      </p>
    </div>
  );
}

export default Signup;
