import GameCard from './GameCard.jsx';
import { getVisibleGames } from '../utils/catalog.js';

export default function GameCatalog({ games }) {
  const visibleGames = getVisibleGames(games);

  return (
    <div>
      <div className="catalog-header">
        <h2>Games List</h2>
        <span>Total: {visibleGames.length} items</span>
      </div>

      <div className="games-list">
        {visibleGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
