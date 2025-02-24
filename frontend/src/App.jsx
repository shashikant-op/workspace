import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Workspace from './pages/workspace';
import Navbar from './components/navbar';
import './index.css';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import Footer from './pages/footer';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  
  const hideNavbar = location.pathname.startsWith('/admin');


  
  return (
    <>
     
     {!hideNavbar && <Navbar />}
     <div className={`bg-amber-50 min-h-screen ${!hideNavbar? 'pt-5' : ''}`}>
    
      <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:userId" element={<Workspace />}/>
            <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
         
          
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
