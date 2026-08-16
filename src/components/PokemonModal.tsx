import React, { useEffect, useState, useRef } from 'react';
import { X, Calendar, Scale, Ruler, Zap } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import { getTypeIcon } from './PokemonCard';

interface PokemonModalProps {
  pokemon: PokemonDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'info'>('stats');
  const [animate, setAnimate] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // prevent page scroll
      // Trigger stats grow animation
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    } else {
      setAnimate(false);
    }
  }, [isOpen, onClose]);

  // Click outside modal content to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !pokemon) return null;

  const primaryType = pokemon.types[0] || 'normal';

  // Format ID to 3 digits (e.g. #005)
  const formatId = (id: number) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  // Convert decimeters to meters and feet/inches
  const formatHeight = (dm: number) => {
    const meters = dm / 10;
    const totalInches = (dm * 10) / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${meters.toFixed(1)} m (${feet}'${inches}")`;
  };

  // Convert hectograms to kilograms and pounds
  const formatWeight = (hg: number) => {
    const kg = hg / 10;
    const lbs = kg * 2.20462;
    return `${kg.toFixed(1)} kg (${lbs.toFixed(1)} lbs)`;
  };

  // Inline styling accent colors
  const typeAccentStyle = {
    '--type-accent': `var(--type-${primaryType})`,
    '--type-accent-glow': `var(--type-${primaryType})26`,
  } as React.CSSProperties;

  // Stat list helper
  const statsList = [
    { label: 'HP', value: pokemon.stats.hp },
    { label: 'Attack', value: pokemon.stats.attack },
    { label: 'Defense', value: pokemon.stats.defense },
    { label: 'Sp. Attack', value: pokemon.stats.specialAttack },
    { label: 'Sp. Defense', value: pokemon.stats.specialDefense },
    { label: 'Speed', value: pokemon.stats.speed },
  ];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className="modal-content" 
        ref={modalRef} 
        style={typeAccentStyle}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Hero Header Area */}
        <div className="modal-header-hero">
          <span className="modal-hero-id">{formatId(pokemon.id)}</span>
          <h2 className="modal-hero-name">{pokemon.name}</h2>
          
          <div className="card-types" style={{ marginBottom: '1.5rem' }}>
            {pokemon.types.map((type) => (
              <span 
                key={type} 
                className="type-pill" 
                style={{ backgroundColor: `var(--type-${type})`, fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}
              >
                {getTypeIcon(type)}
                {type}
              </span>
            ))}
          </div>

          <img 
            src={pokemon.image} 
            alt={pokemon.name} 
            className="modal-hero-img"
          />
        </div>

        {/* Tab Controls */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats & Info
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Abilities & Moves
          </button>
        </div>

        {/* Modal Panels */}
        <div className="modal-body">
          {activeTab === 'stats' ? (
            <div>
              {/* Measurements Row */}
              <div className="info-pills-row">
                <div className="info-pill-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                    <Ruler size={14} />
                    <span className="info-pill-title">Height</span>
                  </div>
                  <span className="info-pill-val">{formatHeight(pokemon.height)}</span>
                </div>
                <div className="info-pill-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                    <Scale size={14} />
                    <span className="info-pill-title">Weight</span>
                  </div>
                  <span className="info-pill-val">{formatWeight(pokemon.weight)}</span>
                </div>
              </div>

              {/* Stats Progress Bars */}
              <div className="modal-grid-stats">
                {statsList.map((stat) => {
                  const percentage = Math.min((stat.value / 180) * 100, 100); // 180 is near max base stats standard
                  return (
                    <div key={stat.label} className="stat-row">
                      <span className="stat-label">{stat.label}</span>
                      <span className="stat-value">{stat.value}</span>
                      <div className="stat-bar-outer">
                        <div 
                          className="stat-bar-inner" 
                          style={{ width: animate ? `${percentage}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Abilities */}
              <h4 className="modal-section-title">Abilities</h4>
              <div className="abilities-list">
                {pokemon.abilities.map((ability) => (
                  <span key={ability} className="ability-badge">
                    {ability.replace('-', ' ')}
                  </span>
                ))}
              </div>

              {/* Moves (Limit 15 for clean list) */}
              <h4 className="modal-section-title">Basic Moves</h4>
              <div className="moves-grid">
                {pokemon.moves.map((move) => (
                  <span key={move} className="move-item">
                    {move.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
