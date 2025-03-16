import React from 'react';
import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import { createMemoryHistory } from 'history';

describe('Login Page', () => {
  test('shows empty fields on initial load', () => {
    renderWithRouter('/login');

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/username/i).value).toBe('');
    expect(screen.getByPlaceholderText(/password/i).value).toBe('');
  });

  test('shows error if fields are empty on login', () => {
    renderWithRouter('/login');

    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('shows error if credentials are incorrect', () => {
    renderWithRouter('/login');

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('logs in on correct credentials, saves to local storage, and clears errors', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    // Mock localStorage setItem
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    renderWithRouter('/login');

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByText(/login/i));

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    expect(setItemMock).toHaveBeenCalledWith('auth', '{"username":"admin"}');

    jest.restoreAllMocks();
  });
});
