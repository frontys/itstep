export default function GameCard({ game }) {
  function handleImgError(e) {
    e.target.onerror = null;
    e.target.src = './images/fallback.svg';
  }

  return (
    <div className="game-row">
      <img
        src={game.image}
        alt={game.title}
        onError={handleImgError}
        className="game-thumb"
      />
      <div className="game-details">
        <h3>{game.title}</h3>
        <span className="game-tag">PC Digital Edition</span>
      </div>
      <div className="game-buy-box">
        <div className="price">{game.price} грн</div>
        <button type="button">Details</button>
      </div>
    </div>
  );
}
