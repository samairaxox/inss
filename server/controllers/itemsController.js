const { getDb, toObjectId } = require('../db');
const config = require('../config');
const { missingFields, cleanBody, matchesText, buildMongoFilter, calcStats } = require('./helpers');

const items = () => getDb().collection(config.collections.items);

// GET /api/items?q=&sort=&order=&from=&to=&<field>=<value>
async function listItems(req, res) {
  const { filter, sort } = buildMongoFilter(req.query, { dateField: config.items.dateField });
  let docs = await items().find(filter).sort(sort).toArray();
  if (req.query.q) docs = docs.filter((doc) => matchesText(doc, req.query.q));
  res.json(docs);
}

// GET /api/items/stats
async function getItemStats(req, res) {
  const stats = await calcStats(items(), config.items.numericField);
  res.json(stats);
}

// GET /api/items/:id
async function getItem(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const doc = await items().findOne({ _id });
  if (!doc) return res.status(404).json({ message: 'Item not found' });
  res.json(doc);
}

// POST /api/items  (admin or public if auth disabled)
async function createItem(req, res) {
  const body = cleanBody(req.body);
  const missing = missingFields(body, config.items.required);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  const result = await items().insertOne(body);
  res.status(201).json({ _id: result.insertedId, ...body });
}

// PUT /api/items/:id  (admin or public if auth disabled)
async function updateItem(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const body = cleanBody(req.body);
  const missing = missingFields(body, config.items.required);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  const result = await items().replaceOne({ _id }, body);
  if (result.matchedCount === 0) return res.status(404).json({ message: 'Item not found' });
  res.json({ _id, ...body });
}

// DELETE /api/items/:id  (admin or public if auth disabled)
async function deleteItem(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).json({ message: 'Invalid id' });

  const result = await items().deleteOne({ _id });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Item not found' });
  await getDb().collection(config.collections.records).deleteMany({ itemId: String(_id) });
  res.json({ message: 'Item deleted', _id });
}

module.exports = { listItems, getItemStats, getItem, createItem, updateItem, deleteItem };
