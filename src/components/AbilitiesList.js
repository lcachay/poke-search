import React from 'react';

const AbilitiesList = ({ abilities = [] }) => {
  return (
    <div className="flex gap-2">
      {abilities.map((ability, index) => (
        <div
          key={ability.ability.name + index}
          className={`badge badge-xl badge-accent ${ability.is_hidden && 'badge-ghost '}`}
        >
          {ability.ability.name}
        </div>
      ))}
    </div>
  );
};

export default AbilitiesList;
