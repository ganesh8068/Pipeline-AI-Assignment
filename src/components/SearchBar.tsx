import React from 'react';
import { Search, X, ChevronDown, Star } from 'lucide-react';
import { SortKey } from '../types/pokemon';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoritesCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}) => {
  return (
    <div className="controls-section">
      <div className="search-sort-bar">
        {/* Search Input Box */}
        <div className="search-wrapper">
          <Search className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Search Pokémon by name or ID..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button 
              className="clear-search-btn" 
              onClick={() => onChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Selector Dropdown */}
        <div className="sort-wrapper">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            title="Sort Pokémon"
          >
            <option value="id">Sort by: ID</option>
            <option value="name">Sort by: Name</option>
            <option value="attack">Sort by: Attack</option>
            <option value="speed">Sort by: Speed</option>
            <option value="hp">Sort by: HP</option>
          </select>
          <ChevronDown className="sort-icon-right" />
        </div>

        {/* Favorites Quick Filter Button */}
        <button
          className={`icon-btn ${showFavoritesOnly ? 'active' : ''}`}
          onClick={onToggleFavoritesOnly}
          title={showFavoritesOnly ? "Show All Pokémon" : "Show Favorited Pokémon"}
          style={{ borderRadius: '14px', padding: '0.85rem 1.25rem', display: 'flex', gap: '0.5rem', height: '100%', alignItems: 'center' }}
        >
          <Star size={18} fill={showFavoritesOnly ? "white" : "none"} />
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
            Favorites ({favoritesCount})
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
