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

/** A sample of `n` items that prefers questions you haven't answered yet
 *  (`seenIds` holds the ids you have), only falling back to already-seen
 *  ones once the fresh pool runs dry — so "new set" genuinely hands you
 *  new questions instead of reshuffling the same ones. */
export function drawFreshSample(pool, n, seenIds, getId) {
  const unseen = pool.filter((it) => !seenIds.has(getId(it)));
  if (unseen.length >= n) return drawSample(unseen, n);

  const picked = drawSample(unseen, unseen.length);
  const pickedIds = new Set(picked.map(getId));
  const filler = pool.filter((it) => !pickedIds.has(getId(it)));
  picked.push(...drawSample(filler, n - picked.length));
  return shuffled(picked);
}

/** A random sample biased toward "weak" items (ones you've previously
 *  gotten wrong, per `weakIds`) — a lightweight stand-in for spaced
 *  repetition: up to 60% of the slots are filled from your mistakes first
 *  (so they resurface more often), the rest filled randomly as usual, then
 *  the whole set is reshuffled so weak items aren't always sorted first.
 *  Falls back to a plain random sample when there's no mistake history yet. */
export function drawSampleWeighted(pool, n, weakIds, getId) {
  if (!weakIds || weakIds.size === 0) return drawSample(pool, n);
  const weak = pool.filter((it) => weakIds.has(getId(it)));
  const rest = pool.filter((it) => !weakIds.has(getId(it)));
  const weakSlots = Math.min(weak.length, Math.ceil(n * 0.6));
  const picked = shuffled(weak).slice(0, weakSlots);
  picked.push(...shuffled(rest).slice(0, n - picked.length));
  return shuffled(picked);
}
