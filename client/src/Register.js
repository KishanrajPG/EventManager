import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Ensure the correct path for your CSS file
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [error, setError] = useState('');
    
    // Initialize the useNavigate hook
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/register', { name, email, password, role });
            console.log('Registration successful:', response.data);
    
            setName('');
            setEmail('');
            setPassword('');
            setRole('student');
            
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Display specific error message from server
            } else {
                setError('Registration failed, please try again.');
            }
        }
    };
    
    return (
        <div className="auth-container">
            <h2 className="auth-title">Register</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                <div className="mt-3 text-center">
                    <Link to="/login">Already have an account? Login here</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
