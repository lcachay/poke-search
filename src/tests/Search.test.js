import React from 'react';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import { AuthProvider } from '../context/AuthContext.js';
import * as pokemonService from '../api/pokemonService';
import LoginPage from '../pages/LoginPage.js';

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

    renderWithRouter('/search');

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    });
  });

  test('filters Pokémon list based on search input', async () => {
    pokemonService.getPokemons.mockResolvedValue(mockPokemons);

    renderWithRouter('/search');

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

    renderWithRouter('/search');

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
});
