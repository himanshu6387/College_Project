import React, { useContext } from 'react'
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
import AdminDashBoard from './pages/AdminDashBoard'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import StudentRegister from './pages/StudentRegister'
import StudentRegisterForm from './pages/StudentRegsiterForm'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Signup from './pages/Signup'
import { AuthContext } from './context/AuthContext'

const App = () => {
    const { user } = useContext(AuthContext)  // destructure from context

    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    {/* If logged in -> redirect to dashboard, else show Login */}
                    <Route
                        path="/"
                        element={user ? <Navigate to="/admin/dashboard" /> : <Login />}
                    />

                    {/* Same check for signup */}
                    <Route
                        path="/signup"
                        element={user ? <Navigate to="/admin/dashboard" /> : <Signup />}
                    />

                    {/* Protect dashboard route */}
                    <Route
                        path="/admin/dashboard"
                        element={user ? <AdminDashBoard /> : <Navigate to="/" />}
                    />

                    {/* Other routes */}
                    <Route path="/student/register/:slug" element={<StudentRegisterForm />} />
                    <Route path="/register" element={<StudentRegister />} />
                </Routes>
                <Footer />
                <Toaster />
            </Router>
        </div>
    )
}

export default App
