import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React from 'react';

const Searchbar = ({ isPending, handleSearch }) => {
  return (
    <div className="flex justify-center mb-8">
      <label className="input w-full max-w-md flex items-center gap-2">
        <MagnifyingGlassIcon className="w-4" />
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Search for your pokémon!"
          className="input input-bordered w-full"
        />
        {isPending && <span className="loading loading-ball loading-lg"></span>}
      </label>
    </div>
  );
};

export default Searchbar;
