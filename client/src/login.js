import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Ensure the correct path for your CSS file
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error messages
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform login logic
            const response = await axios.post('http://localhost:4000/api/login', { email, password });
            // Handle successful login
            console.log(response.data);
            const { token, role, email: userEmail, userid } = response.data; // Rename extracted email to avoid conflict
    
            // Store the token, role, and email in localStorage or sessionStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('email', userEmail); // Use renamed variable
            localStorage.setItem('userid', userid); // Use renamed variable

            // Redirect based on role
            if (role === 'student') {
                navigate('/home');
            } else if (role === 'admin') {
                navigate('/createEvent');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials, please try again.');
        }
    };
    

    return (
        <div className="auth-container">
            <h2 className="auth-title">Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>} {/* Display error message */}
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
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="mt-3 text-center">
                    <Link to="/register">Don't have an account? Register here</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
