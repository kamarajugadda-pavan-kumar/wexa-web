import React, { useState, useEffect, useContext } from "react";
import { Send } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import AvatarWithFallback from "./AvatarWithFallback";
import { formatTime } from "../utils/timeFormatting";
import { UserContext } from "../context/UserContext";

const FriendSection = () => {
  const {
    friends,
    setFriends,
    sentRequests,
    setSentRequests,
    receivedRequests,
    setReceivedRequests,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friendsList");

  const handleAcceptRequest = async (request) => {
    let response = await acceptFriendRequest(request.requestId);
    setReceivedRequests(
      receivedRequests.filter((req) => req.requestId !== response.requestId)
    );
    console.log(friends, response);
    setFriends([...friends, response]);
  };

  const handleRejectRequest = async (request) => {
    await rejectFriendRequest(request.requestId);
    setReceivedRequests(
      receivedRequests.filter((req) => req.requestId !== request.requestId)
    );
  };

  return (
    <div className="w-full h-full border border-base-400 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Friends</h2>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        <button
          className={`tab  ${activeTab === "friendsList" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("friendsList")}
        >
          Friends List
        </button>
        <button
          className={`tab ${activeTab === "sentRequests" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("sentRequests")}
        >
          New request
        </button>
        <button
          className={`tab ${
            activeTab === "receivedRequests" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("receivedRequests")}
        >
          Pending Requests
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "friendsList" && <RenderFriendsList friends={friends} />}

        {activeTab === "sentRequests" && (
          <RenderNewRequest
            sentRequests={sentRequests}
            setSentRequests={setSentRequests}
          />
        )}
        {activeTab === "receivedRequests" && (
          <RenderReceivedRequests
            receivedRequests={receivedRequests}
            handleAccept={handleAcceptRequest}
            handleReject={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
};

const RenderFriendsList = ({ friends }) => {
  return (
    <ul role="list" className="">
      {friends.map((friend, index) => (
        <li key={index} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <AvatarWithFallback name={friend.name} avatar={friend.avatar} />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6">{friend.name}</p>
              <p className="mt-1 truncate text-xs leading-5">{friend.email}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 ">{friend.role}</p>
            <p className="mt-1 text-xs leading-5 ">
              {formatTime(friend.lastLogin)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const RenderNewRequest = ({ sentRequests, setSentRequests }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch search results whenever debouncedQuery changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.trim() === "") {
        setSearchResults([]);
        setDropdownVisible(false);
        return;
      }

      let users = await searchUsers(debouncedQuery);
      setSearchResults(users);
      setDropdownVisible(true);
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleFriendRequestSend = async (user) => {
    try {
      const request = await sendFriendRequest(user.id);
      setSentRequests([...sentRequests, request]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Handle when a user selects a search result
  const handleSelectRequest = (request) => {
    setSearchQuery(request.name);
    setSearchResults([]);
    setDropdownVisible(false);
  };

  const handleDelete = async (request) => {
    try {
      await deleteFriendRequest(request.requestId);
      setSentRequests(
        sentRequests.filter((r) => r.requestId !== request.requestId)
      );
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />

        {/* Dropdown for search results */}
        {isDropdownVisible && searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
            {searchResults.map((user, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <AvatarWithFallback
                    name={user.name}
                    avatar={user.profilePicture}
                    size="w-6 h-6 mr-3"
                  />
                  {user.name} ({user.email})
                </div>
                <div
                  className=" hover:bg-gray-600 cursor-pointer p-2 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFriendRequestSend(user);
                  }}
                >
                  <Send size={18} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section showing the original sent requests */}
      <h3 className="text-sm font-semibold leading-6 text-gray-600">
        Friend Requests You've Sent
      </h3>
      <ul role="list" className="">
        {sentRequests.map((request, index) => (
          <li
            key={index}
            className="flex justify-between gap-x-6 py-5 items-center"
          >
            <div className="flex min-w-0 gap-x-4">
              <AvatarWithFallback
                name={request.receiverName}
                avatar={request.receiverProfilePicture}
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 ">
                  {request.receiverName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 ">
                  {request.receiverEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleDelete(request)}
                className="px-4 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RenderReceivedRequests = ({
  receivedRequests,
  handleAccept,
  handleReject,
}) => {
  return (
    <>
      <h3 className="text-sm font-semibold leading-6 text-gray-600">
        Friend Requests You've received
      </h3>
      <ul role="list" className="">
        {receivedRequests.map((request, index) => (
          <li
            key={index}
            className="flex justify-between gap-x-6 py-5 items-center"
          >
            <div className="flex min-w-0 gap-x-4">
              <AvatarWithFallback
                name={request.senderName}
                avatar={request.senderProfilePicture}
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 ">
                  {request.senderName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 ">
                  {request.senderEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleAccept(request)}
                className="px-4 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request)}
                className="px-4 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FriendSection;
