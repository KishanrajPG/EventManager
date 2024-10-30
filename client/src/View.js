import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ViewEvent() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [registers, setRegisters] = useState([]);
    const { eventId } = useParams();
    // Fetch events and registrations from the API when the component mounts
    useEffect(() => {
        fetchEvents();
        fetchRegistrations();
    }, []); // Empty dependency array to run only on mount

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
            const response = await fetch(`http://localhost:4000/api/registrations/event/${eventId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch registrations: ' + response.statusText);
            }
            const res = await response.json();
            setRegisters(res.registrations);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleBack = () => {
        navigate('/createEvent'); // Redirect to the createEvent page
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAttendanceChange = (registrationId) => {
        setRegisters((prevRegisters) =>
            prevRegisters.map((reg) =>
                reg.registration_id === registrationId
                    ? { ...reg, attendance: !reg.attendance }
                    : reg
            )
        );
    };

    const handleScoreChange = (registrationId, value) => {
        setRegisters((prevRegisters) =>
            prevRegisters.map((reg) =>
                reg.registration_id === registrationId
                    ? { ...reg, score: value }
                    : reg
            )
        );
    };

    const handleSave = () => {
        // Logic to save attendance and scores to the API
        console.log("Save data:", registers);
        // You can implement the save functionality here, e.g., an API call to update the database.
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registrations</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Student Name</th>
                        <th scope="col">Student Email</th>
                        <th scope="col">Event Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Candidate Emails</th>
                        <th scope="col">Attendance</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {registers.map((registration) => {
                        // Find the event associated with the registration
                        const event = events.find(event => event._id === registration.event_id);

                        return (
                            <tr key={registration.registration_id}>
                                <td>{registration.student_name}</td>
                                <td>{registration.student_email}</td>
                                <td>{event ? event.name : 'Event Not Found'}</td>
                                <td>{event ? formatDate(event.date) : 'N/A'}</td>
                                <td>{event ? event.type : 'N/A'}</td>
                                <td>{event ? event.description : 'N/A'}</td>
                                <td>{registration.candidateEmails.join(', ')}</td>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={registration.attendance || false}
                                        onChange={() => handleAttendanceChange(registration.registration_id)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        value={registration.score || ''}
                                        onChange={(e) => handleScoreChange(registration.registration_id, e.target.value)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="d-flex justify-content-end mt-4" style={{ gap: '10px' }}>
                <Button variant="success" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="danger" onClick={handleBack}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}

export default ViewEvent;
