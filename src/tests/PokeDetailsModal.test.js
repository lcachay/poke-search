import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PokeDetailsModal from '../components/PokeDetailsModal';
import * as pokemonService from '../api/pokemonService';

jest.mock('../api/pokemonService');

describe('Pokemon Details Modal', () => {
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
    render(
      <PokeDetailsModal
        selectedPokemon="pikachu"
        dialogRef={{ current: document.createElement('dialog') }}
        toggleModal={jest.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText(/pikachu/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/static/i)).toBeInTheDocument());

    // Click on the "Moves" tab
    fireEvent.click(screen.getByRole('tab', { name: /moves/i, hidden: true }));
    await waitFor(() => expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument());

    // Click on the "Forms" tab
    fireEvent.click(screen.getByRole('tab', { name: /forms/i, hidden: true }));
    await waitFor(() => expect(screen.getByText(/pikachu-form/i)).toBeInTheDocument());
  });

  test('closes when close button is clicked', () => {
    render(
      <PokeDetailsModal
        selectedPokemon="pikachu"
        dialogRef={{ current: document.createElement('dialog') }}
        toggleModal={jest.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText(/close/i));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
