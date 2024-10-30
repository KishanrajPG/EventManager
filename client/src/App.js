import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './home';
import CreateEvent from './createEvent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createEvent" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
