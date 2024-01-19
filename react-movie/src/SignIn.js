import React, { useState } from 'react';
import axios from "axios";
import './styles/Settings.css';

const RegistrationForm = () => {
    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post('http://localhost:3001/user/register', { uname, pw })
            .then(resp => {
                // Handle successful registration
                console.log('Registration successful');
                setRegistrationStatus('Registration successful. Please log in.');
                // Optionally, redirect to login page or another action
            })
            .catch(error => {
                if (error.response) {
                  // If the username already exists
                  if (error.response.status === 409) {
                    setRegistrationStatus('Username already exists. Please choose a different one.');
                  } else {
                    // Handle other specific error responses
                    setRegistrationStatus('Registration failed: ' + error.response.data.error);
                  }
                } else {
                  // Handle general network errors
                  setRegistrationStatus('Registration failed: ' + error.message);
                }
              });
    };

return (
    <div>
        <div className="status-message"><h2>Don't have an account? Sign in:</h2></div>
        <form onSubmit={handleSubmit}>
            <div className="box signin-box">
                <h3>Sign In</h3>
                <label htmlFor="username-reg">Username: </label>
                <input
                    type="text"
                    id="username-reg"
                    placeholder="Enter username" // Added placeholder
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                />

                <label htmlFor="password-reg">Password: </label>
                <input
                    type="password"
                    id="password-reg"
                    placeholder="Enter password" // Added placeholder
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />

                {registrationStatus && <div className="status-message">{registrationStatus}</div>}
                <button type="submit" className="submit-button">Register</button>
            </div>
        </form>
    </div>
);
}

export default RegistrationForm;