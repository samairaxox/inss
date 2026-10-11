const express = require('express');
const requireRole = require('../middleware/requireRole');
const config = require('../config');
const c = require('../controllers/itemsController');

const router = express.Router();
router.get('/', c.listItems); // public
router.get('/stats', c.getItemStats); // public stats
router.get('/:id', c.getItem); // public
router.post('/', requireRole(config.adminRole), c.createItem);
router.put('/:id', requireRole(config.adminRole), c.updateItem);
router.delete('/:id', requireRole(config.adminRole), c.deleteItem);

module.exports = router;
