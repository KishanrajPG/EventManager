import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './login';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './home';
import CreateEvent from './createEvent';
import { AuthProvider, useAuth } from './Authcontext';
import ViewEvent from './View';

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { role } = useAuth();
  return role ? children : <Navigate to="/login" replace />;
};

const MainApp = () => {
  const { role, loading } = useAuth();

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                      path="/home"
                      element={
                          <ProtectedRoute>
                              {role === 'admin' ? <Navigate to="/createEvent" replace /> : <Home />}
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/createEvent"
                      element={
                          <ProtectedRoute>
                              {role === 'admin' ? <CreateEvent /> : <Navigate to="/home" replace />}
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/viewEvent/:eventId"
                      element={
                          <ProtectedRoute>
                              {role === 'admin' ? <ViewEvent /> : <Navigate to="/home" replace />}
                          </ProtectedRoute>
                      }
                  />
              </Routes>
          </div>
      </Router>
  );
};

export default App;
