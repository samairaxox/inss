const express = require('express');
const requireRole = require('../middleware/requireRole');
const config = require('../config');
const c = require('../controllers/extrasController');

const router = express.Router();
router.get('/', c.listExtras); // public
router.get('/stats', c.getExtraStats); // public stats
router.get('/:id', c.getExtra); // public
router.post('/', requireRole(config.adminRole), c.createExtra);
router.put('/:id', requireRole(config.adminRole), c.updateExtra);
router.delete('/:id', requireRole(config.adminRole), c.deleteExtra);

module.exports = router;
