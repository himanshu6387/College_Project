// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar=()=> {

  const { token,logout } = useContext(AuthContext)

  const handleLogout=()=>{
    logout()
    toast.success('Logout Successfully..')
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 position-sticky top-0 z-1 p-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">College Portal</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            {
              token ?
                (
                  <>
                    <li className="nav-item">
                      <button className=' btn btn-outline-success'>Admin</button>
                    </li>
                    <li className="nav-item">
                      <button className=' btn btn-outline-primary ms-2' onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                )
                :
                (
                  <>
                    <li className="nav-item">
                      <Link className="btn btn-outline-light me-2" to="/">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn btn-outline-success" to="/register">Register</Link>
                    </li>
                  </>
                )
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
