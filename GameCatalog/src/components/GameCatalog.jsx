import GameCard from './GameCard.jsx';
import { getVisibleGames } from '../utils/catalog.js';

export default function GameCatalog({ games }) {
  const visibleGames = getVisibleGames(games);

  return (
    <div>
      <h2>Games Catalog</h2>
      <p>Games count: {visibleGames.length}</p>

      <div className="games-list">
        {visibleGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
