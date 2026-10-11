const express = require('express');
const requireRole = require('../middleware/requireRole');
const config = require('../config');
const { listUsers } = require('../controllers/usersController');

const router = express.Router();
router.get('/', requireRole(config.adminRole), listUsers);

module.exports = router;
