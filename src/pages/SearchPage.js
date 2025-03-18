'use client';

import React, { useState, useTransition, useCallback, useEffect } from 'react';
import { getPokemons, getPokemonsNames, searchPokemon } from '../api/pokemonService';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Navbar from '../components/Navbar';
import Searchbar from '../components/Searchbar';
import PokemonCard from '../components/PokemonCard';
import Modal from '../components/Modal';
import PokeDetails from '../components/PokeDetails';

const SearchPage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      const pokemons = await getPokemons();
      startTransition(async () => {
        const names = await getPokemonsNames();
        setPokemonList(pokemons);
        setFilteredPokemons(pokemons);
        setPokemonNames(names);
      });
    }
    loadData();
  }, []);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (isPending) return;
    startTransition(async () => {
      const nextOffset = offset + 20;

      try {
        const morePokemons = await getPokemons(nextOffset, 20);
        if (morePokemons.length === 0) {
          setHasMore(false);
        } else {
          setPokemonList((prev) => [...prev, ...morePokemons]);
          setFilteredPokemons((prev) => [...prev, ...morePokemons]);
          setOffset(nextOffset);
        }
      } catch (error) {
        console.error('Error loading more Pokémon:', error);
      }
    });
  }, [offset, isPending]);

  const [setLastElement] = useInfiniteScroll(loadMore, hasMore);

  // Search section
  const handleSearch = (e) => {
    const value = e.target.value.trim();

    startTransition(async () => {
      if (value === '') {
        setFilteredPokemons(pokemonList);
        return;
      }

      const matchedNames = pokemonNames?.filter((name) => name.toLowerCase().includes(value.toLowerCase()));

      const matchedPokemons = await Promise.all(
        matchedNames?.slice(0, 20).map(async (name) => await searchPokemon(name))
      );

      setFilteredPokemons(matchedPokemons.filter((pokemon) => pokemon !== null));
    });
  };

  // Modal section
  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setOpenDetailsModal(true);
  };
  const closeModal = () => {
    setSelectedPokemon(null);
    setOpenDetailsModal(false);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />
      <div className="m-auto container px-4 mt-20">
        <Searchbar handleSearch={handleSearch} isPending={isPending} />

        <div className="pokemon-list">
          {filteredPokemons?.map((pokemon, index) => (
            <PokemonCard
              key={index}
              pokemon={pokemon}
              index={index}
              isPending={isPending}
              onClick={() => openModal(pokemon)}
              ref={index === filteredPokemons.length - 1 ? setLastElement : null}
            />
          ))}
          {filteredPokemons?.length <= 0 && <p className="m-auto">No Pokémons Found</p>}
        </div>
      </div>
      {openDetailsModal && (
        <Modal
          title={`#${selectedPokemon?.id} - ${selectedPokemon?.name}`}
          isOpen={openDetailsModal}
          onClose={closeModal}
        >
          <PokeDetails selectedPokemon={selectedPokemon?.name} />
        </Modal>
      )}
    </div>
  );
};

export default SearchPage;
