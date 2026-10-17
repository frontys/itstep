export default function GameCard({ game, onAddToCart, inCartCount = 0 }) {
  const getImgSrc = (src) => {
    if (!src) return `${import.meta.env.BASE_URL}images/fallback.svg`;
    if (src.startsWith('./')) {
      return `${import.meta.env.BASE_URL}${src.slice(2)}`;
    }
    return src;
  };

  function handleImgError(e) {
    e.target.onerror = null;
    e.target.src = `${import.meta.env.BASE_URL}images/fallback.svg`;
  }

  return (
    <div className="card">
      <img
        src={getImgSrc(game.image)}
        alt={game.title}
        onError={handleImgError}
        className="card-thumb"
      />
      <div className="card-body">
        <h3 title={game.title}>{game.title}</h3>
        <div className="card-meta">
          <span>{game.publisher}</span>
          <span> · </span>
          <span>{game.genre}</span>
          <span> · </span>
          <span>Age: {game.minAge}+</span>
        </div>
        <p className="card-desc">{game.description}</p>
      </div>
      <div className="card-footer">
        <div className="price">{game.price} грн</div>
        <button
          type="button"
          className="btn-buy"
          onClick={() => onAddToCart(game)}
        >
          {inCartCount > 0 ? `In Cart (${inCartCount})` : 'Buy'}
        </button>
      </div>
    </div>
  );
}
