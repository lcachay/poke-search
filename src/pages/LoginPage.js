import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';

const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setError('');
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      login(username, password);
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

          <Input
            label="Username"
            validatorHint="Username is required"
            required
            name="username"
            type="text"
            placeholder="Username"
          />
          <Input
            label="Password"
            validatorHint="Password is required"
            required
            name="password"
            type="password"
            placeholder="Password"
          />

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
