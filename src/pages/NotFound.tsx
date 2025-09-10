import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-blue-600 tracking-tight sm:text-8xl">404</h1>
      <p className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Page Not Found</p>
      <p className="mt-4 text-lg text-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;