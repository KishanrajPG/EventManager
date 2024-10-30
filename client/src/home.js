import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Home() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]); // Initialize state for events

    useEffect(() => {
        fetchEvents();
    }, []); // Empty dependency array to run only on mount

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');

        // Redirect to the login page
        navigate('/login'); // Change to your login route
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/events', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT token from local storage
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch events: ' + response.statusText);
            }
            const data = await response.json();
            setEvents(data); // Set the fetched events to state
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

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
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? ( // Check if there are events to display
                        events.map(event => (
                            <tr key={event.id}> {/* Ensure to use a unique key */}
                                <td>{event.name}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td> {/* Format date */}
                                <td>{event.type}</td>
                                <td>{event.description}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No events available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="btn btn-danger mt-4" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Home;
