// =====================================================================
// THE ONE PLACE FOR CLIENT-SIDE NAMES, FIELDS & PERMISSIONS.
// Tables (DataTable) and forms (ItemForm) are generated from these field
// lists. To adapt to any problem statement, change this file and server/config.js.
// =====================================================================

export const APP_TITLE = 'Starter App';

// Set to false if the problem requires NO authentication/login
export const AUTH_ENABLED = true;

// Configurable roles (allow 2, 3 or more: e.g. ['admin', 'doctor', 'patient'])
export const ROLES = ['admin', 'user'];
export const ADMIN_ROLE = 'admin';
export const DEFAULT_ROLE = 'user';

// Permissions for standard non-admin users
export const PERMISSIONS = {
  userCanCreateRecords: true, // false = users only view records
  userCanEditRecords: true,   // false = no Edit / Cancel buttons on My Records
};

export const LABELS = {
  dashboard: 'Dashboard',
  item: 'Item',
  items: 'Items',
  manageItems: 'Manage Items',
  extra: 'Extra',
  extras: 'Extras',
  manageExtras: 'Manage Extras',
  record: 'Record',
  records: 'Records',
  myRecords: 'My Records',
  allRecords: 'All Records',
  createRecord: 'Create Record',
  cancelRecord: 'Cancel',
  user: 'User',
};

// Which field to show as the display name in joined tables
export const ITEM_TITLE_FIELD = 'name';
export const EXTRA_TITLE_FIELD = 'name';

// Field definition: { name, label, type, required, options?, default?, hideInTable? }
// Supported types: 'text' | 'number' | 'date' | 'time' | 'email' | 'textarea' | 'select'

export const ITEM_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', required: true },
  { name: 'value', label: 'Value', type: 'number', required: true },
  { name: 'date', label: 'Date', type: 'date', required: false },
  { name: 'description', label: 'Description', type: 'textarea', required: false, hideInTable: true },
];

export const EXTRA_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'type', label: 'Type', type: 'text', required: true },
  { name: 'amount', label: 'Amount', type: 'number', required: true },
  { name: 'date', label: 'Date', type: 'date', required: false },
  { name: 'description', label: 'Description', type: 'textarea', required: false, hideInTable: true },
];

// Records always link to an item via itemId; do not list itemId here
export const RECORD_FIELDS = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'quantity', label: 'Quantity', type: 'number', required: false, default: 1 },
  { name: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'done'], default: 'active' },
  { name: 'notes', label: 'Notes', type: 'textarea', required: false },
];

// Config-driven entity list for navigation and dashboard
export const ENTITIES = [
  { key: 'items', label: LABELS.items, apiPath: '/items', fields: ITEM_FIELDS, titleField: ITEM_TITLE_FIELD, adminPath: '/admin/items' },
  { key: 'extras', label: LABELS.extras, apiPath: '/extras', fields: EXTRA_FIELDS, titleField: EXTRA_TITLE_FIELD, adminPath: '/admin/extras' },
];
