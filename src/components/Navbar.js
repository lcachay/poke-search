import React from 'react';
import avatar from '../assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  return (
    <div className="navbar bg-neutral shadow-sm flex justify-between">
      <div className="flex-1">
        <a onClick={() => navigate('/')} className="btn btn-ghost text-xl text-base-100 hover:bg-transparent">
          POKE-SEARCH
        </a>
      </div>
      <div className="flex gap-4 items-center">
        <p className="capitalize text-base-100">Hello {auth.username}!</p>
        <button className="btn btn-secondary" onClick={() => navigate('/logout')}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
