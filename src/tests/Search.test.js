import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import { AuthProvider } from '../context/AuthContext';
import * as pokemonService from '../api/pokemonService';

jest.mock('../api/pokemonService');

const mockPokemons = {
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  ],
};

describe('Search Page', () => {
  test('fetches and displays Pokemon list', async () => {
    pokemonService.getPokemons.mockResolvedValue(mockPokemons);

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    });
  });

  test('filters Pokémon list based on search input', async () => {
    pokemonService.getPokemons.mockResolvedValue(mockPokemons);

    render(<SearchPage />);
    // Wait for the Pokémon list to load
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'pika' } });
    // Ensure only "Pikachu" is shown, and others are removed
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/charmander/i)).not.toBeInTheDocument();
    });
  });

  test('shows no pokemons found if no Pokémon match search', async () => {
    pokemonService.getPokemons.mockResolvedValue(mockPokemons);

    render(<SearchPage />);

    // Type a non-matching query
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'xyz' } });

    // Expect empty state message
    await waitFor(() => {
      expect(screen.getByText(/no pokémon found/i)).toBeInTheDocument();
      expect(screen.queryByText(/pikachu/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/charmander/i)).not.toBeInTheDocument();
    });
  });

  test('redirects to Login if accessing while not logged in', () => {
    storage.getAuth.mockReturnValue(null); // No logged-in user

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/search']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(window.location.pathname).toBe('/login');
  });
});
