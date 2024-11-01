import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 animate-pulse">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 skeleton"></div>
        <div className="ml-3">
          <div className="h-4 w-24 bg-gray-200 rounded skeleton mb-1"></div>
          <div className="h-3 w-20 bg-gray-200 rounded skeleton"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full skeleton mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 skeleton mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 skeleton mb-2"></div>
      <div className="flex gap-2 mt-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-32 h-32 bg-gray-200 rounded-lg skeleton"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PostSkeleton;
