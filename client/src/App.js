import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './home';
import CreateEvent from './createEvent';
import { AuthProvider, useAuth } from './Authcontext';

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const MainApp = () => {
  const { role, loading } = useAuth();

  // While loading, you can show a loading indicator or nothing at all
  if (loading) {
    return <div>Loading...</div>; // Or any loading spinner you prefer
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Conditional rendering based on role */}
          <Route path="/home" element={role === 'admin' ? <Navigate to="/createEvent" replace /> : <Home />} />
          <Route path="/createEvent" element={role === 'admin' ? <CreateEvent /> : <Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
