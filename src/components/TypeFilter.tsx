import React from 'react';
import { Layers } from 'lucide-react';
import { getTypeIcon } from './PokemonCard';

const TYPES = [
  'all',
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'steel',
  'fairy',
  'dark'
];

interface TypeFilterProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="type-filter-container">
      {TYPES.map((type) => {
        const isActive = selectedType.toLowerCase() === type.toLowerCase();
        
        // Dynamic active state colors based on pokemon type accent
        const activeStyle = isActive
          ? type === 'all'
            ? { backgroundColor: 'var(--primary-color)' }
            : { backgroundColor: `var(--type-${type})` }
          : {};

        return (
          <button
            key={type}
            className={`type-badge-btn ${isActive ? 'active' : ''}`}
            style={activeStyle}
            onClick={() => onSelectType(type === 'all' ? '' : type)}
          >
            {type === 'all' ? <Layers size={12} /> : getTypeIcon(type)}
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default TypeFilter;
