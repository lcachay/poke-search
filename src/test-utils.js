import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './routes/Router';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/search" element={<SearchPage />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

export * from '@testing-library/react';
export { renderWithRouter };
