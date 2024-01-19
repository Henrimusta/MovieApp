import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import { Login } from "./components/Auth";
import DeleteUser from "./DeleteUser";
import Review from "./components/Review";
import Actor from "./actor";
import Group from "./group";
import UserPage from "./components/UserPage";
import UserProfile from "./components/showUserPage";
import UserSearch from "./components/userSearch";
import { jwtToken, userData } from "./components/Signals";
import Home from "./components/Home";
import RecommendMovie from "./components/recommendMovie";


const App = () => {
  const [theme, setTheme] = useState("light");

  const handleLogout = () => {
    jwtToken.value = "";
    userData.value = null;
  };

  return (
    <Router>
      <Navbar handleLogout={handleLogout} setTheme={setTheme} />
      <div className={`app ${theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actors" element={<Actor />} />
          <Route path="/review" element={<Review />} />
          <Route path="/recommend" element={<RecommendMovie />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/group" element={<Group />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/getUser" element={<UserSearch />} />
          <Route path="/getUser/:username" element={<UserProfile />} />
          <Route path="/auth" element={jwtToken.value.length === 0 ? <Login /> : <DeleteUser />} />
          {/* Additional routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;