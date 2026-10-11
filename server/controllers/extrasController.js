const { getDb, toObjectId } = require('../db');
const config = require('../config');
const { missingFields, cleanBody, matchesText, buildMongoFilter, calcStats } = require('./helpers');

const extras = () => getDb().collection(config.collections.extras);

// GET /api/extras?q=&sort=&order=&from=&to=&<field>=<value>
async function listExtras(req, res) {
  const { filter, sort } = buildMongoFilter(req.query, { dateField: config.extras.dateField });
  let docs = await extras().find(filter).sort(sort).toArray();
  if (req.query.q) docs = docs.filter((doc) => matchesText(doc, req.query.q));
  res.json(docs);
}

// GET /api/extras/stats
async function getExtraStats(req, res) {
  const stats = await calcStats(extras(), config.extras.numericField);
  res.json(stats);
}

// GET /api/extras/:id
async function getExtra(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const doc = await extras().findOne({ _id });
  if (!doc) return res.status(404).json({ message: 'Extra not found' });
  res.json(doc);
}

// POST /api/extras  (admin or public if auth disabled)
async function createExtra(req, res) {
  const body = cleanBody(req.body);
  const missing = missingFields(body, config.extras.required);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  const result = await extras().insertOne(body);
  res.status(201).json({ _id: result.insertedId, ...body });
}

// PUT /api/extras/:id  (admin or public if auth disabled)
async function updateExtra(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const body = cleanBody(req.body);
  const missing = missingFields(body, config.extras.required);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  const result = await extras().replaceOne({ _id }, body);
  if (result.matchedCount === 0) return res.status(404).json({ message: 'Extra not found' });
  res.json({ _id, ...body });
}

// DELETE /api/extras/:id  (admin or public if auth disabled)
async function deleteExtra(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const result = await extras().deleteOne({ _id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Extra not found' });
  res.json({ message: 'Extra deleted', _id });
}

module.exports = { listExtras, getExtraStats, getExtra, createExtra, updateExtra, deleteExtra };
