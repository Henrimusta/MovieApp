// MovieSearch.js
import React, { useState } from "react";
import SearchIcon from "../search.svg";
import "../styles/App.css";

const MovieSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="search">
            <input
                placeholder="Search for movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src={SearchIcon} alt="search" onClick={handleSearch} />
        </div>
    );
};

export default MovieSearch;
