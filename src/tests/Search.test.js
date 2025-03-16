import React from 'react';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import { AuthProvider } from '../context/AuthContext.js';
import * as pokemonService from '../api/pokemonService';
import LoginPage from '../pages/LoginPage.js';

jest.mock('../api/pokemonService');

const mockPokemons = [
  { name: 'pikachu', imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { name: 'bulbasaur', imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
  { name: 'charmander', imgUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
];

describe('Search Page', () => {
  beforeEach(() => {
    // Mock localStorage with the auth data
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'auth') {
        return '{"username":"admin"}';
      }
      return null;
    });
  });
  pokemonService.getPokemonsNames.mockResolvedValue(['pikachu', 'bulbasaur', 'charmander']);

  // Mock searchPokemon API call
  pokemonService.searchPokemon.mockImplementation(async (name) => {
    const pokemons = {
      pikachu: { name: 'pikachu', imgUrl: 'https://some-url.com/pikachu.png' },
    };
    return pokemons[name] || null;
  });

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });
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
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'nothing' } });

    // Expect empty state message
    await waitFor(() => {
      expect(screen.getByText(/no pokémons found/i)).toBeInTheDocument();
      expect(screen.queryByText(/pikachu/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/charmander/i)).not.toBeInTheDocument();
    });
  });
});
