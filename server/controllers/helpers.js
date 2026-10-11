// Generic shared helpers for controllers

const RESERVED_PARAMS = new Set(['q', 'sort', 'order', 'from', 'to', 'userId', 'itemId']);

// Returns the names of required fields that are missing or empty
function missingFields(body, required = []) {
  return required.filter(
    (f) => body[f] === undefined || body[f] === null || String(body[f]).trim() === ''
  );
}

// Remove fields the client must not set directly
function cleanBody(body, extraBlocked = []) {
  const copy = { ...(body || {}) };
  delete copy._id;
  extraBlocked.forEach((f) => delete copy[f]);
  return copy;
}

// Case-insensitive substring match across all string/number fields of the doc
function matchesText(doc, q) {
  if (!q) return true;
  const needle = String(q).toLowerCase();
  return Object.entries(doc).some(
    ([key, value]) =>
      key !== '_id' &&
      (typeof value === 'string' || typeof value === 'number') &&
      String(value).toLowerCase().includes(needle)
  );
}

// Generic query builder for list endpoints:
// Handles ?sort=field&order=asc|desc, ?from=&to= (date range), and ?field=value exact filters
function buildMongoFilter(query, { dateField = 'date' } = {}) {
  const filter = {};

  // Exact filters for any non-reserved param
  for (const [key, value] of Object.entries(query || {})) {
    if (!RESERVED_PARAMS.has(key) && value !== undefined && value !== '') {
      filter[key] = value;
    }
  }

  // Date range filters on the configured dateField
  if (dateField && (query.from || query.to)) {
    filter[dateField] = {};
    if (query.from) filter[dateField].$gte = query.from;
    if (query.to) filter[dateField].$lte = query.to;
  }

  // Sorting
  const sort = {};
  if (query.sort) {
    const direction = query.order === 'asc' ? 1 : -1;
    sort[query.sort] = direction;
  } else {
    sort._id = -1; // default newest first
  }

  return { filter, sort };
}

// Generic statistics calculator for an entity collection
async function calcStats(collection, numericField) {
  const count = await collection.countDocuments();
  if (count === 0 || !numericField) {
    return { count, sum: 0, avg: 0, min: 0, max: 0, numericField };
  }

  const pipeline = [
    {
      $match: {
        [numericField]: { $exists: true, $ne: null, $type: 'number' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        sum: { $sum: `$${numericField}` },
        avg: { $avg: `$${numericField}` },
        min: { $min: `$${numericField}` },
        max: { $max: `$${numericField}` }
      }
    }
  ];

  const [agg] = await collection.aggregate(pipeline).toArray();
  return {
    count,
    sum: agg?.sum ?? 0,
    avg: agg?.avg ? Math.round(agg.avg * 100) / 100 : 0,
    min: agg?.min ?? 0,
    max: agg?.max ?? 0,
    numericField,
  };
}

module.exports = {
  missingFields,
  cleanBody,
  matchesText,
  buildMongoFilter,
  calcStats,
};
