import AvatarWithFallback from "../AvatarWithFallback";

const Post = ({ post }) => {
  const { user, text, media, createdAt } = post;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-center mb-2">
        <AvatarWithFallback name={user.username} avatar={user.profilePicture} />
        {/* <img
          src={user.profilePicture || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        /> */}
        <div className="ml-3">
          <h4 className="font-semibold text-gray-800">{user.username}</h4>
          <span className="text-sm text-gray-500">
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(createdAt))}
          </span>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{text}</p>
      {media && (
        <div className="flex gap-2 mt-2">
          {media.map((item) => (
            <div key={item.id}>
              {item.mediaType === "image" ? (
                <img
                  src={item.mediaUrl}
                  alt="Media"
                  className="max-h-60 rounded-lg"
                />
              ) : (
                <video controls className="max-h-60 rounded-lg">
                  <source src={item.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
