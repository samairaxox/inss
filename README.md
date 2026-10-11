# WP-II Generic Full-Stack Starter (Express + MongoDB + React)

A domain-agnostic full-stack template: **Node/Express + MongoDB native driver** backend and a **React (Vite) + React Router** frontend.

Built for timed lab exams where the problem statement is unknown in advance. The template provides:
- **3 independent entities**: Primary entity 1 (`items`), Primary entity 2 (`extras`), Linking/transaction entity (`records`), plus `users`.
- **Configurable roles**: 2, 3 or more roles (e.g. `['admin', 'user']`, `['admin', 'doctor', 'patient']`).
- **Auth toggle (`AUTH_ENABLED`)**: Set `false` for open public apps (no login required).
- **Generic query engine**: Built-in support on all list routes for `?q=` text search, `?sort=&order=`, `?from=&to=` date range, and `?field=value` exact filters.
- **Aggregations / Stats**: `GET /api/:entity/stats` returns count, sum, average, min, and max for instant dashboards.
- **Reusable Dashboard**: Pre-built `/` dashboard page with summary metric cards.

To adapt the entire app to a new problem statement, edit **only 3 files**:
1. `server/config.js` – collections, required fields, date/numeric fields, roles, auth toggle.
2. `server/seed.js` – sample data for users, items, extras, records.
3. `client/src/config.js` – labels, field definitions, permissions, roles, auth toggle.

> When auth is enabled, login is **demo only** (plain-text passwords, client sends `x-role` and `x-user-id` headers).

---

## 1. First 5 minutes on the new PC

1. **Unzip near the drive root**, e.g. `C:\wp2\wp2-template\` (spaces in the path are supported).
2. Open **Command Prompt** or PowerShell in that folder and verify Node (v18+):
   ```cmd
   node -v
   npm -v
   ```
3. **Make sure MongoDB is running** on `mongodb://localhost:27017`:
   - PowerShell: `Get-Service MongoDB` -> Status: `Running`
   - Start via Windows Service (Admin prompt): `net start MongoDB`
   - Ping test: `mongosh --eval "db.runCommand({ ping: 1 })"` -> `{ ok: 1 }`
4. Install all dependencies (root, server, client):
   ```cmd
   npm run setup
   ```
5. Seed initial placeholder data (idempotent, resets and repopulates):
   ```cmd
   npm run seed
   ```
6. Start backend and frontend together:
   ```cmd
   npm run dev
   ```
7. Open **http://localhost:5173**
   - Admin login: `admin1@test.com` / `admin123`
   - User login: `user1@test.com` / `user123`

Ports: Server `http://localhost:5000/api`, Client `http://localhost:5173`. Defaults work out-of-the-box even without `.env` files.

---

## 2. Architecture & Config Mappings

| Generic Concept | Default Name | Example 1 (School) | Example 2 (Hospital) | Example 3 (Store) | Example 4 (Notice Board - No Auth) |
|---|---|---|---|---|---|
| **Entity 1** | `items` | Students | Doctors | Books | Notices |
| **Entity 2** | `extras` | Courses | Departments | Categories | Tags / Topics |
| **Entity 3** | `records` | Enrollments / Grades | Appointments | Orders | Comments / Likes |
| **Roles** | `['admin', 'user']` | `['teacher', 'student']` | `['admin', 'doctor', 'patient']` | `['admin', 'customer']` | *(Auth disabled: all public)* |

### Where features live

