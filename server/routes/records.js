const express = require('express');
const requireRole = require('../middleware/requireRole');
const config = require('../config');
const c = require('../controllers/recordsController');

const router = express.Router();
const anyAllowedRole = requireRole(...config.roles);

router.get('/', anyAllowedRole, c.listRecords);
router.get('/stats', c.getRecordStats); // public or internal aggregate stats
router.post('/', anyAllowedRole, c.createRecord);
router.put('/:id', anyAllowedRole, c.updateRecord);
router.delete('/:id', anyAllowedRole, c.deleteRecord);

module.exports = router;
