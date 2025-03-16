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
  return fetchData(url);
};
