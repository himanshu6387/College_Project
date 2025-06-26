// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    if (role === 'admin') {
      try {
        const res = await axios.post(`https://college-backend-s592.onrender.com/api/admin/login`, { email, password });
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Admin login failed');
      }
    } else if (role === 'student') {
      try {
        const res = await axios.post(`https://college-backend-s592.onrender.com/api/student/login`, { email, password });
        localStorage.setItem('studentToken', res.data.token);
        // Must provide slug to redirect to correct form
        if (!slug) return alert('Please enter your college slug!');
        navigate(`/form/${slug}`);
      } catch (err) {
        alert(err.response?.data?.message || 'Student login failed');
      }
    }
  };

  return (
    <div className="container mt-5 p-4 rounded-5 " style={{ maxWidth: '500px',boxShadow:'0 0 10px 5px gray' }}>
      <h3 className="text-center mb-4">Login</h3>

      <form onSubmit={loginHandler}>
        <div className="mb-3">
          <label>Select Role:</label>
          <select className="form-control" onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" required onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input type="password" className="form-control" required onChange={(e) => setPassword(e.target.value)} />
        </div>

        {role === 'student' && (
          <div className="mb-3">
            <label>College Slug:</label>
            <input
              type="text"
              placeholder="e.g., abc-college"
              className="form-control"
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
        )}

        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
