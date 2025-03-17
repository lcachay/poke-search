'use client';

import React, { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import avatar from '../assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import { getPokemons, getPokemonsNames, searchPokemon } from '../api/pokemonService';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import PokeDetailsModal from '../components/PokeDetailsModal';

const SearchPage = () => {
  const navigate = useNavigate();
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const pokemons = await getPokemons();
      const names = await getPokemonsNames();
      startTransition(() => {
        setPokemonList(pokemons);
        setFilteredPokemons(pokemons);
        setPokemonNames(names);
      });
    }
    startTransition(() => {
      loadData();
    });
  }, []);

  const loadMore = useCallback(() => {
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
  }, [offset]);

  const handleSearch = (e) => {
    const value = e.target.value;

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

  const [setLastElement] = useInfiniteScroll(loadMore, hasMore);

  const toggleModal = (pokemon) => {
    setSelectedPokemon(pokemon.name ?? null);
    if (openDetailsModal) {
      dialogRef.current?.close();
    } else {
      dialogRef.current?.showModal();
    }
    setOpenDetailsModal((prev) => !prev);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar bg-neutral shadow-sm">
        <div className="flex-1">
          <a onClick={() => navigate('/')} className="btn btn-ghost text-xl text-base-100">
            POKE-SEARCH
          </a>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" className="bg-base-100" src={avatar} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => navigate('/logout')}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="m-auto container px-4 mt-20">
        <div className="flex justify-center mb-8">
          <label className="input w-full max-w-md flex items-center gap-2">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              onChange={handleSearch}
              type="search"
              placeholder="Search for your pokémon!"
              className="input input-bordered w-full"
            />
            {isPending && <span className="loading loading-ball loading-lg"></span>}
          </label>
        </div>

        <div className="pokemon-list">
          {filteredPokemons?.map((pokemon, index) => (
            <div
              key={index}
              onClick={() => toggleModal(pokemon)}
              className="card shadow-sm rounded-md hover:scale-105"
              ref={index === filteredPokemons.length - 1 ? setLastElement : null}
            >
              <figure className="bg-slate-300">
                {isPending || !pokemon.imgUrl ? (
                  <div className="skeleton h-50 w-full"></div>
                ) : (
                  <img className="w-full" src={pokemon.imgUrl} alt={pokemon.name} />
                )}
              </figure>
              <div className="card-body m-auto">
                <p className="card-title m-auto capitalize">{pokemon.name}</p>
              </div>
            </div>
          ))}
          {filteredPokemons?.length <= 0 && <p className="m-auto">No Pokémons Found</p>}
        </div>
      </div>

      <PokeDetailsModal selectedPokemon={selectedPokemon} toggleModal={toggleModal} dialogRef={dialogRef} />
    </div>
  );
};

export default SearchPage;
