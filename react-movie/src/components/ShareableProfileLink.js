import React, { useState, useEffect } from 'react';
import { jwtToken } from './Signals';
import { jwtDecode } from 'jwt-decode';
import '../styles/personalPage.css';

const ShareableProfileLink = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = jwtToken.value;
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.username); // Assuming the username is stored in the token
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);



    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:3000/getUser/${username}`)
            .then(() => {
                alert("Link copied to clipboard!"); // Or use a more subtle notification
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
    };

    return (
        <div className="link-box">
            {username && (
                <div>
                    <h2>Your Shareable Profile Link:</h2>
                    <div className="link-input-container">
                        <input 
                            className="shareable-link-input" 
                            type="text" 
                            value={`http://localhost:3000/getUser/${username}`} 
                            readOnly 
                        />
                        <button onClick={copyToClipboard} className="submit-button">Copy</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ShareableProfileLink;