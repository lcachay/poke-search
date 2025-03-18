import React from 'react';

const PokemonCard = ({ pokemon, index, isPending, onClick = () => {}, ref }) => {
  return (
    <div key={index} onClick={onClick} className="card shadow-sm rounded-md hover:scale-105" ref={ref}>
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
  );
};

export default PokemonCard;
