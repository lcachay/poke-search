const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const fetchData = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error loading the data, please try again in a few minutes', error);
    throw error;
  }
};

export const getPokemon = async (name) => {
  const url = `${BASE_URL}/${name}`;
  return fetchData(url);
};

export const getPokemons = async (offset = 0, limit = 20) => {
  const url = `${BASE_URL}?offset=${offset}&limit=${limit}`;
  const data = await fetchData(url);
  const pokemons = await Promise.all(
    data.results.map(async (pokemon) => {
      const pokemonData = await fetchData(pokemon.url);
      return {
        name: pokemon.name,
        imgUrl: pokemonData.sprites.front_default,
      };
    })
  );

  return pokemons;
};

export const getPokemonsNames = async () => {
  const url = `${BASE_URL}?offset=01&limit=100000`;
  const data = await fetchData(url);
  return data.results.map((pokemon) => pokemon.name);
};

export const searchPokemon = async (name) => {
  const pokemon = await getPokemon(name.toLowerCase());
  return {
    name: pokemon.name,
    imgUrl: pokemon.sprites?.front_default,
  };
};
