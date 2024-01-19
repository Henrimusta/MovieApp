import React from 'react';
import {LinkBox} from './addLinks';
import { PasswordChangeForm } from "./passW";
import DeleteUser from "../DeleteUser";
import ShareableProfileLink from './ShareableProfileLink';
import '../styles/Settings.css';
import { jwtToken } from './Signals'; // Assuming jwtToken is imported from Signals

const UserPage = () => {
    // Check if the user is logged in
    const isLoggedIn = jwtToken.value; // Replace this with your actual check for the auth token

    if (!isLoggedIn) {
        return (
            <div className="logged-out-message">
                Please log in to view this page.
            </div>
        );
    }

    return (
        <div className="user-page">
            <h1>User Page</h1>
            <LinkBox /> 
            <ShareableProfileLink />
            <PasswordChangeForm />
            <DeleteUser />
            {/* You can add more user-specific components here */}
        </div>
    );
};

export default UserPage;