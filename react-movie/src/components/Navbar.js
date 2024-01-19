import { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa"
import { jwtToken, userData } from "./Signals";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";


function Navbar({ setTheme }) {
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    const handleTabClick = () => {
        showNavbar();
    };

    const handleLogout = () => {
        jwtToken.value = "";
        userData.value = null;
        showNavbar();
    };

    const handleToggleTheme = () => {
        if (setTheme) {
            setTheme((theme) => (theme === "light" ? "dark" : "light"));
        }
        showNavbar();
    };

    return (
        <header>
            <h4>NWADB</h4>
            <nav ref={navRef}>
                <Link to="/" onClick={() => handleTabClick()}>
                    Home
                </Link>
                <Link to="/actors" onClick={() => handleTabClick()}>
                    Actors
                </Link>

                <Link to="/getUser" onClick={() => handleTabClick()}>
                    Profiles
                </Link>
                <Link to="/group" onClick={() => handleTabClick()}>
                    Groups
                </Link>
                <Link to="/review" onClick={() => handleTabClick()}>
                    Reviews
                </Link>
                <Link to="/user" onClick={() => handleTabClick()}>
                    User
                </Link>
                <Link to="/recommend" onClick={() => handleTabClick()}>
                    Recommend
                </Link>
                {jwtToken.value.length === 0 && (
                    <Link to="/auth" onClick={() => handleTabClick()}>
                        Log In
                    </Link>
                )}
                {jwtToken.value.length > 0 && (
                    <Link to="/" onClick={() => handleLogout()}>
                        Log Out
                    </Link>
                )}


                <a onClick={handleToggleTheme}>Toggle Theme
                </a>

                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;