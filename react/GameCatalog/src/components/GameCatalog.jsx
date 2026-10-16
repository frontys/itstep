import { useState } from 'react';
import GameCard from './GameCard.jsx';
import { getVisibleGames } from '../utils/catalog.js';

export default function GameCatalog({ games, cart = [], onAddToCart }) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortMode, setSortMode] = useState('default');
  const [playerAge, setPlayerAge] = useState('');

  const genres = [...new Set(games.map(g => g.genre))].filter(Boolean).sort();

  const visibleGames = getVisibleGames(games, search, genre, sortMode, playerAge);

  function handleReset() {
    setSearch('');
    setGenre('all');
    setSortMode('default');
    setPlayerAge('');
  }

  const cartQuantities = new Map(cart.map(c => [c.id, c.quantity]));

  return (
    <div>
      <div className="catalog-header">
        <h2>Games Catalog</h2>
        <span className="count-label">Found: {visibleGames.length} / {games.length}</span>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Title or publisher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Genre:</label>
          <select value={genre} onChange={e => setGenre(e.target.value)}>
            <option value="all">All Genres</option>
            {genres.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Player Age:</label>
          <input
            type="number"
            min="3"
            max="99"
            placeholder="e.g. 16"
            value={playerAge}
            onChange={e => setPlayerAge(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
            <option value="default">Default</option>
            <option value="creator">Publisher: A → Z</option>
            <option value="title">Title: A → Z</option>
            <option value="price-up">Price: Low to High</option>
            <option value="price-down">Price: High to Low</option>
          </select>
        </div>

        <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
      </div>

      <div className="games-grid">
        {visibleGames.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onAddToCart={onAddToCart}
            inCartCount={cartQuantities.get(game.id) || 0}
          />
        ))}
      </div>

      {visibleGames.length === 0 && (
        <div className="empty-box">
          <p>No games found matching your filters.</p>
          <button type="button" onClick={handleReset}>Reset Filters</button>
        </div>
      )}
    </div>
  );
}
