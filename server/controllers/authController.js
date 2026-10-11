const { getDb } = require('../db');
const config = require('../config');

// POST /api/auth/login  {email, password} -> {user:{_id,name,role}}
// DEMO ONLY: passwords are stored and compared as plain text.
async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await getDb()
    .collection(config.collections.users)
    .findOne({ email: String(email).trim().toLowerCase() });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { login };
