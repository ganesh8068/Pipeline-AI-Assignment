import React, { useState, useEffect } from 'react';
import { X, Columns, ShieldAlert, Star } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';

interface CompareTrayProps {
  comparingList: PokemonDetail[];
  onRemoveCompare: (pokemon: PokemonDetail) => void;
  onClearCompare: () => void;
}

export const CompareTray: React.FC<CompareTrayProps> = ({
  comparingList,
  onRemoveCompare,
  onClearCompare,
}) => {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const slot1 = comparingList[0];
  const slot2 = comparingList[1];

  // ESC key to close comparison modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCompareModalOpen(false);
      }
    };
    if (isCompareModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    } else {
      setAnimate(false);
    }
  }, [isCompareModalOpen]);

  // Comparison details stats mapping helper
  const getComparedStats = () => {
    if (!slot1 || !slot2) return [];
    
    return [
      { label: 'HP', val1: slot1.stats.hp, val2: slot2.stats.hp },
      { label: 'Attack', val1: slot1.stats.attack, val2: slot2.stats.attack },
      { label: 'Defense', val1: slot1.stats.defense, val2: slot2.stats.defense },
      { label: 'Sp. Attack', val1: slot1.stats.specialAttack, val2: slot2.stats.specialAttack },
      { label: 'Sp. Defense', val1: slot1.stats.specialDefense, val2: slot2.stats.specialDefense },
      { label: 'Speed', val1: slot1.stats.speed, val2: slot2.stats.speed },
    ];
  };

  const comparedStats = getComparedStats();

  return (
    <>
      {/* Floating Bottom Drawer Tray */}
      <div className={`compare-tray ${comparingList.length > 0 ? 'open' : ''}`}>
        <div className="compare-slots">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <Columns size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Compare Tray:</span>
          </div>

          {/* Slot 1 */}
          {slot1 ? (
            <div className="compare-slot filled">
              <img src={slot1.image} alt={slot1.name} className="compare-slot-img" />
              <div className="compare-slot-info">
                <span className="compare-slot-name">{slot1.name}</span>
              </div>
              <button 
                className="compare-slot-remove"
                onClick={() => onRemoveCompare(slot1)}
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="compare-slot">Slot 1 Empty</div>
          )}

          {/* Slot 2 */}
          {slot2 ? (
            <div className="compare-slot filled">
              <img src={slot2.image} alt={slot2.name} className="compare-slot-img" />
              <div className="compare-slot-info">
                <span className="compare-slot-name">{slot2.name}</span>
              </div>
              <button 
                className="compare-slot-remove"
                onClick={() => onRemoveCompare(slot2)}
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="compare-slot">Slot 2 Empty</div>
          )}
        </div>

        {/* Action Controls */}
        <div className="compare-tray-actions">
          <button 
            className="icon-btn"
            onClick={onClearCompare}
            title="Clear all comparison"
            style={{ borderRadius: '12px', padding: '0.65rem' }}
          >
            Clear
          </button>
          <button 
            className="primary-btn"
            disabled={comparingList.length < 2}
            onClick={() => setIsCompareModalOpen(true)}
            style={{ padding: '0.65rem 1.5rem', borderRadius: '12px' }}
          >
            Compare Stats
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Overlay Modal */}
      {isCompareModalOpen && slot1 && slot2 && (
        <div className="modal-overlay" onClick={() => setIsCompareModalOpen(false)}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            {/* Header Close */}
            <button 
              className="modal-close-btn" 
              onClick={() => setIsCompareModalOpen(false)}
              aria-label="Close Comparison"
            >
              <X size={20} />
            </button>

            {/* Modal Heading Title */}
            <div style={{ padding: '2rem 2rem 1rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em' }}>
                Pokémon Stat Battle
              </h2>
            </div>

            <div className="modal-body" style={{ padding: '1.5rem 2rem 2.5rem 2rem' }}>
              <div className="comparison-container">
                {/* Visual Header Grid */}
                <div className="compare-headers">
                  <div className="compare-header-item" style={{ '--type-accent-glow': `var(--type-${slot1.types[0]})26` } as React.CSSProperties}>
                    <img src={slot1.image} alt={slot1.name} className="compare-header-img" />
                    <span className="compare-header-name">{slot1.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      #{slot1.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="compare-header-item" style={{ '--type-accent-glow': `var(--type-${slot2.types[0]})26` } as React.CSSProperties}>
                    <img src={slot2.image} alt={slot2.name} className="compare-header-img" />
                    <span className="compare-header-name">{slot2.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      #{slot2.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>

                {/* Compare Stats Progression Rows */}
                <div className="compare-stat-rows">
                  {comparedStats.map((stat) => {
                    const maxVal = 180;
                    const w1 = Math.min((stat.val1 / maxVal) * 100, 100);
                    const w2 = Math.min((stat.val2 / maxVal) * 100, 100);

                    const isWinner1 = stat.val1 > stat.val2;
                    const isWinner2 = stat.val2 > stat.val1;

                    return (
                      <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div className="compare-stat-text">
                          <span className={isWinner1 ? 'winner' : ''}>
                            {stat.val1} {isWinner1 && '🏆'}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                            {stat.label}
                          </span>
                          <span className={isWinner2 ? 'winner' : ''}>
                            {isWinner2 && '🏆'} {stat.val2}
                          </span>
                        </div>
                        <div className="compare-stat-bars">
                          {/* Left Progress Bar */}
                          <div className="compare-bar-left-outer">
                            <div 
                              className={`compare-bar-left-inner ${isWinner1 ? 'winner' : ''}`}
                              style={{ 
                                width: animate ? `${w1}%` : '0%', 
                                backgroundColor: isWinner1 ? `var(--type-${slot1.types[0]})` : undefined 
                              }}
                            ></div>
                          </div>
                          {/* Centered label block placeholder */}
                          <div></div>
                          {/* Right Progress Bar */}
                          <div className="compare-bar-right-outer">
                            <div 
                              className={`compare-bar-right-inner ${isWinner2 ? 'winner' : ''}`}
                              style={{ 
                                width: animate ? `${w2}%` : '0%',
                                backgroundColor: isWinner2 ? `var(--type-${slot2.types[0]})` : undefined 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareTray;
