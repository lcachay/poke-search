import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext.js';
import { SearchPage } from '../pages/SearchPage.js';

describe('Login Page', () => {
  test('shows empty fields on initial load', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/username/i).value).toBe('');
    expect(screen.getByPlaceholderText(/password/i).value).toBe('');
  });

  test('shows error if fields are empty on login', () => {
    renderWithRouter(<LoginPage />);

    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('shows error if credentials are incorrect', () => {
    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('logs in and redirects on correct credentials, saves to local storage, and clears errors', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    // Mock localStorage setItem
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByText(/login/i));

    expect(window.location.pathname).toBe('/home');

    expect(setItemMock).toHaveBeenCalledWith('auth', '{"username":"admin"}');

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();

    jest.restoreAllMocks();
  });

  test('redirects to SearchPage if user is already logged in', async () => {
    // Mock localStorage with an authenticated user
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'auth') {
        return JSON.stringify({ username: 'admin' });
      }
      return null;
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Check that the current route is "/search"
    expect(window.location.pathname).toBe('/search');

    jest.restoreAllMocks();
  });
});
