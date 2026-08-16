# Pokémon Explorer

A modern, responsive, and visually stunning Pokémon Explorer application built using React, TypeScript, and PokéAPI. It features a premium custom-styled glassmorphism UI, theme modes, advanced filtering/searching, a live Pokémon comparison engine, and a persistence system for favorites.

**Live Demo:** [https://pipeline-ai-assignment.onrender.com](https://pipeline-ai-assignment.onrender.com)

## Features

- **Dynamic Card Grid:** Sleek, glassmorphic Pokémon cards displaying high-quality official artwork, IDs, names, and type badges. Card design adapts its glowing accent borders dynamically based on the primary type of the Pokémon.
- **Instant Search:** Search Pokémon by name or numerical ID with instant result filtering.
- **Scrollable Type Filters:** Horizontal navigation bar featuring all 18 Pokémon types, completed with custom indicators/icons and colors.
- **Load More Pagination:** Avoids loading lag by fetching Pokémon details concurrently in custom chunk-sized pages.
- **Glassmorphism Detail Drawer:** Clicking any card slides in a gorgeous modal sheet displaying:
  - Weight & Height (metric to imperial conversions)
  - Interactive, custom-designed stats progress bars
  - Ability lists and move pools
- **Pokémon Stat Battle (Comparison Engine):** Select any two Pokémon and compare their base stats side-by-side. The engine highlights the winning stats in green with clear indicator trophies.
- **Favorites Integration:** Mark Pokémon as favorites, persisting selection through `localStorage`. Toggle to filter the grid to show only favorited Pokémon.
- **Theme Mode Toggle:** Switch seamlessly between Light Mode and a premium dark blue Dark Mode with smooth transition easing.
- **Deep Linking / URL State Sync:** Share your views easily; filters, search queries, and selected Pokémon modals are synced to the URL search parameters (e.g. `?pokemon=charizard`).
- **Keyboard Navigation & Accessibility:** Close modals using the `Escape` key, click nodes using standard keyboard inputs, and browse using focus controls.
- **Polished Skeleton States:** Shimmer animated card loaders prevent layout shifts during content retrieval.

---

## Tech Stack

- **Framework:** React 19 (Vite Build System)
- **Language:** TypeScript (Type-safety for data fetching and component architecture)
- **Styling:** Vanilla CSS (Responsive layouts, custom property themes, glassmorphism, responsive grids, custom animations, keyframe shimmers)
- **Icons:** Lucide React (Flame, Droplet, Zap, Star, Shield, Scale, Ruler, etc.)
- **API Client:** Native fetch with parallel Promise wrapping.

---

## API Used

- **Source:** [PokéAPI (v2)](https://pokeapi.co/)
- **Endpoints consumed:**
  - `GET /pokemon?limit={limit}&offset={offset}` — Listing basic names & urls.
  - `GET /pokemon/{name_or_id}` — Detailed lookups for images, types, heights, weights, abilities, base stats, and move pools.
  - `GET /type/{type}` — List Pokémon belonging to a specific type.

---

## Project Structure

```bash
src/
├── components/
│   ├── CompareTray.tsx       # Bottom compare bar & side-by-side stats comparison modal
│   ├── ErrorState.tsx        # UI fallback error banner with Retry capability
│   ├── LoadingSkeleton.tsx   # Card-shaped shimmer layouts for loading states
│   ├── PokemonCard.tsx       # Interactive card component with type accent borders
│   ├── PokemonGrid.tsx       # Grid list manager with Load More controls
│   ├── PokemonModal.tsx      # Detail drawer with tabs (Stats, Abilities, Moves)
│   ├── SearchBar.tsx         # Input filter box, Sorting selector, Favorites toggle
│   └── TypeFilter.tsx        # Horizontal type badge scroll selectors
├── services/
│   └── pokemonApi.ts         # Service layer wrapping Fetch calls and parsing data
├── types/
│   └── pokemon.ts            # Type mappings for Stats, Details, list nodes, SortKeys
├── App.tsx                   # Central React controller (filters, modal triggers, URL syncing, favorites state)
├── index.css                 # Custom global theme variables, type palettes, animations, and typography
└── main.tsx                  # StrictMode mounting point
```

---

## Installation & Running Locally

Ensure you have **Node.js (v18+)** installed.

### 1. Clone the repository and navigate to the directory
```bash
git clone <repository-url>
cd pokemon-explorer
# or if using the Pipline AI folder directly:
cd "Pipline AI"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## Challenges Faced

1. **PokéAPI Pagination & Detail Resolution:** The main Pokémon list endpoint (`/pokemon`) only returns names and detail URLs, not images or stats. If we fetched all details individually for 1000+ Pokémon on load, it would result in severe API rate limiting and poor initial page speeds. 
   - *Solution:* Implemented a chunk-based retrieval system. We load the basic list of names/IDs in the background (which is fast), but only fetch detailed stats/images for the visible slice of Pokémon (e.g. 20 at a time). As the user scrolls or searches, the app lazily retrieves and caches details for newly encountered Pokémon, preventing duplicate requests.
2. **Dynamic Visual Accent Styling:** We wanted cards to be visually distinct based on their element type, but hardcoding React styles inside cards creates bloated components.
   - *Solution:* Standardized the color variables inside `src/index.css` using custom `--type-{typename}` CSS variables. In `PokemonCard.tsx`, we dynamically apply these variables inline to `--type-accent` and `--type-accent-glow`, allowing pure CSS rules to handle glassmorphic gradient shadows and luminous highlights naturally.
3. **URL Synchronization & Modals:** Syncing query parameters correctly on initial mount vs. during user interaction without triggering infinite state-updates or page re-renders.
   - *Solution:* Utilized standard `URLSearchParams` inside an effect tracking active filters, using `window.history.replaceState` to update the location bar seamlessly without triggering full-page router reloads.

---

## Future Improvements

- **Evolution Chains:** Integrate the evolution-chain PokéAPI endpoints to show previous and next evolutions in the details modal.
- **Sound Effects:** Add classic retro retro/cries audio when a Pokémon card is clicked.
- **Move details tooltips:** Allow users to hover over a Pokémon's move list to see the power, accuracy, and type of the move.
