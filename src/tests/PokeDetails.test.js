import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as pokemonService from '../api/pokemonService';
import PokeDetails from '../components/PokeDetails';

jest.mock('../api/pokemonService');

describe('Pokemon Details', () => {
  beforeEach(() => {
    pokemonService.getPokemon.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' }, is_hidden: false }],
    });

    pokemonService.getMovesData.mockResolvedValue([
      { name: 'thunderbolt', type: { name: 'electric' }, damage_class: { name: 'special' } },
    ]);

    pokemonService.getFormsData.mockResolvedValue([
      { name: 'pikachu-form', sprites: { front_default: 'https://example.com/pikachu.png' } },
    ]);
  });
  test('fetches and displays Pokemon details', async () => {
    render(<PokeDetails selectedPokemon="pikachu" />);

    await waitFor(() => expect(screen.getByText(/static/i)).toBeInTheDocument());

    // Click on the "Moves" tab
    fireEvent.click(screen.getByRole('tab', { name: /moves/i, hidden: true }));
    await waitFor(() => expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument());

    // Click on the "Forms" tab
    fireEvent.click(screen.getByRole('tab', { name: /forms/i, hidden: true }));
    await waitFor(() => expect(screen.getByText(/pikachu-form/i)).toBeInTheDocument());
  });
});
