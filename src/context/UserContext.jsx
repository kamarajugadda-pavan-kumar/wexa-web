import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/userService";
import {
  fetchFriendsList,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  searchUsers,
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  deleteFriendRequest,
} from "../services/userService";
import authService from "../services/authService";
import { fetchUserPosts } from "../services/postService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFriends();
    fetchRequests();
    fetchReceivedRequests();
  }, [user]);

  // =================================================================
  // user profile , login and logout
  // =================================================================

  const fetchProfile = async () => {
    try {
      let user = await fetchUserProfile();
      setUser(user);
      if (window.location.pathname == "/login") {
        navigate("/dashboard");
        return;
      }
      navigate(window.location.pathname + window.location.search);
    } catch (error) {
      console.error("Failed to fetch user profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logoutService();
    } catch (error) {
      console.error("Failed to logout:", error.message);
      // Handle logout error (e.g., show error message)
    } finally {
      navigate("/login");
      setUser(null);
    }
  };

  // =================================================================
  // Friends list , friend request etc
  // =================================================================

  const fetchFriends = async () => {
    const friends = await fetchFriendsList();
    setFriends(friends);
  };

  const fetchRequests = async () => {
    const sentRequests = await fetchSentFriendRequests();
    setSentRequests(sentRequests);
  };

  const fetchReceivedRequests = async () => {
    const receivedRequests = await fetchReceivedFriendRequests();
    setReceivedRequests(receivedRequests);
  };

  // =================================================================
  // web socket messages handling
  // =================================================================
  const handleWebSocketMessage = ({ message, data }) => {
    console.log("Received WebSocket message:", message, data);
    if (
      message === "FRIEND_REQUEST_CREATED" ||
      message === "FRIEND_REQUEST_DELETED"
    ) {
      fetchReceivedRequests();
    } else if (message === "FRIEND_REQUEST_ACCEPTED") {
      // fetchFriends();
      setSentRequests(
        sentRequests.filter((request) => request.id !== data.requestId)
      );
      setFriends((prevFriends) => [...prevFriends, data]);
    } else if (message === "FRIEND_REQUEST_REJECTED") {
      setSentRequests(
        sentRequests.filter((request) => request.id !== data.requestId)
      );
    }
  };

  // =================================================================
  // user feed
  // =================================================================
  const fetchUserFeed = async () => {
    try {
      let feed = await fetchUserPosts();
      setPosts(feed);
    } catch (error) {
      console.error("Failed to fetch user feed:", error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        fetchProfile,
        friends,
        setFriends,
        sentRequests,
        setSentRequests,
        receivedRequests,
        setReceivedRequests,
        handleWebSocketMessage,
        posts,
        fetchUserFeed,
        setPosts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
