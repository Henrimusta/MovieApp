// UserSearch.js
import React, { useState } from "react";
import SearchIcon from "../search.svg";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../styles/App.css";

const UserSearch = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/user/getSpecificUsers/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error("Error fetching user search results:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call handleSearch when Enter key is pressed
      handleSearch(onUserSelect);
    }
  };

  return (
    <div className="user-search-container">
      <div className="search">
        <input
          type="text"
          placeholder="Search profiles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => handleSearch(onUserSelect)}
        />
      </div>
      <ul className="user-list">
        {searchResults.map((user) => (
          <li key={user.username}>
            {/* Use Link to navigate to the user profile page */}
            <Link to={`/getUser/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default UserSearch;
