import { PokemonShort, PokemonDetail, PokemonStats } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Helper to extract Pokémon ID from PokéAPI URL
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  if (matches && matches[1]) {
    return parseInt(matches[1], 10);
  }
  // Try fallback match for type-pokemon lists or other format variations
  const parts = url.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];
  if (lastPart && !isNaN(Number(lastPart))) {
    return parseInt(lastPart, 10);
  }
  return 0;
}

// Fetch basic list of Pokémon
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<{ count: number; results: PokemonShort[] }> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  const data = await response.json();
  const results: PokemonShort[] = data.results.map((item: any) => ({
    name: item.name,
    url: item.url,
    id: extractIdFromUrl(item.url),
  }));

  return {
    count: data.count,
    results,
  };
}

// Fetch detailed Pokémon information by name or ID
export async function fetchPokemonDetailsByNameOrId(nameOrId: string | number): Promise<PokemonDetail> {
  const cleanedNameOrId = nameOrId.toString().toLowerCase().trim();
  const response = await fetch(`${BASE_URL}/pokemon/${cleanedNameOrId}`);
  if (!response.ok) {
    throw new Error(`Pokemon not found: ${nameOrId}`);
  }
  const data = await response.json();

  // Map stats
  const stats: PokemonStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  data.stats.forEach((s: any) => {
    switch (s.stat.name) {
      case 'hp':
        stats.hp = s.base_stat;
        break;
      case 'attack':
        stats.attack = s.base_stat;
        break;
      case 'defense':
        stats.defense = s.base_stat;
        break;
      case 'special-attack':
        stats.specialAttack = s.base_stat;
        break;
      case 'special-defense':
        stats.specialDefense = s.base_stat;
        break;
      case 'speed':
        stats.speed = s.base_stat;
        break;
    }
  });

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || '',
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((a: any) => a.ability.name),
    stats,
    moves: data.moves.slice(0, 15).map((m: any) => m.move.name),
  };
}

// Fetch Pokémon belonging to a specific type
export async function fetchPokemonListByType(type: string): Promise<{ results: PokemonShort[] }> {
  const response = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon for type: ${type}`);
  }
  const data = await response.json();
  const results: PokemonShort[] = data.pokemon.map((item: any) => ({
    name: item.pokemon.name,
    url: item.pokemon.url,
    id: extractIdFromUrl(item.pokemon.url),
  }));

  return {
    results,
  };
}

// Fetch details for an array of Pokémon (concurrently)
export async function fetchMultiplePokemonDetails(list: PokemonShort[]): Promise<PokemonDetail[]> {
  const promises = list.map((item) => fetchPokemonDetailsByNameOrId(item.id || item.name));
  return Promise.all(promises);
}
