import React from 'react';
import { Link } from 'react-router-dom';
import notFound from '../assets/404.png';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center">
      <img src={notFound} alt="404 Not Found" aria-label="404 not found"></img>
      <p className="text-xl mt-4">Looks like a wild 404 appeared!</p>
      <Link to="/" className="btn btn-primary mt-6">
        <ArrowLeftIcon className="w-4" />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
