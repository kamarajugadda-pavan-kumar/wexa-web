// import { useState, useContext } from "react";
// import { UserContext } from "../context/UserContext";
// import axios from "axios";
// import AvatarWithFallback from "../components/AvatarWithFallback";
// import { updateUserProfile } from "../services/userService";
// import QRcodeComponent from "../components/QRcodeComponent";

// function Profile() {
//   const { user, loading } = useContext(UserContext);
//   const [profile, setProfile] = useState(user);
//   const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
//   const [selectedFile, setSelectedFile] = useState(null); // For profile picture upload

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     // Update profile details
//     const formData = new FormData();
//     formData.append("username", profile.username);
//     formData.append("email", profile.email);
//     formData.append("themePreference", profile.themePreference);
//     formData.append("bio", profile.bio);
//     formData.append("twoFactorEnabled", profile.twoFactorEnabled);

//     if (selectedFile) {
//       formData.append("profilePicture", selectedFile);
//     }

//     await updateUserProfile(formData);
//     setIsEditing(false);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="max-w-lg mx-auto p-6 shadow-md rounded-lg">
//       <h1 className="text-3xl font-semibold mb-6">Profile</h1>

//       <div className="flex items-center mb-6">
//         <div className="relative">
//           <AvatarWithFallback
//             name={profile.username}
//             avatar={profile.profilePicture}
//             className="w-24 h-24 rounded-full object-cover"
//           />
//           {isEditing && (
//             <input
//               type="file"
//               onChange={(e) => setSelectedFile(e.target.files[0])}
//               className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
//               title="Change profile picture"
//             />
//           )}
//         </div>
//         <div className="ml-4">
//           <h2 className="text-xl font-semibold">
//             {profile.username} ({profile.role})
//           </h2>
//           <p className="text-gray-600">{profile.email}</p>
//         </div>
//       </div>

//       {isEditing ? (
//         <form onSubmit={handleUpdate}>
//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Username</label>
//             <input
//               type="text"
//               value={profile.username}
//               onChange={(e) =>
//                 setProfile({ ...profile, username: e.target.value })
//               }
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter your username"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Email</label>
//             <input
//               type="email"
//               value={profile.email}
//               onChange={(e) =>
//                 setProfile({ ...profile, email: e.target.value })
//               }
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Theme Preference</label>
//             <select
//               value={profile.themePreference}
//               onChange={(e) =>
//                 setProfile({ ...profile, themePreference: e.target.value })
//               }
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="light">Light</option>
//               <option value="dark">Dark</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Bio</label>
//             <textarea
//               value={profile.bio}
//               onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Tell us about yourself"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">
//               Two-Factor Authentication
//             </label>
//             <input
//               type="checkbox"
//               checked={profile.twoFactorEnabled}
//               onChange={(e) =>
//                 setProfile({
//                   ...profile,
//                   twoFactorEnabled: e.target.checked,
//                 })
//               }
//               className="mr-2"
//             />
//             <span>{profile.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
//           >
//             Save Changes
//           </button>
//         </form>
//       ) : (
//         <button
//           onClick={() => setIsEditing(true)}
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           Edit Profile
//         </button>
//       )}
//     </div>
//   );
// }

// export default Profile;

import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import QRcodeComponent from "../components/QRcodeComponent";
import {
  Edit,
  Loader2,
  Camera,
  X,
  Check,
  Mail,
  Palette,
  User,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { toggle2FA, updateUserProfile } from "../services/userService";
import AvatarWithFallback from "../components/AvatarWithFallback";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    user.twoFactorEnabled || false
  );
  const [qrCodeUri, setQRCodeUri] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleToggle2FA = async () => {
    setIs2FALoading(true);
    try {
      const { twoFactorEnabled, qrCodeUri } = await toggle2FA(!is2FAEnabled);
      setIs2FAEnabled(twoFactorEnabled);
      setQRCodeUri(qrCodeUri);
    } catch (error) {
      console.error("Error updating two-factor authentication:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("themePreference", profile.themePreference);
    formData.append("bio", profile.bio);

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    await updateUserProfile(formData); // Assumes an updateUserProfile function is defined to handle API calls
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(user);
    setSelectedFile(null); // Reset selected file
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfile({ ...profile, profilePicture: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <AvatarWithFallback
              name={profile.username}
              avatar={profile.profilePicture}
              size="h-32 w-32"
            />
            {isEditing && isImageHovered && (
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity"
              >
                <Camera className="text-white" size={24} />
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {profile.username}
          </h3>
          <p className="text-gray-500">{profile.email}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Field */}
            <div className="relative">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <User size={18} />
                <label className="font-medium">Username</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                  {profile.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Mail size={18} />
                <label className="font-medium">Email</label>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                  {profile.email}
                </p>
              )}
            </div>

            {/* Theme Preference Field */}
            <div className="relative">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Palette size={18} />
                <label className="font-medium">Theme Preference</label>
              </div>
              {isEditing ? (
                <select
                  name="themePreference"
                  value={profile.themePreference}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                  {profile.themePreference}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div className="relative md:col-span-2">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MessageSquare size={18} />
                <label className="font-medium">Bio</label>
              </div>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={is2FALoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  is2FAEnabled ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    is2FAEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {is2FAEnabled && qrCodeUri && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <QRcodeComponent url={qrCodeUri} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center gap-4 pt-6 border-t">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Check size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
