import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const [collegeName, setCollegeName] = useState('');
  const [data, setData] = useState({});
  const [newLink, setNewLink] = useState(localStorage.getItem('generatedLink') || '');
  const [selectedCollege, setSelectedCollege] = useState(null);

  const token = localStorage.getItem('adminToken');

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Admin token not found. Please log in again.");
      return;
    }
    try {
      const res = await axios.post(
        `https://college-backend-s592.onrender.com/api/admin/create-college`,
        { name: collegeName },
        {
          headers: { Authorization: token },
        }
      );
      const generated = res.data.link;
      alert(res.data.message);
      setNewLink(generated);
      localStorage.setItem('generatedLink', generated);
      setCollegeName('');
      fetchStudentData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to create link');
    }
  };

  const fetchStudentData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`https://college-backend-s592.onrender.com/api/admin/data`, {
        headers: { Authorization: token },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load student data');
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleDownloadExcel = (collegeName, students) => {
    const formattedData = students.map((stu, index) => ({
      'S.No': index + 1,
      Name: stu.name,
      Email: stu.email,
      Class: stu.class,
      Section: stu.section,
      Phone: stu.phone,
      Address:stu.address,
      Aadhaar: stu.aadhaar,
      'Admission No': stu.admissionNo,
      'Profile Image URL': stu.profileImage || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const fileName = `${collegeName.replace(/\s+/g, '_')}_students.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleImageDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      alert("Failed to download image.");
      console.error(err);
    }
  };

  const handleDownloadAllImages = async (students) => {
    const zip = new JSZip();
    for (let i = 0; i < students.length; i++) {
      const stu = students[i];
      if (stu.profileImage) {
        try {
          const response = await fetch(stu.profileImage);
          const blob = await response.blob();
          zip.file(`${i + 1}.jpg`, blob);
        } catch (err) {
          console.error(`Failed to fetch image ${i + 1}`, err);
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'student_photos.zip');
    });
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-3 text-center">🎓 Admin Dashboard</h2>

        <div className="card shadow-sm p-4">
          <form onSubmit={handleCreateLink}>
            <div className="row g-2 align-items-end">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Enter College Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Government Engineering College"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <button className="btn btn-success w-100">Generate Registration Link</button>
              </div>
            </div>
          </form>

          {newLink && (
            <div className="alert alert-primary mt-4 mb-0">
              <strong>Link Generated:</strong>{' '}
              <a href={newLink} target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
                {newLink}
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="my-4" />

      <h4 className="mb-3">📚 Student Data</h4>

      {selectedCollege ? (
        <div className="card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              {selectedCollege.name} - <span className="text-muted">{selectedCollege.students.length} students</span>
            </h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedCollege(null)}>
              ← Back to Colleges
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>S.No</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Aadhaar</th>
                  <th>Admission No</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {selectedCollege.students.map((stu, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={stu.profileImage}
                        alt="student"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                    </td>
                    <td>{stu.name}</td>
                    <td>{stu.email}</td>
                    <td>{stu.fatherName}</td>
                    <td>{stu.motherName}</td>
                    <td>{stu.class}</td>
                    <td>{stu.section}</td>
                    <td>{stu.phone}</td>
                    <td>{stu.address}</td>
                    <td>{stu.aadhaar}</td>
                    <td>{stu.admissionNo}</td>
                    <td>
                      {stu.profileImage && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleImageDownload(stu.profileImage, `${i + 1}.jpg`)}
                        >
                          ⬇️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => handleDownloadAllImages(selectedCollege.students)}
            >
              ⬇️ Download All Photos (ZIP)
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleDownloadExcel(selectedCollege.name, selectedCollege.students)}
            >
              ⬇️ Download Excel
            </button>
          </div>
        </div>
      ) : Object.keys(data).length === 0 ? (
        <p className="text-muted">No data yet...</p>
      ) : (
        <div className="row">
          {Object.entries(data).map(([college, students]) => (
            <div key={college} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div
                  className="card-body text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCollege({ name: college, students })}
                >
                  <h5 className="card-title fw-bold text-primary">{college}</h5>
                  <p className="card-text text-muted">
                    {students.length} student{students.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="card-footer bg-white border-0 text-center">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleDownloadExcel(college, students)}
                  >
                    ⬇️ Download Excel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
