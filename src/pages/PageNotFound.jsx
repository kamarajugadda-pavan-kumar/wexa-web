import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
      <p className="text-xl font-semibold mb-2 text-gray-800">
        Oops! Page Not Found
      </p>
      <p className="text-gray-600 mb-8">
        It seems the page you're looking for doesn't exist.
      </p>

      <div className="mb-6">
        <span role="img" aria-label="confused face" className="text-7xl">
          😕
        </span>
      </div>

      <Link
        to="/"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
