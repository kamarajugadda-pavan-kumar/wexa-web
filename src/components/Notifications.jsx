import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("/api/notifications")
  //     .then((response) => setNotifications(response.data));
  // }, []);

  return (
    <div className="shadow-md p-4 rounded border border-base-400">
      <h3 className="text-lg font-bold">Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="mt-2">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
