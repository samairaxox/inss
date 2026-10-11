const config = require('../config');

// DEMO ONLY: trusts the "x-role" and "x-user-id" headers sent by the client.
// If config.authEnabled is false, all routes pass through freely.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!config.authEnabled) {
      req.user = { role: config.adminRole, id: req.header('x-user-id') || 'public' };
      return next();
    }

    const role = req.header('x-role');
    const allowed = roles.length ? roles : config.roles;

    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ message: `Forbidden: requires role ${allowed.join(' or ')}` });
    }
    req.user = { role, id: req.header('x-user-id') || '' };
    next();
  };
}

module.exports = requireRole;
