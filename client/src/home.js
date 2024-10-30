import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Home() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [registers, setRegisters] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [candidateEmails, setCandidateEmails] = useState(['']);

    useEffect(() => {
        console.log(localStorage.getItem("userid"));
        fetchEvents();
        fetchRegistrations();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/events', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch events: ' + response.statusText);
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/registrations', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch registrations: ' + response.statusText);
            }
            const res = await response.json();
            console.log(res.registrations);
            setRegisters(res.registrations);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleRegister = async (eventId, type) => {
        if (type === 'team') {
            setSelectedEventId(eventId);
            setShowModal(true);
        } else {
            const userEmail = localStorage.getItem('email');
            await registerEvent(eventId, []);
        }
    };

    const registerEvent = async (eventId, emails) => {
        try {
            // Get the logged-in user's email from localStorage
            const userEmail = localStorage.getItem('email');

            // Add the user's email to the candidateEmails array
            const updatedEmails = [...emails, userEmail];

            const response = await fetch(`http://localhost:4000/api/register-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ event_id: eventId, candidateEmails: updatedEmails })
            });

            if (response.ok) {
                alert('Registration successful!');
                setShowModal(false);
                setCandidateEmails(['']); // Reset candidate emails
                fetchRegistrations();
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error registering for event:', error);
        }
    };

    const isRegistered = (eventId) => {
        return registers.some(
            (registration) => registration.event_id === eventId && registration.student_id === localStorage.getItem("userid")
        );
    };

    const addEmailField = () => setCandidateEmails([...candidateEmails, '']);

    const removeEmailField = (index) => {
        const updatedEmails = [...candidateEmails];
        updatedEmails.splice(index, 1);
        setCandidateEmails(updatedEmails);
    };

    const handleEmailChange = (index, value) => {
        const updatedEmails = [...candidateEmails];
        updatedEmails[index] = value;
        setCandidateEmails(updatedEmails);
    };

    // Email validation function
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleConfirmRegistration = () => {
        registerEvent(selectedEventId, candidateEmails);
    };

    // Check if all emails are valid
    const allEmailsValid = candidateEmails.every(email => isValidEmail(email));

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Home Table</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <tr key={event._id || index}>
                                <td>{event.name}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.type}</td>
                                <td>{event.description}</td>
                                <td>
                                    {!isRegistered(event._id) ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleRegister(event._id, event.type)}
                                        >
                                            Register
                                        </button>
                                    ) : (
                                        <span>Already Registered</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No events available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="btn btn-danger mt-4" onClick={handleLogout}>
                Logout
            </button>

            {/* Modal for Team Registration */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Register for Team Event</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {candidateEmails.map((email, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter team member's email"
                                            value={email}
                                            onChange={(e) => handleEmailChange(index, e.target.value)}
                                        />
                                        {candidateEmails.length > 1 && (
                                            <button className="btn btn-danger mt-2" onClick={() => removeEmailField(index)}>
                                                Remove
                                            </button>
                                        )}
                                        {!isValidEmail(email) && <div className="text-danger">Invalid email format</div>}
                                    </div>
                                ))}
                                <button className="btn btn-secondary mt-2" onClick={addEmailField}>
                                    Add Email
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" 
                                        onClick={handleConfirmRegistration} 
                                        disabled={!allEmailsValid}>
                                    Confirm Registration
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
