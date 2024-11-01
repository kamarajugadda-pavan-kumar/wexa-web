import React, { useContext, useState, useEffect } from "react";
import { Clock, Activity, User } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { formatTime } from "../utils/timeFormatting";
import { fetchUserActivity } from "../services/userService";
import { showFailureToast } from "../utils/toast";
import FriendSection from "../components/FriendSection";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [activities, setActivities] = useState([]);

  const fetchUserActivities = async () => {
    try {
      let activities = await fetchUserActivity();
      setActivities(activities);
    } catch (err) {
      console.error("Failed to fetch user activities:", err.message);
      showFailureToast("Failed to fetch user activities");
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, []);

  return (
    <div className="min-h-screen h-full p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 h-full gap-6">
        {/* Main Dashboard Card */}
        <div className="md:col-span-2 h-full rounded-2xl shadow-lg p-6 space-y-6 border border-base-400">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <User className="text-blue-500" />
                Welcome Back, {user.username}!
              </h2>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last logged in: {formatTime(user.lastLogin)}
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="border-t pt-6 ">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-3">
              <Activity className="text-green-500" />
              Recent Activities
            </h3>

            {activities.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    className="rounded-lg p-4 transition-all 
                    hover:bg-gray-200 hover:shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium ">{activity.activityType}</p>
                      <span className="text-xs">
                        {formatTime(activity.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent activities
              </div>
            )}
          </div>
        </div>

        {/* Friends Section */}
        <div className="md:col-span-1 h-full">
          <FriendSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
