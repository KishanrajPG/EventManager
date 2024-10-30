import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
    
        // Redirect to the login page
        navigate('/login'); // Change to your login route
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
          <tr>
            <td>Example Title</td>
            <td>2024-10-30</td>
            <td>Example Type</td>
            <td>This is an example description.</td>
          </tr>
          <tr>
            <td>Another Title</td>
            <td>2024-10-31</td>
            <td>Another Type</td>
            <td>This is another description.</td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;
