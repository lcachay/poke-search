import React, { useEffect, useState, useTransition } from 'react';
import { getFormsData, getMovesData, getPokemon } from '../api/pokemonService';
import AbilitiesList from './AbilitiesList';
import MovesList from './MovesList';
import FormsList from './FormsList';

const PokeDetails = ({ selectedPokemon }) => {
  const [isPending, startTransition] = useTransition();
  const [pokemon, setPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState('abilities');
  const [forms, setForms] = useState([]);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    async function loadData() {
      const pokemonDetails = await getPokemon(selectedPokemon);
      startTransition(async () => {
        const movesData = await getMovesData(pokemonDetails.moves);
        const formsData = await getFormsData(pokemonDetails.forms);

        setPokemon(pokemonDetails);
        setMoves(movesData);
        setForms(formsData);
      });
    }

    if (!selectedPokemon) {
      setMoves([]);
      setForms([]);
      setPokemon(null);
      return;
    }

    loadData();
  }, [selectedPokemon]);
  return (
    <>
      <figure className="relative">
        {isPending || !pokemon?.sprites.front_default ? (
          <div className="skeleton w-full"></div>
        ) : (
          <img className="w-full" src={pokemon?.sprites.front_default} alt={pokemon?.name} />
        )}
        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex gap-2">
          {pokemon?.types.map((type, index) => (
            <div key={type.type.name + index} className="badge badge-xl badge-secondary">
              {type.type.name}
            </div>
          ))}
        </div>
      </figure>
      <div className="container flex justify-center mt-12">
        <div role="tablist" className="tabs tabs-box">
          <a
            role="tab"
            aria-label="abilities"
            className={`tab ${activeTab === 'abilities' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('abilities')}
          >
            Abilities
          </a>
          <a
            role="tab"
            aria-label="moves"
            className={`tab ${activeTab === 'moves' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            Moves
          </a>
          <a
            role="tab"
            aria-label="forms"
            className={`tab ${activeTab === 'forms' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            Forms
          </a>
        </div>
      </div>
      <div className="p-10 max-h-[25vh] overflow-y-auto">
        {activeTab === 'abilities' && <AbilitiesList abilities={pokemon?.abilities} />}
        {activeTab === 'moves' && <MovesList moves={moves} />}
        {activeTab === 'forms' && <FormsList forms={forms} />}
      </div>
    </>
  );
};

export default PokeDetails;
