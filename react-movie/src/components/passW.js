import {useState } from "react";

import axios from "axios";
import '../styles/Settings.css';


function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => { // Pass 'event' as a parameter
        event.preventDefault(); // Prevents the default form submission behavior
        if (newPassword !== confirmNewPassword) {
            setMessage("New passwords do not match!");
            return;
        }
    
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from local storage
    
            if (!token) {
                setMessage('No authentication token found. Please log in.');
                return;
            }
    
            await axios.put('http://localhost:3001/user/change-password', 
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            setMessage("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            const errorMessage = error.response?.data.error || error.message || "An error occurred";
            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box"> {/* Apply box class to the main div */}
            <h3>Change Password</h3> {/* Optional heading */}
            <form onSubmit={handleSubmit}> {/* Add form tag and onSubmit event */}
                <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    placeholder="Current Password" 
                />
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="New Password" 
                />
                <input 
                    type="password" 
                    value={confirmNewPassword} 
                    onChange={e => setConfirmNewPassword(e.target.value)} 
                    placeholder="Confirm New Password" 
                />
                <button type="submit" disabled={isLoading} className={isLoading ? "red-button" : ""}>
                    {isLoading ? "Changing..." : "Change Password"}
                </button>
                {message && <div className="status-message">{message}</div>} {/* Apply status-message class */}
            </form>
        </div>
    );
}

export {PasswordChangeForm};
