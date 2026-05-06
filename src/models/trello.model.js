/**
 * Normalize raw Trello card → consistent shape for all-cards / boards/cards
 * cfNames: Map<idCustomField, fieldName> — built per-board to resolve human-readable keys
 */
function normalizeCard(card, cfNames = new Map()) {
  // Checklist progress from embedded checkItems
  let clDone = 0, clTotal = 0;
  (card.checklists || []).forEach(cl => {
    (cl.checkItems || []).forEach(ci => {
      clTotal++;
      if (ci.state === "complete") clDone++;
    });
  });

  // Custom fields keyed by name (fallback to idCustomField if name not resolved)
  const customFields = {};
  (card.customFieldItems || []).forEach(cf => {
    const val = cf.value || {};
    const key = cfNames.get(cf.idCustomField) || cf.idCustomField;
    customFields[key] = val.text ?? val.number ?? val.date ?? val.checked ?? null;
  });

  return {
    id:                card.id,
    name:              card.name,
    desc:              card.desc || "",
    due:               card.due   || null,
    dueComplete:       card.dueComplete || false,
    start:             card.start  || null,
    dueReminder:       card.dueReminder ?? -1,
    url:               card.url || "",
    idList:            card.idList,
    labels:            (card.labels || []).map(l => ({ id: l.id, name: l.name || "", color: l.color || "" })),
    members:           (card.members || []).map(m => ({ id: m.id, username: m.username || "", fullName: m.fullName || m.username || "" })),
    checklistProgress: { done: clDone, total: clTotal },
    customFields,
  };
}

/**
 * Build cfNames Map for a board — per-request cache (Map passed in by caller)
 * @param {string} boardId 
 * @param {Map} cfCache 
 * @param {object} trello - Trello API client
 */
async function buildCfNames(boardId, cfCache, trello) {
  if (cfCache.has(boardId)) return cfCache.get(boardId);
  try {
    const fields = await trello.getBoardCustomFields(boardId);
    const map = new Map((fields || []).map(f => [f.id, f.name]));
    cfCache.set(boardId, map);
    return map;
  } catch {
    // Board has no custom fields or API unsupported — return empty map (safe fallback)
    cfCache.set(boardId, new Map());
    return new Map();
  }
}

module.exports = {
  normalizeCard,
  buildCfNames
};
