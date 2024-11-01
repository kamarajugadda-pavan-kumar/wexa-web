import React from "react";
import config from "../config.json";
// Helper function to get the initial from the name
const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "";
};

const AvatarWithFallback = ({ name, avatar, size = "h-12 w-12" }) => {
  const [isAvatarLoaded, setIsAvatarLoaded] = React.useState(true);

  const handleImageError = (e) => {
    setIsAvatarLoaded(false); // Hide the image and show the fallback
  };

  return (
    <div className="relative">
      {isAvatarLoaded && avatar ? (
        <img
          className={`${size} flex-none rounded-full`}
          src={avatar}
          alt={name}
          onError={handleImageError} // Handle image load error
        />
      ) : (
        <div
          className={`${size} flex-none rounded-full bg-gray-300 text-white font-bold flex items-center justify-center`}
        >
          {getInitial(name)}
        </div>
      )}
    </div>
  );
};

export default AvatarWithFallback;
