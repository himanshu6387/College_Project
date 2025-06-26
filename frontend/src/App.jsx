    import React from 'react'
    import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
    import AdminDashBoard from './pages/AdminDashBoard'
    import Login from './pages/Login'
    import Navbar from './components/Navbar'
    import StudentRegister from './pages/StudentRegister'
    import StudentRegisterForm from './pages/StudentRegsiterForm'
    import {Toaster} from 'react-hot-toast'

    const App = () => {
        return (
            <div>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
                        <Route path="/student/register/:slug" element={<StudentRegisterForm />} />
                        <Route path="/register" element={<StudentRegister />} />
                    </Routes>
                    <Toaster/>
                </Router>
            </div>
        )
    }

    export default App
