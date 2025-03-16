import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';

describe('Login Page', () => {
  test('shows empty fields on initial load', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/username/i).value).toBe('');
    expect(screen.getByPlaceholderText(/password/i).value).toBe('');
  });

  test('shows error if fields are empty on login', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('shows error if credentials are incorrect', () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('logs in and redirects on correct credentials, saves to local storage, and clears errors', () => {
    // Mock localStorage setItem
    const setItemMock = jest.spyOn(Storage.prototype, 'setItem');

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByText(/login/i));

    expect(window.location.pathname).toBe('/home');

    expect(setItemMock).toHaveBeenCalledWith('auth', '{"username":"admin"}');

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();

    setItemMock.mockRestore();
  });

  test('redirects to Home if user is already logged in', () => {
    storage.getAuth.mockReturnValue({ username: 'admin' });

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

    expect(window.location.pathname).toBe('/home');
  });
});
