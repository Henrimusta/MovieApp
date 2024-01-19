import React, { useState } from 'react';
import axios from 'axios';
import './styles/Settings.css';
import { jwtToken, userData } from "./components/Signals";


const DeleteUser = () => {
    const [deleteStatus, setDeleteStatus] = useState('');

    const handleDelete = () => {

            // Confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
        return; // If user cancels, exit the function
    }

        const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from local storage
        // console.log('Token being sent:', token); // Debugging: Log the token


        if (!token) {
            setDeleteStatus('No authentication token found. Please log in.');
            return;
        }

        axios.delete('http://localhost:3001/user/delete', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setDeleteStatus('Account successfully deleted.');

                // Reset the signals
                jwtToken.value = '';
                userData.value = null;

                // Clear the token from local storage
                localStorage.removeItem('jwtToken');

                // Redirect user to the home page
                 window.location.reload();
            })
            .catch(error => {
                const errorMessage = error.response?.data || error.message;
                console.error("Error during user deletion:", errorMessage);
                setDeleteStatus('Failed to delete account: ' + errorMessage);
            });
    };

    return (
        <div className="delete-box">
            <h2>Delete Your Account</h2>
            <p>This action is irreversible. Please proceed with caution.<br>
            </br>
            It will delete all your data and you will not be able to recover it.
            </p>
            <div className='red-container'>
                <button onClick={handleDelete} className="red-button">Delete My Account</button>
            </div>
            {deleteStatus && <p>{deleteStatus}</p>}
        </div>
    );
};

export default DeleteUser;