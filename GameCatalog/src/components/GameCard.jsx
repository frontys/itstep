export default function GameCard({ game }) {
  function handleImgError(e) {
    e.target.onerror = null;
    e.target.src = './images/fallback.svg';
  }

  return (
    <div className="card">
      <img
        src={game.image}
        alt={game.title}
        onError={handleImgError}
      />
      <div>
        <h3>{game.title}</h3>
      </div>
      <div className="price">{game.price} грн</div>
    </div>
  );
}
