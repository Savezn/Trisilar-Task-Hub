/**
 * Normalize raw Trello card → consistent shape for all-cards / boards/cards
 * cfData: { nameMap: Map<id, name>, optionMap: Map<id, value> }
 */
function normalizeCard(card, cfData = { nameMap: new Map(), optionMap: new Map() }) {
  const { nameMap, optionMap } = cfData;

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
    const key = nameMap.get(cf.idCustomField) || cf.idCustomField;

    // Value resolution: Check for standard types, then fallback to dropdown options
    let value = val.text ?? val.number ?? val.date ?? val.checked ?? null;
    if (value === null && cf.idValue) {
      value = optionMap.get(cf.idValue) || cf.idValue;
    }

    customFields[key] = value;
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
 * Build cfData (names and options maps) for a board
 * @param {string} boardId
 * @param {Map} cfCache - global cache Map<boardId, cfData>
 * @param {Array|object} source - either array of custom field definitions OR trello client
 */
async function buildCfNames(boardId, cfCache, source) {
  if (cfCache.has(boardId)) return cfCache.get(boardId);

  let fields = [];
  if (Array.isArray(source)) {
    fields = source;
  } else if (source && typeof source.getBoardCustomFields === 'function') {
    try {
      fields = await source.getBoardCustomFields(boardId);
    } catch {
      fields = [];
    }
  }

  const nameMap = new Map();
  const optionMap = new Map();

  (fields || []).forEach(f => {
    nameMap.set(f.id, f.name);
    if (f.options) {
      f.options.forEach(opt => {
        if (opt.value && opt.value.text) {
          optionMap.set(opt.id, opt.value.text);
        }
      });
    }
  });

  const data = { nameMap, optionMap };
  cfCache.set(boardId, data);
  return data;
}

module.exports = {
  normalizeCard,
  buildCfNames
};
