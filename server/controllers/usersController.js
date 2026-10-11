const { getDb } = require('../db');
const config = require('../config');

// GET /api/users?role=  (admin) - never returns passwords
async function listUsers(req, res) {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await getDb()
    .collection(config.collections.users)
    .find(filter, { projection: { password: 0 } })
    .sort({ name: 1 })
    .toArray();
  res.json(users);
}

module.exports = { listUsers };
