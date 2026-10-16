export function normalizeText(text) {
  return String(text || '').trim().toLowerCase();
}

export function getVisibleGames(games, search, genre, sortMode, playerAge) {
  const query = normalizeText(search);
  const ageLimit = playerAge !== '' && playerAge !== undefined && playerAge !== null ? Number(playerAge) : null;

  const filtered = games.filter(game => {
    const matchesSearch =
      !query ||
      normalizeText(game.title).includes(query) ||
      normalizeText(game.publisher).includes(query);

    const matchesGenre = !genre || genre === 'all' || game.genre === genre;

    const matchesAge =
      ageLimit === null || (!Number.isNaN(ageLimit) && game.minAge <= ageLimit);

    return matchesSearch && matchesGenre && matchesAge;
  });

  filtered.sort((a, b) => {
    if (sortMode === 'creator') {
      return (a.publisher || '').localeCompare(b.publisher || '', 'en', { sensitivity: 'base' });
    }
    if (sortMode === 'title') {
      return (a.title || '').localeCompare(b.title || '', 'en', { sensitivity: 'base' });
    }
    if (sortMode === 'price-up') {
      return a.price - b.price;
    }
    if (sortMode === 'price-down') {
      return b.price - a.price;
    }
    return 0;
  });

  return filtered;
}
