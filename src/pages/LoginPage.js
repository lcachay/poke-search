import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { replace, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleValidations = (username, password) => {};

  const handleSubmit = (e) => {
    setError('');
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    handleValidations(username, password);

    try {
      login(username, password);
      console.log('Navigating to /search...');
      navigate('/search');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-100 hero-background-image">
      <div className="card bg-base-100 shadow-xl card-login">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <p className="fieldset-label text-error font-bold">{error}</p>
          <div>
            <label className="fieldset-label">Username</label>
            <input
              required
              name="username"
              type="text"
              placeholder="Username"
              className={`input w-full validator ${error && 'input-error'}`}
            />
            <p className="validator-hint hidden">Username is required</p>
          </div>
          <div>
            <label className="fieldset-label">Password</label>
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className={`input w-full validator ${error && 'input-error'}`}
            />
            <p className="validator-hint hidden">Password is required</p>
          </div>

          <div className="card-actions justify-start">
            <button type="submit" className="btn btn-primary">
              LOGIN →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
