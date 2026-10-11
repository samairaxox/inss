// =====================================================================
// THE ONE PLACE FOR SERVER-SIDE NAMES & CONFIGURATION.
// Edit this file to rename collections, required fields, roles, or toggle auth.
// Controllers read from this file, so you rarely need to touch backend code.
// Items, extras and records accept ANY extra fields beyond "required".
// =====================================================================
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  // Environment defaults
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'wp2db',

  // Set to false if the problem requires NO login/authentication
  authEnabled: true,

  // Configurable roles (allow 2, 3 or more: e.g. ['admin', 'doctor', 'patient'])
  roles: ['admin', 'user'],
  adminRole: 'admin',
  defaultRole: 'user',

  // MongoDB collection names
  collections: {
    users: 'users',
    items: 'items',       // Primary entity 1
    extras: 'extras',     // Primary entity 2
    records: 'records',   // Linking/activity entity
  },

  // Entity definitions: required fields, date field for range queries, numeric field for stats
  items: {
    required: ['name', 'category', 'value'],
    dateField: 'date',       // used for ?from=&to= date range filters
    numericField: 'value',   // used for GET /api/items/stats sum/avg
  },

  extras: {
    required: ['name', 'type', 'amount'],
    dateField: 'date',
    numericField: 'amount',
  },

  records: {
    required: ['date'],
    dateField: 'date',
    numericField: 'quantity',
  },
};
