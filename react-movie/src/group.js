import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtToken } from "./components/Signals";
import GroupCard from "./components/groupCard";
import SearchIcon from "./search.svg";

const Group = () => {
  const [mode, setMode] = useState("view");
  const [groups, setGroups] = useState([]);
  const [gname, setGroupName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [groupReviews, setGroupReviews] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [showJoinRequestWindow, setShowJoinRequestWindow] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showHeader, setShowHeader] = useState(false);


  const token = jwtToken.value;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleHideMessageTimer = (setterFunction) => {
    setTimeout(() => {
      setterFunction("");
    }, 3000);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const token = jwtToken.value;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get("http://localhost:3001/user/groups", {
          headers,
        });

        const sortedGroups = response.data.data.sort((a, b) =>
          a.gname.localeCompare(b.gname)
        );

        setGroups(sortedGroups);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const existingGroup = groups.find((group) => group.gname === gname);

      if (existingGroup) {
        setCreationMessage("Group with the same name already exists");
        handleHideMessageTimer(setCreationMessage);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/user/postGroup",
        { gname },
        { headers }
      );

      console.log("Group created successfully:", response.data);
      setCreationMessage("Group created successfully");
      handleHideMessageTimer(setCreationMessage);


      const createdGroupResponse = await axios.get(
        `http://localhost:3001/user/getCreatedGroup/${gname}`
      );

      const createdGroup = createdGroupResponse.data[0];


      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups"
      );
      setGroups(groupsResponse.data.data);

      await handleJoinGroup(createdGroup.groupid);
    } catch (error) {
      console.error("Create Group Error:", error);
      console.error(error.response?.data || error.message);
    }
    handleViewGroups();
  };

  const handleDeleteGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setDeleteMessage("Please log in to delete a group");
      handleHideMessageTimer(setDeleteMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (confirmed) {
      try {
        const response = await axios.post(
          `http://localhost:3001/user/deleteGroup/${groupid}`,
          {},
          { headers }
        );

        console.log("Response data:", groupid, response.data);

        setDeleteMessage("Group deleted successfully");
        handleHideMessageTimer(setDeleteMessage);

        const groupsResponse = await axios.get(
          "http://localhost:3001/user/groups",
          { headers }
        );
        setGroups(groupsResponse.data.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setDeleteMessage("Error deleting group");
        handleHideMessageTimer(setDeleteMessage);
      }
    }
    handleViewGroups();
  };

  const handleJoinGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setJoinMessage("Please log in to join a group.");
      handleHideMessageTimer(setJoinMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {

      const response = await axios.post(
        `http://localhost:3001/user/joinGroup/${groupid}`,
        {},
        { headers }
      );

      console.log("Response data:", response.data);
      setJoinMessage("Group joined successfully");
      handleHideMessageTimer(setJoinMessage);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setJoinMessage("Error joining group");
      handleHideMessageTimer(setJoinMessage);
    }
  };

  const handleSendRequest = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/user/joinRequest/${groupid}`,
        {},
        {
          headers
        }
      );

      console.log("Response data:", response.data);

      setJoinMessage("Join request sent successfully");
      handleHideMessageTimer(setJoinMessage);
    } catch (error) {
      console.error("An error occurred:", error);
      console.log("Error sending join request:", error);
    }
  };



  const handleViewGroup = async (groupid) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user/getGroup/${groupid}`
      );
      const groupDetails = response.data;

      setSelectedGroup(groupDetails);
      setSelectedGroupId(groupid);

      setMode("details");

      handleViewJoinRequests(groupid);

    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleViewJoinRequests = async (groupid) => {
    const token = jwtToken.value;
    console.log("handleViewJoinRequests called", token);

    if (!token) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log("handleViewJoinRequests called", token, "tässä tämä", headers);

    try {
      console.log("jwtToken:", token);
      const response = await axios.get(
        `http://localhost:3001/user/getRequest/${groupid}`,
        { headers }
      );

      console.log("Join requests:", response.data);

      // Check if the response data is an array and not empty
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Filter the join requests based on the expected groupid
        const filteredJoinRequests = response.data.filter(item => item.groupid === groupid);

        if (filteredJoinRequests.length > 0) {
          // Extract the data from the filtered response
          const joinRequestsData = filteredJoinRequests;

          setJoinRequests(joinRequestsData);

          // Show join request window
          setShowJoinRequestWindow(true);
        } else {
          setShowJoinRequestWindow(false);
          console.log("No join requests found for the specified groupid.");
        }
      } else {
        console.log("No data or empty array received.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleViewGroups = () => {

    setSelectedGroupId(null);
    setSelectedGroup(null);
    setSearchResults(null);

    setMode("view");
    setShowHeader(false);
    setShowJoinRequestWindow(false);

  };

  const handleLeaveGroup = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setLeaveMessage("Please log in to leave the group.");
      handleHideMessageTimer(setLeaveMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.delete(
        `http://localhost:3001/user/leaveGroup/${groupid}`,
        { headers }
      );

      console.log("Leave group response:", response.data);
      setLeaveMessage("Successfully left the group");
      handleHideMessageTimer(setLeaveMessage);

      const groupsResponse = await axios.get(
        "http://localhost:3001/user/groups",
        { headers }
      );
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setLeaveMessage("Error leaving group");
      handleHideMessageTimer(setLeaveMessage);
    }
  };

  const handleGroupReviews = async (groupid) => {
    const token = jwtToken.value;

    if (!token) {
      setLeaveMessage("Please log in to watch group reviews.");
      handleHideMessageTimer(setLeaveMessage);
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        `http://localhost:3001/user/groupReviews/${groupid}`,
        { headers }
      );

      const groupReviewsData = response.data;

      setGroupReviews(groupReviewsData);

      setMode("groupReviews");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleKickUser = async (usernameToKick) => {
    try {
      const groupid = selectedGroupId;
      await axios.delete(`http://localhost:3001/user/kickUser/${groupid}/${usernameToKick}`, {
        headers,
      });

      const groupsResponse = await axios.get("http://localhost:3001/user/groups", { headers });
      setGroups(groupsResponse.data.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleViewGroup(selectedGroupId);
  };

  const handleAcceptRequest = async (request) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/user/acceptRequest/${request.username}/${request.groupid}`,
        {},
        { headers }
      );

      console.log("Accept request response:", response.data);

      setJoinRequests((prevRequests) =>
        prevRequests.filter((r) => r.username !== request.username)
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleDeleteRequests(request);
    handleViewGroup(request.groupid);

  };

  const handleDeleteRequests = async (request) => {
    try {
      await axios.delete(
        `http://localhost:3001/user/deleteJoinRequest/${request.id}`,
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
    handleViewJoinRequests(request.groupid);
  };



  const handleRejectRequest = async (request) => {
    handleDeleteRequests(request);
  };

  const handleMyGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user/myGroups`,
        { headers }
      );
      const myGroups = response.data;
      setMyGroups(myGroups);

      setMode("myGroups");

    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleSearch = async () => {
    setMode("search");
    setShowHeader(true);
    try {
      const response = await fetch(
        `http://localhost:3001/user/searchGroups/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      const searchResults = await response.json();
      setSearchResults(searchResults);
      setSearchTerm(searchTerm);

    } catch (error) {
      console.error("Error fetching user search results:", error);
    }
  };


  return (

    <div>
      <div className="search">
        <input
          type="text"
          placeholder="Search for groups"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <img src={SearchIcon} alt="search" onClick={handleSearch} />
      </div>

      <div className="component-container">

        <div className="manage-buttons">
          <button onClick={handleViewGroups}>View Groups</button>
          <button onClick={() => setMode("create")}>Create Group</button>
          <button onClick={handleMyGroups}>My Groups</button>
        </div>

        {Array.isArray(searchResults) && (
          <div >
            {showHeader && (
              <h2>Search Results</h2>
            )}
            <div className='movie-list'>
              {searchResults.map((group) => (
                <div key={group.gname} className="actor-card">
                  <h3>{group.gname} </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          {mode === "view" && !selectedGroupId && (
            <div>
              <h2>All Groups</h2>
              <div className="movie-list">
                {groups.map((group) => (
                  <div key={group.groupid} className="actor-card">
                    <h3>{group.gname}</h3>
                    <button onClick={() => handleViewGroup(group.groupid)}>
                      View Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "create" && (
            <div>
              <h2>Create Group</h2>
              <div>
                <h5>Group Name:</h5>
                <input
                  type="text"
                  value={gname}
                  onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <button type="button" onClick={handleCreateGroup}>
                Create Group
              </button>
              {creationMessage && <p>{creationMessage}</p>}
            </div>
          )}

          {mode === "details" && selectedGroup && (
            <div>
              <div className="manage-buttons">
                <button onClick={() => handleDeleteGroup(selectedGroupId)}>
                  Delete
                </button>
                <button onClick={() => handleSendRequest(selectedGroupId)}>
                  Join
                </button>
                <button onClick={() => handleLeaveGroup(selectedGroupId)}>
                  Leave Group
                </button>
                <button onClick={() => handleGroupReviews(selectedGroupId)}>
                  Group Reviews
                </button>
              </div>
              <h2>{selectedGroup.gname} Details</h2>

              <div className="movie-list">
                {selectedGroup.users &&
                  selectedGroup.users.map((user) => (
                    <div key={user.username} className="actor-card">
                      <h3>{user.username}</h3>
                      <button onClick={() => handleKickUser(user.username)}>
                        Kick User
                      </button>
                    </div>
                  ))}
              </div>

              {showJoinRequestWindow && (
                <div>
                  <h2>Join Requests</h2>
                  <div className="movie-list">
                    {joinRequests.map((request) => (
                      <div key={request.id} className="actor-card">
                        <h3>{request.username} wants to join the group. </h3>
                        <button onClick={() => handleAcceptRequest(request)}>
                          Accept
                        </button>
                        <button onClick={() => handleRejectRequest(request)}>
                          Reject
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "groupReviews" && groupReviews.length > 0 && (
            <div>
              <h2>Group Reviews</h2>
              <div className="movie-list">
                {groupReviews.map((review) => (
                  <GroupCard key={review.reviewid} review={review}>
                    <div>
                      <p><strong>User:</strong> {review.username}</p>
                      <p><strong>Content:</strong> {review.content}</p>
                      <p><strong>User Vote Score:</strong> {review.uservotescore}</p>
                      <p><strong>Movie Name:</strong> {review.moviename}</p>
                      <p><strong>Date Posted:</strong> {review.dateposted}</p>
                    </div>
                  </GroupCard>
                ))}
              </div>
            </div>
          )}

          {mode === "myGroups" && myGroups && (
            <div>
              <h2>My Groups</h2>
              <div className="movie-list">
                {myGroups.map((group) => (
                  <div key={group.username} className="actor-card">
                    <h3>{group.gname}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display messages */}
          {creationMessage && <p>{creationMessage}</p>}
          {deleteMessage && <p>{deleteMessage}</p>}
          {joinMessage && <p>{joinMessage}</p>}
          {leaveMessage && <p>{leaveMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Group;