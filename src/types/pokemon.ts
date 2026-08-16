export interface PokemonShort {
  name: string;
  url: string;
  id: number;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  image: string;
  height: number; // in decimeters
  weight: number; // in hectograms
  abilities: string[];
  stats: PokemonStats;
  moves: string[];
}

export type SortKey = 'id' | 'name' | 'attack' | 'speed' | 'hp';
