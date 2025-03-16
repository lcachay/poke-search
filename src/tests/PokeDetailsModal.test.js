import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PokeDetailsModal } from '../components/PokeDetailsModal';
import * as pokemonService from '../api/pokemonService';
import { SearchPage } from '../pages/SearchPage';

jest.mock('../api/pokemonService');

const mockPokemonDetail = {
  name: 'pikachu',
  abilities: [{ ability: { name: 'static' } }],
  moves: [{ move: { name: 'thunderbolt' } }],
  forms: [{ name: 'pikachu-form' }],
};

describe('Pokemon Details Modal', () => {
  test('fetches and displays Pokemon details', async () => {
    pokemonService.getPokemon.mockResolvedValue(mockPokemonDetail);

    render(<SearchPage />);

    await waitFor(() => expect(screen.getByText(/pikachu/i)).toBeInTheDocument());
    expect(screen.getByText(/static/i)).toBeInTheDocument();
    expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument();
    expect(screen.getByText(/pikachu-form/i)).toBeInTheDocument();
  });

  test('closes when close button is clicked', () => {
    const handleClose = jest.fn();

    render(<PokeDetailsModal pokemonId="25" isOpen={true} onClose={handleClose} />);
    fireEvent.click(screen.getByText(/close/i));

    expect(handleClose).toHaveBeenCalled();
  });
});
