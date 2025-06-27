import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentRegsiterForm=()=> {
  const { slug } = useParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    class: '',
    section: '',
    aadhaar: '',
    phone: '',
    fatherName: '',
    motherName: '',
    dob: '',
    address: '',
    admissionNo: '',
    password: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append('image', image);

    setLoading(true);
    try {
      await axios.post(
        `https://college-backend-s592.onrender.com/api/student/signup/${slug}`,
        formData
      );
      alert('Registration successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Student Registration - {slug.replace(/-/g, ' ')}</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name:</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email:</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Class:</label>
            <input type="text" name="class" onChange={handleChange} className=' form-control'  />
          </div>
          <div className="col-md-6 mb-3">
            <label>Section:</label>
            <input type="text" name="section" onChange={handleChange}  className=' form-control' />
          </div>
          <div className="col-md-6 mb-3">
            <label>Phone:</label>
            <input type="text" name="phone" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Aadhaar Number:</label>
            <input type="text" name="aadhaar" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Father's Name:</label>
            <input type="text" name="fatherName" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Mother's Name:</label>
            <input type="text" name="motherName" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Date of Birth:</label>
            <input type="date" name="dob" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Admission No:</label>
            <input type="text" name="admissionNo" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-12 mb-3">
            <label>Address:</label>
            <textarea name="address" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Image:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2"
                style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Roll No</label>
            <input type="text" name="password" className="form-control" onChange={handleChange} required />
          </div>
        </div>

        <button className="btn btn-success" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default StudentRegsiterForm;
