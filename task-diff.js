const trello = require("./trello");

// Dice coefficient on character bigrams — fast, language-agnostic, handles typos
function similarity(a, b) {
  const normalize = s => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;

  function bigrams(s) {
    const map = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.slice(i, i + 2);
      map.set(bg, (map.get(bg) || 0) + 1);
    }
    return map;
  }

  const bg1 = bigrams(na);
  const bg2 = bigrams(nb);
  let intersection = 0;
  for (const [k, v] of bg1) intersection += Math.min(v, bg2.get(k) || 0);
  const total = [...bg1.values()].reduce((s, v) => s + v, 0) +
                [...bg2.values()].reduce((s, v) => s + v, 0);
  return total === 0 ? 0 : (2 * intersection) / total;
}

const SIMILARITY_THRESHOLD = 0.80;

/**
 * Compare a candidate task title against existing Trello cards on a board.
 *
 * @param {{ title: string, targetBoardId?: string }} params
 * @returns {Promise<{ diffStatus, matchedCardId, confidence, matchReason }>}
 */
async function diffTask({ title, targetBoardId }) {
  if (!targetBoardId || !title) {
    return {
      diffStatus:    "create_new",
      matchedCardId: null,
      confidence:    1.0,
      matchReason:   "No board or title — defaulting to create_new",
    };
  }

  try {
    const lists = await trello.getLists(targetBoardId);
    const allCards = [];
    await Promise.all(lists.map(async list => {
      const cards = await trello.getCards(list.id);
      cards.forEach(c => allCards.push(c));
    }));

    const matches = allCards
      .map(card => ({ card, score: similarity(title, card.name) }))
      .filter(m => m.score >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      return {
        diffStatus:    "create_new",
        matchedCardId: null,
        confidence:    1.0,
        matchReason:   "No similar cards found",
      };
    }

    const best = matches[0];

    if (matches.length === 1) {
      return {
        diffStatus:    "update_existing",
        matchedCardId: best.card.id,
        confidence:    Math.round(best.score * 100) / 100,
        matchReason:   `Title similarity ${Math.round(best.score * 100)}%`,
      };
    }

    // Multiple matches above threshold → flag as possible duplicate
    return {
      diffStatus:    "possible_duplicate",
      matchedCardId: best.card.id,
      confidence:    Math.round(best.score * 0.7 * 100) / 100,
      matchReason:   `${matches.length} similar cards found; top match ${Math.round(best.score * 100)}%`,
    };
  } catch (e) {
    console.error("[task-diff]", e.message);
    return {
      diffStatus:    "create_new",
      matchedCardId: null,
      confidence:    1.0,
      matchReason:   "Diff lookup failed — defaulting to create_new",
    };
  }
}

module.exports = { diffTask, similarity };
