import React, { useContext, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { UserContext } from "../context/UserContext";
import AvatarWithFallback from "./AvatarWithFallback";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import config from "../config.json";

const Navbar = () => {
  const { user, logout, handleWebSocketMessage } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const socket = new WebSocket(config.wsBaseUrl);

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "login", userId: user.id }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message from server:", data.message, data.data);
        handleWebSocketMessage(data);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        socket.close();
      };
    }
  }, [user]);

  return (
    <div className="p-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
          Connectify
        </h1>
      </Link>

      <ThemeToggle />
      {user ? (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className=" m-1">
            <AvatarWithFallback
              name={user.username}
              avatar={user.profilePicture}
            />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border-2"
          >
            <li>
              <Link to={"/profile"}>Profile</Link>
            </li>
            <li>
              <Link to={"/dashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to={"/user-feed"}>User Feed</Link>
            </li>
            <li>
              <a href="#" className="flex justify-between" onClick={logout}>
                Logout
                <LogOut />
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