| Feature | Frontend Page | URL Route | Backend Route |
|---|---|---|---|
| Summary Dashboard | `pages/Dashboard.jsx` | `/` | `GET /api/:entity/stats` |
| Entity 1 Browse & Search | `pages/ItemList.jsx` | `/items` | `GET /api/items?q=&sort=&from=&to=` |
| Entity 1 Detail + Create Record | `pages/ItemDetail.jsx` | `/items/:id` | `GET /api/items/:id`, `POST /api/records` |
| Entity 1 Admin Management | `pages/AdminItems.jsx` | `/admin/items` | `POST /api/items`, `PUT/DELETE /:id` |
| Entity 2 Browse & Search | `pages/ExtraList.jsx` | `/extras` | `GET /api/extras?q=&sort=&from=&to=` |
| Entity 2 Admin Management | `pages/AdminExtras.jsx` | `/admin/extras` | `POST /api/extras`, `PUT/DELETE /:id` |
| User Activity / Transactions | `pages/MyRecords.jsx` | `/my-records` | `GET/PUT/DELETE /api/records` |
| Master Records / Schedule | `pages/AdminRecords.jsx` | `/admin/records` | `GET /api/records?date=&sort=` |
| Login / Logout | `pages/Login.jsx`, `Navbar.jsx` | `/login` | `POST /api/auth/login` |

---

## 3. Swap Drills (How to adapt the template)

### Drill A: 3 Roles & 3 Entities (e.g. Hospital: Doctors, Departments, Appointments)
- Roles: `admin`, `doctor`, `patient`
- Entity 1 (`items`): `doctors` (name, specialty, fee)
- Entity 2 (`extras`): `departments` (name, floor, roomCount)
- Entity 3 (`records`): `appointments` (date, time, reason, status)

1. **`server/config.js`**:
   ```js
   authEnabled: true,
   roles: ['admin', 'doctor', 'patient'],
   adminRole: 'admin',
   defaultRole: 'patient',
   collections: { users: 'users', items: 'doctors', extras: 'departments', records: 'appointments' },
   items: { required: ['name', 'specialty', 'fee'], numericField: 'fee', dateField: 'date' },
   extras: { required: ['name', 'floor', 'roomCount'], numericField: 'roomCount', dateField: 'date' },
   records: { required: ['date'], numericField: 'quantity', dateField: 'date' }
   ```
2. **`server/seed.js`**:
   - Seed users with `role: 'doctor'`, `role: 'patient'`, `role: 'admin'`.
   - Seed items with doctor properties (`name`, `specialty`, `fee: 100`).
   - Seed extras with department properties (`name`, `floor: 2`, `roomCount: 15`).
   - Seed records with appointment data (`user`, `item`, `date`, `status: 'active'`).
3. **`client/src/config.js`**:
   ```js
   export const APP_TITLE = 'Hospital Management System';
   export const AUTH_ENABLED = true;
   export const ROLES = ['admin', 'doctor', 'patient'];
   export const ADMIN_ROLE = 'admin';
   export const DEFAULT_ROLE = 'patient';
   export const LABELS = {
     dashboard: 'Overview', item: 'Doctor', items: 'Doctors', manageItems: 'Manage Doctors',
     extra: 'Department', extras: 'Departments', manageExtras: 'Manage Departments',
     record: 'Appointment', records: 'Appointments', myRecords: 'My Appointments', allRecords: 'All Appointments',
     createRecord: 'Book Appointment', cancelRecord: 'Cancel', user: 'Patient'
   };
   export const ITEM_FIELDS = [
     { name: 'name', label: 'Doctor Name', type: 'text', required: true },
     { name: 'specialty', label: 'Specialty', type: 'text', required: true },
     { name: 'fee', label: 'Consultation Fee', type: 'number', required: true },
     { name: 'date', label: 'Available Date', type: 'date', required: false }
   ];
   export const EXTRA_FIELDS = [
     { name: 'name', label: 'Department Name', type: 'text', required: true },
     { name: 'floor', label: 'Floor', type: 'text', required: true },
     { name: 'roomCount', label: 'Rooms', type: 'number', required: true }
   ];
   export const RECORD_FIELDS = [
     { name: 'date', label: 'Appointment Date', type: 'date', required: true },
     { name: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'done'], default: 'active' },
     { name: 'notes', label: 'Reason for Visit', type: 'textarea', required: false }
   ];
   ```
4. Run `npm run seed` and refresh the browser.

---

