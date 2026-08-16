import React, { useState, useEffect } from 'react';
import { PokemonDetail, PokemonShort, SortKey } from './types/pokemon';
import { 
  fetchPokemonList, 
  fetchPokemonDetailsByNameOrId, 
  fetchPokemonListByType, 
  fetchMultiplePokemonDetails 
} from './services/pokemonApi';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import CompareTray from './components/CompareTray';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import { Moon, Sun, ShieldAlert, Sparkles } from 'lucide-react';

const PAGE_SIZE = 20;

export const App: React.FC = () => {
  // --- UI & Theme States ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // --- Core API Data States ---
  const [allShortPokemon, setAllShortPokemon] = useState<PokemonShort[]>([]);
  const [filteredShortList, setFilteredShortList] = useState<PokemonShort[]>([]);
  const [pokemonDetailsMap, setPokemonDetailsMap] = useState<Record<number, PokemonDetail>>({});
  
  // --- Active Filter/Sort States ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [displayedCount, setDisplayedCount] = useState<number>(PAGE_SIZE);

  // --- Async Loading & Error States ---
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Feature States (Modal, Favorites, Compare) ---
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [comparingList, setComparingList] = useState<PokemonDetail[]>([]);

  // ==========================================
  // 1. Initial Launch: Load Base Data and URL State
  // ==========================================
  useEffect(() => {
    // Set theme on mount
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // A. Load initial batch of Pokémon (first 20)
        const initialBatch = await fetchPokemonList(PAGE_SIZE, 0);
        const details = await fetchMultiplePokemonDetails(initialBatch.results);
        
        // Cache these details
        const initialMap: Record<number, PokemonDetail> = {};
        details.forEach((p) => {
          initialMap[p.id] = p;
        });
        setPokemonDetailsMap(initialMap);

        // B. Fetch the full list of ~1025 Pokemon names/IDs in background for instant search matching
        const fullShortList = await fetchPokemonList(1100, 0);
        setAllShortPokemon(fullShortList.results);

        // C. Parse URL params for routing and sharing
        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get('search');
        const typeParam = params.get('type');
        const pokemonParam = params.get('pokemon');

        if (searchParam) setSearchQuery(searchParam);
        if (typeParam) setSelectedType(typeParam);
        if (pokemonParam) {
          // Fetch and open the detailed modal for shared Pokemon
          try {
            const sharedDetail = await fetchPokemonDetailsByNameOrId(pokemonParam);
            // Cache it
            setPokemonDetailsMap((prev) => ({ ...prev, [sharedDetail.id]: sharedDetail }));
            setSelectedPokemon(sharedDetail);
          } catch {
            console.error('Failed to load shared URL Pokemon details:', pokemonParam);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize the application.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ==========================================
  // 2. Synchronize Dark Mode Theme
  // ==========================================
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ==========================================
  // 3. Synchronize URL Query Parameters
  // ==========================================
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType) params.set('type', selectedType);
    if (selectedPokemon) params.set('pokemon', selectedPokemon.name);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedType, selectedPokemon]);

  // ==========================================
  // 4. Client-side Search and Type Filters Matching
  // ==========================================
  useEffect(() => {
    const filterAndProcessList = async () => {
      // If we haven't loaded all short list yet, skip filtering
      if (allShortPokemon.length === 0) return;

      try {
        let results: PokemonShort[] = [...allShortPokemon];

        // A. Filter by Type (If active, fetch type specific list or filter current)
        if (selectedType) {
          setLoadingMore(true);
          const typeData = await fetchPokemonListByType(selectedType);
          results = typeData.results;
        }

        // B. Filter by Search Query (Name contains or ID equals)
        if (searchQuery) {
          const query = searchQuery.toLowerCase().trim();
          results = results.filter(
            (p) => p.name.includes(query) || p.id.toString() === query
          );
        }

        // C. Filter by Favorites Only
        if (showFavoritesOnly) {
          results = results.filter((p) => favorites.includes(p.id));
        }

        setFilteredShortList(results);
        setDisplayedCount(PAGE_SIZE); // reset pagination offset
        setLoadingMore(false);
      } catch (err: any) {
        console.error('Failed filtering Pokemon list:', err);
        setError('Could not filter Pokemon. Please retry.');
        setLoadingMore(false);
      }
    };

    filterAndProcessList();
  }, [searchQuery, selectedType, showFavoritesOnly, allShortPokemon, favorites]);

  // ==========================================
  // 5. Paginate and Retrieve Pokémon Detail Blocks
  // ==========================================
  // The grid gets the visible slice of Pokemon details
  const visibleShortList = filteredShortList.slice(0, displayedCount);

  useEffect(() => {
    const loadMissingDetails = async () => {
      if (visibleShortList.length === 0) return;

      // Identify which visible IDs are NOT cached in detailsMap
      const missingShortItems = visibleShortList.filter((item) => !pokemonDetailsMap[item.id]);

      if (missingShortItems.length === 0) return;

      try {
        setLoadingMore(true);
        const details = await fetchMultiplePokemonDetails(missingShortItems);
        
        setPokemonDetailsMap((prev) => {
          const updated = { ...prev };
          details.forEach((p) => {
            updated[p.id] = p;
          });
          return updated;
        });
      } catch (err: any) {
        console.error('Failed fetching detailed chunks:', err);
      } finally {
        setLoadingMore(false);
      }
    };

    loadMissingDetails();
  }, [visibleShortList, pokemonDetailsMap]);

  // ==========================================
  // 6. Sorting Visible Pokémon Details
  // ==========================================
  // Gather available detail records in order of the matching short list
  const getSortedVisibleDetails = (): PokemonDetail[] => {
    const details = visibleShortList
      .map((item) => pokemonDetailsMap[item.id])
      .filter(Boolean); // filter out items not loaded yet

    return [...details].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attack':
          return b.stats.attack - a.stats.attack; // descending
        case 'speed':
          return b.stats.speed - a.stats.speed; // descending
        case 'hp':
          return b.stats.hp - a.stats.hp; // descending
        case 'id':
        default:
          return a.id - b.id; // ascending
      }
    });
  };

  const displayedPokemon = getSortedVisibleDetails();

  // ==========================================
  // 7. Interactive Feature Triggers
  // ==========================================
  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + PAGE_SIZE);
  };

  const handleToggleFavorite = (pokemon: PokemonDetail) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(pokemon.id)) {
        updated = prev.filter((id) => id !== pokemon.id);
      } else {
        updated = [...prev, pokemon.id];
      }
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleCompare = (pokemon: PokemonDetail) => {
    setComparingList((prev) => {
      const isAlreadyComparing = prev.some((p) => p.id === pokemon.id);
      if (isAlreadyComparing) {
        return prev.filter((p) => p.id !== pokemon.id);
      }
      if (prev.length >= 2) {
        alert("You can only compare up to two Pokémon. Remove one first!");
        return prev;
      }
      return [...prev, pokemon];
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setShowFavoritesOnly(false);
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Check if we are loading initial state or filters are fetching
  const isInitialLoading = loading && Object.keys(pokemonDetailsMap).length === 0;

  return (
    <>
      {/* Top Application Navigation */}
      <header className="app-header">
        <div className="logo-container" onClick={handleResetFilters}>
          <img src="https://thumbs.dreamstime.com/b/simple-red-white-pokemon-logo-eps-kiev-ukraine-circa-jul-74567695.jpg" alt="Pokeball Logo" className="logo-icon" />
          <h1 className="logo-text">PokéExplorer</h1>
        </div>
        <div className="header-controls">
          {/* Light/Dark Toggle */}
          <button 
            className="icon-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ padding: '0.75rem' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Search, Sort & Fav Toggle */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          favoritesCount={favorites.length}
        />

        {/* Type Badges Filters */}
        <TypeFilter
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />

        {/* Dynamic Display Grid / States */}
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : isInitialLoading ? (
          <LoadingSkeleton count={8} />
        ) : (
          <PokemonGrid
            pokemonList={displayedPokemon}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            comparingList={comparingList}
            onToggleCompare={handleToggleCompare}
            onSelectPokemon={setSelectedPokemon}
            onLoadMore={handleLoadMore}
            hasMore={filteredShortList.length > displayedCount}
            loadingMore={loadingMore}
            onResetSearch={handleResetFilters}
            emptyMessage={
              showFavoritesOnly && favorites.length === 0
                ? "You haven't favorited any Pokémon yet! Click the star icon on any card to add it to your favorites."
                : undefined
            }
          />
        )}
      </main>

      {/* Floating Bottom Drawer Compare Tray */}
      <CompareTray
        comparingList={comparingList}
        onRemoveCompare={(p) => setComparingList((prev) => prev.filter((item) => item.id !== p.id))}
        onClearCompare={() => setComparingList([])}
      />

      {/* Pokémon Detailed View Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={selectedPokemon !== null}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* Small subtle footer */}
      <footer style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', marginTop: '2rem' }}>
        <p>PokéExplorer © {new Date().getFullYear()} - Built with PokéAPI</p>
      </footer>
    </>
  );
};

export default App;
