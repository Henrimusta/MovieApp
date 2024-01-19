import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtToken } from "./Signals";
import '../styles/personalPage.css';

const LinkBox = () => {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [linkName, setLinkName] = useState('');
    const [personalLink, setPersonalLink] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const token = jwtToken.value;
                const headers = { 'Authorization': `Bearer ${token}` };
                const response = await axios.get('http://localhost:3001/user/getLinks', { headers });
                setLinks(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch links:', error);
                setIsLoading(false);
            }
        };
    
        fetchLinks();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = jwtToken.value;

        if (!token) {
            setStatusMessage('Please log in to add links.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const body = {
            linkName,
            personalLink
        };

        try {
            const response = await axios.post('http://localhost:3001/user/addLink', body, { headers });
            setLinkName('');
            setPersonalLink('');
            setStatusMessage('Link added successfully!');
            setLinks(currentLinks => [...currentLinks, response.data]);
        } catch (error) {
            console.error(error);
            setStatusMessage('Failed to add link: ' + (error.response?.data.error || error.message));
        }
    };

    const handleDelete = async (personalpageid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this link?");
        if (!confirmDelete) return;

        try {
            const token = jwtToken.value;
            await axios.delete(`http://localhost:3001/user/deleteLink/${personalpageid}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLinks(currentLinks => currentLinks.filter(link => link.personalpageid !== personalpageid));
        } catch (error) {
            console.error('Failed to delete link:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fi-FI', options);
    };

    if (isLoading) {
        return <p>Loading links...</p>;
    }

    return (
        <div className="link-box">
            <h2>Add a New Link</h2>
            <form onSubmit={handleSubmit}>
            <div className="link-input-section">
            <div className="form-field">
    <label htmlFor="linkName" className="input-label">Link Name/Description:</label>
    <input
        placeholder="Link Name/Description:" 
        type="text"
        id="linkName"
        value={linkName}
        onChange={e => setLinkName(e.target.value)}
        required
    />
</div>
<div className="form-field">
    <label htmlFor="personalLink" className="input-label">Link:</label>
    <input
         placeholder="Link:"
        type="url"
        id="personalLink"
        value={personalLink}
        onChange={e => setPersonalLink(e.target.value)}
        required
    />
</div>
</div>
                <button type="submit" className="submit-button">Add Link</button>
            </form>
            {statusMessage && <p className="status-message">{statusMessage}</p>}

            <h2>Your Links</h2>
{links.length > 0 ? (
    <ul>
        {links.map((link, index) => (
            <li key={index}>
                <div className="link-description">
                    {link.linkname || 'Unnamed Link'}
                </div>
                <a href={link.personallink} target="_blank" rel="noopener noreferrer">
                    {link.personallink}
                </a>
                <div>Link added: {formatDate(link.dateadded)}</div>
                <button onClick={() => handleDelete(link.personalpageid)} className="delete-button">Delete</button>
            </li>
        ))}
    </ul>
) : (
    <p>No links to display.</p>
)}
</div>
);
};

export {LinkBox} ;