### Drill B: Public App with No Authentication (`AUTH_ENABLED = false`) (e.g. Public Notice Board)
- Entity 1 (`items`): `notices` (title, author, urgency, date, description)
- Entity 2 (`extras`): `categories` (name, icon, count)
- Entity 3 (`records`): `comments` (date, rating, notes)

1. **`server/config.js`**:
   ```js
   authEnabled: false,
   collections: { users: 'users', items: 'notices', extras: 'categories', records: 'comments' },
   items: { required: ['title', 'author'], numericField: 'urgency', dateField: 'date' },
   extras: { required: ['name'], numericField: 'count', dateField: 'date' },
   records: { required: ['date'], numericField: 'rating', dateField: 'date' }
   ```
2. **`server/seed.js`**:
   - Seed sample notices, categories, and comments.
3. **`client/src/config.js`**:
   ```js
   export const APP_TITLE = 'Community Notice Board';
   export const AUTH_ENABLED = false;
   export const LABELS = {
     dashboard: 'Board Overview', item: 'Notice', items: 'All Notices', manageItems: 'Post Notice',
     extra: 'Category', extras: 'Categories', manageExtras: 'Manage Categories',
     record: 'Feedback', records: 'Feedback', myRecords: 'Feedback', allRecords: 'All Feedback',
     createRecord: 'Leave Feedback', cancelRecord: 'Remove', user: 'Author'
   };
   export const ITEM_FIELDS = [
     { name: 'title', label: 'Title', type: 'text', required: true },
     { name: 'author', label: 'Author', type: 'text', required: true },
     { name: 'urgency', label: 'Urgency Level (1-5)', type: 'number', required: false, default: 1 },
     { name: 'date', label: 'Posted Date', type: 'date', required: false },
     { name: 'description', label: 'Notice Content', type: 'textarea', required: true }
   ];
   export const EXTRA_FIELDS = [
     { name: 'name', label: 'Category Name', type: 'text', required: true },
     { name: 'count', label: 'Item Count', type: 'number', required: false, default: 0 }
   ];
   export const RECORD_FIELDS = [
     { name: 'date', label: 'Date', type: 'date', required: true },
     { name: 'notes', label: 'Comment / Note', type: 'textarea', required: true }
   ];
   ```
4. Run `npm run seed`. Notice that login is completely bypassed: navbar displays all entity pages and posting forms immediately.

---

## 4. Problem Does Not Fit? Quick Extension Guide

When a question demands something outside the 3 default entities or basic fields:

### A. Need a 4th Entity (e.g. `suppliers` or `reviews`)
1. **Server**:
   - In `server/config.js`, add `collections.suppliers = 'suppliers'` and `suppliers: { required: ['name'], dateField: 'date', numericField: 'rating' }`.
   - Copy `server/controllers/extrasController.js` to `server/controllers/suppliersController.js` (replace `extras` with `suppliers`).
   - Copy `server/routes/extras.js` to `server/routes/suppliers.js` and mount in `server/index.js`:
     `app.use('/api/suppliers', require('./routes/suppliers'));`.
2. **Client**:
   - In `client/src/config.js`, define `SUPPLIER_FIELDS` and add an entry to `ENTITIES`:
     `{ key: 'suppliers', label: 'Suppliers', apiPath: '/suppliers', fields: SUPPLIER_FIELDS, titleField: 'name', adminPath: '/admin/suppliers' }`.
   - In `client/src/App.jsx`, add route `<Route path="/suppliers" element={<ExtraList />} />` or copy `ExtraList.jsx`.

### B. Need a New Role (e.g. `manager`, `editor`, `cashier`)
1. Add the role name to `roles: [...]` in `server/config.js` and `ROLES: [...]` in `client/src/config.js`.
2. In `server/routes/items.js` or `server/routes/records.js`, update `requireRole('admin', 'manager')`.
3. In `client/src/App.jsx`, pass `roles={['admin', 'manager']}` to `<ProtectedRoute>`.

