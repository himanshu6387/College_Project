// src/pages/StudentRegister.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StudentRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    collegeSlug: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/student/register`, form);
      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <div className="container mt-5 shadow-lg p-5" style={{ maxWidth: '600px' }}>
        <h3 className="text-center mb-4">Student Registration</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name:</label>
            <input type="text" className="form-control" name="name" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label>Email:</label>
            <input type="email" className="form-control" name="email" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label>Password:</label>
            <input type="password" className="form-control" name="password" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label>College Slug:</label>
            <input type="text" className="form-control" name="collegeSlug" required onChange={handleChange} />
            <small className="form-text text-muted">e.g., abc-college (provided by admin)</small>
          </div>

          <button className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </>
  );
};

export default StudentRegister;
