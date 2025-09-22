// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const signupHandler = async (e) => {
    e.preventDefault();
     setLoading(true)

    try {
      const res = await axios.post(
        `https://college-backend-s592.onrender.com/api/user/userRegister`,
        { name, email, password }
      );
     

      toast.success(res.data.message || 'User registered successfully!');

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
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
    <img
      src="https://vmsmobile.azurewebsites.net/images/Spinner-3.gif"
      alt="Loading..."
      className="mb-3"
      style={{ width: "64px", height: "64px" }}
    />
    <p className="text-center text-success mt-2 fs-4 fw-bold bg-white px-3 py-2 rounded shadow">
      Loading...
    </p>
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
