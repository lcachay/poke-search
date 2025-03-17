import React, { startTransition, useEffect, useState } from 'react';
import { getFormsData, getMovesData, getPokemon } from '../api/pokemonService';

const PokeDetailsModal = ({ selectedPokemon, dialogRef, toggleModal }) => {
  const [pokemon, setPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState('abilities');
  const [forms, setForms] = useState([]);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    async function loadData() {
      const pokemonDetails = await getPokemon(selectedPokemon);
      console.log(pokemonDetails);
      setMoves(await getMovesData(pokemonDetails.moves));
      setForms(await getFormsData(pokemonDetails.forms));
      setPokemon(pokemonDetails);
    }
    if (!selectedPokemon) return;
    startTransition(() => {
      loadData();
    });
  }, [selectedPokemon]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="capitalize">
            #{pokemon?.id} - {pokemon?.name}
          </h2>
          <button className="btn btn-sm btn-circle btn-ghost" aria-label="close" onClick={toggleModal}>
            ✕
          </button>
        </div>
        <figure className=" relative">
          {!pokemon?.sprites.front_default ? (
            <div className="skeleton w-full"></div>
          ) : (
            <img className="w-full" src={pokemon?.sprites.front_default} alt={pokemon?.name} />
          )}
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex gap-2">
            {pokemon?.types.map((type, index) => (
              <div key={type.type.name + index} className="badge badge-xl badge-primary">
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
          {activeTab === 'abilities' && (
            <div className="flex gap-2">
              {pokemon?.abilities.map((ability, index) => (
                <div
                  key={ability.ability.name + index}
                  className={`badge badge-xl badge-neutral ${ability.is_hidden && 'badge-soft'}`}
                >
                  {ability.ability.name}
                </div>
              ))}
            </div>
          )}
          {activeTab === 'moves' && (
            <div className="moves-grid">
              {moves?.map((move, index) => (
                <div key={move.name + index} className="flex flex-col items-center gap-2 text-gray-600">
                  <h2 className="text-md font-semibold uppercase text-center text-wrap">{move.name}</h2>
                  <span className="badge badge-sm badge-neutral badge-soft">{move.type.name}</span>
                  <span className="badge badge-sm badge-neutral badge-soft">{move.damage_class.name}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'forms' && (
            <div className="flex gap-2 justify-center items-center">
              {forms?.map((form, index) => (
                <div key={form.name + index} className={`flex items-center gap-4`}>
                  <div className="avatar">
                    <div className="w-16 bg-base-50 rounded-sm">
                      <img src={form.sprites.front_default} />
                    </div>
                  </div>
                  <p className="capitalize font-bold">{form.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default PokeDetailsModal;
