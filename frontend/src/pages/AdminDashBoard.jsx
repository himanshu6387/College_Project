import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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
      Address: stu.address,
      Aadhaar: stu.aadhaar,
      MotherName: stu.motherName,
      FatherName: stu.fatherName,
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

    // 🔥 Generate Proper College ID Card PDFs and zip them
  const handleDownloadIDCards = async (students, collegeName) => {
    const zip = new JSZip();

    for (let i = 0; i < students.length; i++) {
      const stu = students[i];
      const doc = new jsPDF("p", "mm", [85, 55]); // ID Card size (85mm x 55mm)

      // Outer Border
      doc.setLineWidth(1);
      doc.setDrawColor(0, 102, 204);
      doc.rect(2, 2, 81, 51); 

      // Header band
      doc.setFillColor(0, 102, 204); // Blue band
      doc.rect(2, 2, 81, 12, "F");

      // College Name
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(collegeName || "ABC COLLEGE", 42, 10, { align: "center" });

      // Profile Image (circle style)
      if (stu.profileImage) {
        try {
          const imgResponse = await fetch(stu.profileImage);
          const imgBlob = await imgResponse.blob();
          const reader = new FileReader();

          const base64Img = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgBlob);
          });

          doc.addImage(base64Img, "JPEG", 30, 15, 25, 25); 
          doc.circle(42, 27, 13); // circle outline
        } catch (err) {
          console.error("Image load failed", err);
        }
      }

      // Student Info
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${stu.name || ""}`, 5, 45);
      doc.text(`Class: ${stu.class || ""} - ${stu.section || ""}`, 5, 50);
      doc.text(`Adm No: ${stu.admissionNo || ""}`, 45, 45);
      doc.text(`Phone: ${stu.phone || ""}`, 45, 50);

      // Footer band
      doc.setFillColor(220, 220, 220);
      doc.rect(2, 53, 81, 5, "F");
      doc.setFontSize(6);
      doc.setTextColor(50, 50, 50);
      doc.text("Powered by College Portal", 42, 57, { align: "center" });

      // Save PDF to zip
      const pdfBlob = doc.output("blob");
      zip.file(`${stu.name || "student"}_idcard.pdf`, pdfBlob);
    }

    // Generate ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${collegeName || "students"}_idcards.zip`);
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
              className="btn btn-success me-2"
              onClick={() => handleDownloadExcel(selectedCollege.name, selectedCollege.students)}
            >
              ⬇️ Download Excel
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleDownloadIDCards(selectedCollege.students, selectedCollege.name)}
            >
              ⬇️ Download ID Cards (ZIP)
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
