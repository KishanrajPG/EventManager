import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext'; // Import the useAuth hook

const Login = () => {
    const { setRole } = useAuth(); // Get the setRole function from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
            console.log(response.data);
            const { token, role, email: userEmail, userid } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('userid', userid);

            setRole(role); // Update role in the context

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
                {error && <div className="error-message">{error}</div>}
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
            <div className="footer-info mt-4 text-center">
                <p>Made by Kishanraj PG using MERN Stack</p>
                <p>Email: <a href="mailto:kish9723@gmail.com">kish9723@gmail.com</a></p>
                <p>Phone: <a href="tel:+919964693517">+91 9964693517</a></p>
                <p><a href="https://www.linkedin.com/in/kishanrajpg/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            </div>
        </div>
    );
};

export default Login;
