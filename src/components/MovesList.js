import React from 'react';

const MovesList = ({ moves = [] }) => {
  return (
    <div className="moves-grid">
      {moves?.map((move, index) => (
        <div key={move.name + index} className="flex flex-col items-center justify-around gap-2 ">
          <h2 className="text-md font-semibold uppercase text-center text-pretty">{move.name}</h2>
          <div className="flex flex-col items-center gap-1">
            <span className="badge badge-sm badge-neutral badge-soft">{move.type.name}</span>
            <span className="badge badge-sm badge-neutral badge-soft">{move.damage_class.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovesList;
