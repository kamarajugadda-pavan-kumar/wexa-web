import config from "../config.json";
import axios from "axios";

const fetchFriendsList = async () => {
  try {
    const response = await axios.get(`${config.baseUrl}/api/v1/friends`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    throw new Error("Failed fetch friends list");
  }
};

const fetchSentFriendRequests = async () => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/api/v1/friend-requests-sent`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed fetch friends list");
  }
};

const fetchReceivedFriendRequests = async () => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/api/v1/friend-requests-received`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed fetch friends list");
  }
};

const acceptFriendRequest = async (requestId) => {
  try {
    const response = await axios.put(
      `${config.baseUrl}/api/v1/friend-requests/${requestId}/accept`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to accept friend request");
  }
};

const rejectFriendRequest = async (requestId) => {
  try {
    const response = await axios.put(
      `${config.baseUrl}/api/v1/friend-requests/${requestId}/reject`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to accept friend request");
  }
};

const sendFriendRequest = async (receiverId) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/api/v1/friend-requests`,
      { receiverId },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to send friend request");
  }
};

const deleteFriendRequest = async (requestId) => {
  try {
    const response = await axios.delete(
      `${config.baseUrl}/api/v1/friend-requests/${requestId}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to delete friend request");
  }
};

const searchUsers = async (query) => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/api/v1/friends/search?keyword=${query}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to search for users");
  }
};

const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${config.baseUrl}/api/v1/user/profile`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to fetch user profile");
  }
};

const updateUserProfile = async (updatedData) => {
  try {
    const response = await axios.patch(
      `${config.baseUrl}/api/v1/user/profile`,
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to update user profile");
  }
};

const fetchUserActivity = async () => {
  try {
    const response = await axios.get(`${config.baseUrl}/api/v1/activity`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to fetch user activity");
  }
};

const toggle2FA = async (enabled = true) => {
  try {
    const response = await axios.put(
      `${config.baseUrl}/api/v1/user/profile/2fa`,
      { enabled },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to toggle 2FA");
  }
};

export {
  fetchFriendsList,
  fetchSentFriendRequests,
  fetchReceivedFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  deleteFriendRequest,
  searchUsers,
  fetchUserProfile,
  updateUserProfile,
  fetchUserActivity,
  toggle2FA,
};
