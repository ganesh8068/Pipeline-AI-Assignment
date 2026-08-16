import React from 'react';
import { 
  Star, 
  Columns, 
  Flame, 
  Droplet, 
  Leaf, 
  Zap, 
  Wind, 
  Sparkles, 
  Skull, 
  Compass, 
  Snowflake, 
  Bug, 
  Shield, 
  Eye, 
  Swords, 
  Moon, 
  Award, 
  HelpCircle,
  Circle
} from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';

// Map Pokémon types to Lucide Icons for premium visual badges
export const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'fire': return <Flame size={12} />;
    case 'water': return <Droplet size={12} />;
    case 'grass': return <Leaf size={12} />;
    case 'electric': return <Zap size={12} />;
    case 'flying': return <Wind size={12} />;
    case 'fairy': return <Sparkles size={12} />;
    case 'poison': return <Skull size={12} />;
    case 'ground': 
    case 'rock': return <Compass size={12} />;
    case 'ice': return <Snowflake size={12} />;
    case 'bug': return <Bug size={12} />;
    case 'steel': return <Shield size={12} />;
    case 'psychic': return <Eye size={12} />;
    case 'fighting': return <Swords size={12} />;
    case 'dark': return <Moon size={12} />;
    case 'dragon': return <Award size={12} />;
    case 'ghost': return <HelpCircle size={12} />; // fallback ghost indicator
    default: return <Circle size={12} />;
  }
};

interface PokemonCardProps {
  pokemon: PokemonDetail;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isComparing: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onClick,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare,
}) => {
  const primaryType = pokemon.types[0] || 'normal';
  
  // Format ID to 3 digits (e.g. #005)
  const formatId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  // Set card inline style variables for type color backgrounds
  const cardStyle = {
    '--type-accent': `var(--type-${primaryType})`,
    '--type-accent-glow': `var(--type-${primaryType})26`, // 26 is hex for 15% opacity
  } as React.CSSProperties;

  return (
    <div 
      className={`pokemon-card ${isFavorite ? 'is-favorite' : ''} ${isComparing ? 'is-comparing' : ''}`}
      onClick={onClick}
      style={cardStyle}
    >
      {/* Compare Icon Top Left */}
      <button 
        className={`card-compare-btn ${isComparing ? 'is-comparing' : ''}`}
        onClick={onToggleCompare}
        title={isComparing ? "Remove from comparison" : "Add to comparison"}
      >
        <Columns size={18} fill={isComparing ? "currentColor" : "none"} />
      </button>

      {/* Favorite Icon Top Right */}
      <button 
        className={`card-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
        onClick={onToggleFavorite}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      {/* ID Badge */}
      <span className="card-id">{formatId(pokemon.id)}</span>

      {/* Image Artwork Wrapper */}
      <div className="card-img-wrapper">
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="card-img" 
          loading="lazy"
        />
      </div>

      {/* Name and Type Badges */}
      <div className="card-info">
        <h3 className="card-name">{pokemon.name}</h3>
        <div className="card-types">
          {pokemon.types.map((type) => (
            <span 
              key={type} 
              className="type-pill"
              style={{ backgroundColor: `var(--type-${type})` }}
            >
              {getTypeIcon(type)}
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
