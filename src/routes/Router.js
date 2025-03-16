import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SearchPage from '../pages/SearchPage';
import { useAuth } from '../context/AuthContext';
import NotFoundPage from '../pages/NotFoundPage';

export const PrivateRoute = () => {
  const { auth } = useAuth();
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const { auth } = useAuth();
  return auth ? <Navigate to="/search" replace /> : <Outlet />;
};

const Logout = () => {
  const { logout } = useAuth();
  logout();

  return <Navigate to="/" replace />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
