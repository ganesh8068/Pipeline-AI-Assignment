import React from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import PokemonCard from './PokemonCard';
import { LoadingSkeletonCard } from './LoadingSkeleton';

interface PokemonGridProps {
  pokemonList: PokemonDetail[];
  favorites: number[];
  onToggleFavorite: (pokemon: PokemonDetail) => void;
  comparingList: PokemonDetail[];
  onToggleCompare: (pokemon: PokemonDetail) => void;
  onSelectPokemon: (pokemon: PokemonDetail) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  emptyMessage?: string;
  onResetSearch?: () => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  favorites,
  onToggleFavorite,
  comparingList,
  onToggleCompare,
  onSelectPokemon,
  onLoadMore,
  hasMore,
  loadingMore,
  emptyMessage = "We couldn't find any Pokémon matching your search or filters.",
  onResetSearch,
}) => {
  const isFavorite = (id: number) => favorites.includes(id);
  const isComparing = (id: number) => comparingList.some((p) => p.id === id);

  // Render beautiful empty state
  if (pokemonList.length === 0 && !loadingMore) {
    return (
      <div className="empty-state">
        <HelpCircle className="empty-state-icon" />
        <h3 className="empty-state-title">No Pokémon Found</h3>
        <p className="empty-state-desc">{emptyMessage}</p>
        {onResetSearch && (
          <button className="primary-btn" onClick={onResetSearch}>
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Grid of Pokemon Cards */}
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => onSelectPokemon(pokemon)}
            isFavorite={isFavorite(pokemon.id)}
            onToggleFavorite={(e) => {
              e.stopPropagation();
              onToggleFavorite(pokemon);
            }}
            isComparing={isComparing(pokemon.id)}
            onToggleCompare={(e) => {
              e.stopPropagation();
              onToggleCompare(pokemon);
            }}
          />
        ))}

        {/* Render Shimmer Skeletons if loading more */}
        {loadingMore && 
          Array.from({ length: 4 }).map((_, idx) => (
            <LoadingSkeletonCard key={`skel-more-${idx}`} />
          ))
        }
      </div>

      {/* Pagination Load More Trigger */}
      {hasMore && !loadingMore && (
        <div className="load-more-container">
          <button 
            className="primary-btn" 
            onClick={onLoadMore}
            style={{ minWidth: '180px', justifyContent: 'center' }}
          >
            Load More Pokémon
          </button>
        </div>
      )}
    </>
  );
};

export default PokemonGrid;
