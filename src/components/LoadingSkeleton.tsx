import React from 'react';

export const LoadingSkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-shimmer"></div>
      <div className="skeleton-circle"></div>
      <div className="skeleton-img"></div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div className="skeleton-text-lg"></div>
        <div className="skeleton-text-sm"></div>
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="pokemon-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <LoadingSkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