### C. Need a New Field Type in Forms
`client/src/components/ItemForm.jsx` already supports:
- `text`, `number`, `date`, `time`, `email`, `textarea`, and `select` (with `options: ['opt1', 'opt2']` or `{value, label}`).
- To add a checkbox / boolean:
  In `ItemForm.jsx`, add inside the form render:
  ```jsx
  f.type === 'checkbox' ? (
    <input type="checkbox" id={id} name={f.name} checked={!!values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} />
  ) : ...
  ```

### D. Need a Custom Filter or Calculation
- **Server**: In `server/controllers/helpers.js`, `buildMongoFilter(query)` passes any arbitrary query param directly into MongoDB filter:
  e.g. `GET /api/items?status=approved&department=cardiology` works automatically with zero code changes.
- **Client**: In any list page (e.g. `ItemList.jsx`), add an input to the toolbar and append it to `params.set('field', val)`.

---

## 5. API Cheat Sheet

```bat
:: Login (returns user object + role)
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin1@test.com\",\"password\":\"admin123\"}"

:: Aggregated Stats (count, sum, avg, min, max)
curl http://localhost:5000/api/items/stats
curl http://localhost:5000/api/extras/stats
curl http://localhost:5000/api/records/stats

:: Generic queries (sort, date range, arbitrary exact filter, text search)
curl "http://localhost:5000/api/items?sort=value&order=desc"
curl "http://localhost:5000/api/items?from=2026-10-10&to=2026-10-12"
curl "http://localhost:5000/api/items?category=Category%20A"
curl "http://localhost:5000/api/items?q=sample"

:: Entity 1 (Items) CRUD
curl http://localhost:5000/api/items/<ITEM_ID>
curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -H "x-role: admin" -d "{\"name\":\"New Item\",\"category\":\"X\",\"value\":120}"
curl -X PUT http://localhost:5000/api/items/<ITEM_ID> -H "Content-Type: application/json" -H "x-role: admin" -d "{\"name\":\"Updated\",\"category\":\"X\",\"value\":150}"
curl -X DELETE http://localhost:5000/api/items/<ITEM_ID> -H "x-role: admin"

:: Entity 2 (Extras) CRUD
curl http://localhost:5000/api/extras
curl -X POST http://localhost:5000/api/extras -H "Content-Type: application/json" -H "x-role: admin" -d "{\"name\":\"New Extra\",\"type\":\"Y\",\"amount\":45}"

:: Entity 3 (Records) CRUD
curl http://localhost:5000/api/records -H "x-role: admin"
curl -X POST http://localhost:5000/api/records -H "Content-Type: application/json" -H "x-role: user" -H "x-user-id: <USER_ID>" -d "{\"itemId\":\"<ITEM_ID>\",\"date\":\"2026-10-25\",\"quantity\":1,\"status\":\"active\"}"
curl -X PUT http://localhost:5000/api/records/<RECORD_ID> -H "Content-Type: application/json" -H "x-role: user" -H "x-user-id: <USER_ID>" -d "{\"quantity\":3}"
curl -X DELETE http://localhost:5000/api/records/<RECORD_ID> -H "x-role: user" -H "x-user-id: <USER_ID>"
```

---

## 6. Common Failures & Quick Fixes

| Symptom | Cause & Fix |
|---|---|
| `MongoDB not reachable at ...` | Ensure MongoDB service is running (`net start MongoDB` or `Get-Service MongoDB`). |
| `Port 5000 is already in use` | Kill previous process: `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F`, or change `PORT` in `server/.env`. |
| Port 5173 busy (Vite picks 5174) | Check the terminal output from Vite for the active port or free 5173. |
| Cannot login (`401 Invalid email or password`) | Run `npm run seed` to reset users. Default passwords are `admin123` / `user123`. |
| `403 Forbidden: requires role ...` | Send header `-H "x-role: <role>"`. If `AUTH_ENABLED = false`, this error never occurs. |
| Missing fields error (`400`) | The payload lacks fields defined in `server/config.js` `required`. |
| Old names / cached values after swap | Re-run `npm run seed`, then press `Ctrl+F5` in the browser to clear browser cache. |
