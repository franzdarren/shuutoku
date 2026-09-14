/** Fisher-Yates shuffle (non-mutating). */
export function shuffled(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A random sample of up to `n` items from `pool`. */
export function drawSample(pool, n = 10) {
  return shuffled(pool).slice(0, Math.min(n, pool.length));
}
