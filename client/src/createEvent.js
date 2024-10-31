import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // New state for tracking edit mode

    // Fetch events from the API when the component mounts
    useEffect(() => {
  

        fetchEvents();
    }, []); // Empty dependency array to run only on mount

    
    const fetchEvents = async () => {
        try {
            const response = await fetch('https://eventmanagerbackend-bbxp.onrender.com/api/events', {
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const handleCreate = () => {
        setCurrentEvent(null); // Reset for new event
        setIsEditing(false); // Set to create mode
        setShowModal(true); // Show the modal
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token from local storage
        localStorage.removeItem('role'); // Clear the token from local storage

        navigate('/login'); // Redirect to the login page
    };

    const handleClose = () => {
        setShowModal(false); // Close the modal
        setCurrentEvent(null); // Reset current event
        setIsEditing(false); // Reset edit mode
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`https://eventmanagerbackend-bbxp.onrender.com/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const data = await response.json(); // Parse the JSON response
    
            if (!response.ok) {
                // Display the error message from the backend
                window.alert(data.message || 'Error deleting event');
                return;
            }
    
            setEvents(events.filter(event => event._id !== id));
            console.log('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            window.alert('An error occurred while deleting the event.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, date, type, description } = currentEvent;
    
        try {
            const method = currentEvent._id ? 'PUT' : 'POST'; // Determine method based on whether editing an existing event
            const url = currentEvent._id 
                ? `https://eventmanagerbackend-bbxp.onrender.com/api/events/${currentEvent._id}` 
                : `https://eventmanagerbackend-bbxp.onrender.com/api/events`;
    
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name,
                    date,
                    type,
                    description
                })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} event: ` + response.statusText);
            }
    
            const eventResponse = await response.json();
            if (method === 'POST') {
                setEvents([...events, eventResponse.event]); // For creating new event
            } else {
                setEvents(events.map(event => (event._id === currentEvent._id ? eventResponse.event : event))); // Update existing event
            }
    
            handleClose(); // Close modal after submission
        } catch (error) {
            console.error('Error handling event submission:', error);
        }
    };
    
    const handleView = (eventId) => {
        navigate(`/viewEvent/${eventId}`); // Pass the event ID in the URL
    };
    
    const handleEdit = (event) => {
        setCurrentEvent({
            ...event,
            date: new Date(event.date).toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
        });        
        setIsEditing(true); // Set to edit mode
        setShowModal(true); // Show the modal
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-4">Create Event</h2>
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
                    {events.map(event => (
                        <tr key={event._id}>
                            <td>{event.name}</td>
                            <td>{formatDate(event.date)}</td>
                            <td>{event.type}</td>
                            <td>{event.description}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(event)} className="me-2">
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(event._id)} className="me-2">
                                    Delete
                                </Button>
                                <Button variant="danger" onClick={() => handleView(event._id)}>
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-end mt-4" style={{ gap: '10px' }}>
                <button className="btn btn-danger" onClick={handleCreate}>
                    Create Event
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Modal for creating or editing an event */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Event' : 'Create Event'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter event title" 
                                value={currentEvent?.name || ''} // Use name for the event title
                                onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={currentEvent?.date || ''} 
                                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group controlId="formType">
                            <Form.Label>Type</Form.Label>
                            <Form.Select 
                                value={currentEvent?.type || ''} 
                                onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })} 
                                required
                            >
                                <option value="">Select event type</option>
                                <option value="individual">Individual</option>
                                <option value="team">Team</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter event description" 
                                value={currentEvent?.description || ''} 
                                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })} 
                                required 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            {isEditing ? 'Update Event' : 'Create Event'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CreateEvent;
