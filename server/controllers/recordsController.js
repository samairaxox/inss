const { getDb, toObjectId } = require('../db');
const config = require('../config');
const { missingFields, cleanBody, buildMongoFilter, calcStats } = require('./helpers');

const records = () => getDb().collection(config.collections.records);
const BLOCKED = ['item', 'user', 'createdAt'];

const toOid = (field) => ({
  $convert: { input: `$${field}`, to: 'objectId', onError: null, onNull: null },
});

// GET /api/records?userId=&itemId=&date=&from=&to=&sort=&order=
async function listRecords(req, res) {
  const { filter, sort } = buildMongoFilter(req.query, { dateField: config.records.dateField });

  // If auth is enabled, non-admins only see their own records
  if (config.authEnabled && req.user && req.user.role !== config.adminRole) {
    filter.userId = req.user.id;
  } else if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  if (req.query.itemId) {
    filter.itemId = req.query.itemId;
  }

  const docs = await records()
    .aggregate([
      { $match: filter },
      { $addFields: { _itemOid: toOid('itemId'), _userOid: toOid('userId') } },
      { $lookup: { from: config.collections.items, localField: '_itemOid', foreignField: '_id', as: 'item' } },
      { $lookup: { from: config.collections.users, localField: '_userOid', foreignField: '_id', as: 'user' } },
      { $addFields: { item: { $arrayElemAt: ['$item', 0] }, user: { $arrayElemAt: ['$user', 0] } } },
      { $project: { _itemOid: 0, _userOid: 0, 'user.password': 0 } },
      { $sort: sort },
    ])
    .toArray();

  res.json(docs);
}

// GET /api/records/stats
async function getRecordStats(req, res) {
  const stats = await calcStats(records(), config.records.numericField);
  res.json(stats);
}

// Validate itemId exists in items collection
async function checkItem(itemId) {
  const _id = toObjectId(itemId);
  if (!_id) return { status: 400, message: 'Invalid itemId' };
  const item = await getDb().collection(config.collections.items).findOne({ _id });
  if (!item) return { status: 404, message: 'Item not found' };
  return null;
}

// POST /api/records
async function createRecord(req, res) {
  const body = cleanBody(req.body, BLOCKED);

  if (config.authEnabled) {
    body.userId = (req.user?.role === config.adminRole && body.userId) ? body.userId : req.user?.id;
    if (!body.userId) return res.status(400).json({ message: 'Missing x-user-id header' });
  } else {
    body.userId = body.userId || 'public';
  }

  const missing = missingFields(body, ['itemId', ...config.records.required]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  const itemError = await checkItem(body.itemId);
  if (itemError) return res.status(itemError.status).json({ message: itemError.message });

  body.itemId = String(body.itemId);
  body.createdAt = new Date().toISOString();
  const result = await records().insertOne(body);
  res.status(201).json({ _id: result.insertedId, ...body });
}

async function loadOwned(req, res) {
  const _id = toObjectId(req.params.id);
  if (!_id) {
    res.status(400).json({ message: 'Invalid id' });
    return null;
  }
  const existing = await records().findOne({ _id });
  if (!existing) {
    res.status(404).json({ message: 'Record not found' });
    return null;
  }
  if (config.authEnabled && req.user?.role !== config.adminRole && existing.userId !== req.user?.id) {
    res.status(403).json({ message: 'You can only change your own records' });
    return null;
  }
  return existing;
}

// PUT /api/records/:id
async function updateRecord(req, res) {
  const existing = await loadOwned(req, res);
  if (!existing) return;

  const changes = cleanBody(req.body, BLOCKED);
  if (config.authEnabled && req.user?.role !== config.adminRole) {
    delete changes.userId;
  }
  const merged = { ...existing, ...changes };

  const missing = missingFields(merged, ['itemId', ...config.records.required]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
  }
  if (changes.itemId && changes.itemId !== existing.itemId) {
    const itemError = await checkItem(changes.itemId);
    if (itemError) return res.status(itemError.status).json({ message: itemError.message });
  }
  await records().updateOne({ _id: existing._id }, { $set: changes });
  res.json(merged);
}

// DELETE /api/records/:id
async function deleteRecord(req, res) {
  const existing = await loadOwned(req, res);
  if (!existing) return;
  await records().deleteOne({ _id: existing._id });
  res.json({ message: 'Record deleted', _id: existing._id });
}

module.exports = { listRecords, getRecordStats, createRecord, updateRecord, deleteRecord };
