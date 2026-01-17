import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

const NotFound = () => <div className="p-20 text-center"><h1>404 - Page Not Found</h1><a href="/" className="text-sun-600">Go Home</a></div>

function App() {
    const { initialize } = useAuthStore()

    useEffect(() => {
        initialize()
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
