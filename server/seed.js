// Seed placeholder data. Run: npm run seed  (from template root)
// Idempotent: Resets collections, then inserts fresh placeholder data.
// EDIT THIS FILE when swapping to match your problem statement.
const { connectDb, closeDb } = require('./db');
const config = require('./config');

const users = [
  { name: 'Admin One', email: 'admin1@test.com', password: 'admin123', role: 'admin' },
  { name: 'Admin Two', email: 'admin2@test.com', password: 'admin123', role: 'admin' },
  { name: 'User One', email: 'user1@test.com', password: 'user123', role: 'user' },
  { name: 'User Two', email: 'user2@test.com', password: 'user123', role: 'user' },
  { name: 'User Three', email: 'user3@test.com', password: 'user123', role: 'user' },
];

const items = [
  { name: 'Sample Item 1', category: 'Category A', value: 100, date: '2026-10-10', description: 'Description for sample item 1' },
  { name: 'Sample Item 2', category: 'Category A', value: 150, date: '2026-10-10', description: 'Description for sample item 2' },
  { name: 'Sample Item 3', category: 'Category B', value: 200, date: '2026-10-11', description: 'Description for sample item 3' },
  { name: 'Sample Item 4', category: 'Category B', value: 250, date: '2026-10-11', description: 'Description for sample item 4' },
  { name: 'Sample Item 5', category: 'Category C', value: 300, date: '2026-10-12', description: 'Description for sample item 5' },
  { name: 'Sample Item 6', category: 'Category C', value: 350, date: '2026-10-12', description: 'Description for sample item 6' },
  { name: 'Sample Item 7', category: 'Category D', value: 400, date: '2026-10-13', description: 'Description for sample item 7' },
  { name: 'Sample Item 8', category: 'Category D', value: 450, date: '2026-10-13', description: 'Description for sample item 8' },
];

const extras = [
  { name: 'Sample Extra 1', type: 'Type X', amount: 25, date: '2026-10-10', description: 'Description for extra 1' },
  { name: 'Sample Extra 2', type: 'Type X', amount: 50, date: '2026-10-10', description: 'Description for extra 2' },
  { name: 'Sample Extra 3', type: 'Type Y', amount: 75, date: '2026-10-11', description: 'Description for extra 3' },
  { name: 'Sample Extra 4', type: 'Type Y', amount: 100, date: '2026-10-11', description: 'Description for extra 4' },
  { name: 'Sample Extra 5', type: 'Type Z', amount: 125, date: '2026-10-12', description: 'Description for extra 5' },
  { name: 'Sample Extra 6', type: 'Type Z', amount: 150, date: '2026-10-12', description: 'Description for extra 6' },
  { name: 'Sample Extra 7', type: 'Type W', amount: 175, date: '2026-10-13', description: 'Description for extra 7' },
  { name: 'Sample Extra 8', type: 'Type W', amount: 200, date: '2026-10-13', description: 'Description for extra 8' },
];

const records = [
  { user: 2, item: 0, date: '2026-10-10', quantity: 1, status: 'active', notes: 'Sample record 1' },
  { user: 2, item: 2, date: '2026-10-11', quantity: 2, status: 'active', notes: 'Sample record 2' },
  { user: 3, item: 1, date: '2026-10-10', quantity: 1, status: 'done', notes: 'Sample record 3' },
  { user: 3, item: 4, date: '2026-10-12', quantity: 3, status: 'active', notes: 'Sample record 4' },
  { user: 4, item: 6, date: '2026-10-13', quantity: 1, status: 'active', notes: 'Sample record 5' },
];

async function seed() {
  const db = await connectDb();
  const { users: U, items: I, extras: E, records: R } = config.collections;

  await db.collection(U).deleteMany({});
  await db.collection(I).deleteMany({});
  if (E) await db.collection(E).deleteMany({});
  await db.collection(R).deleteMany({});

  const userRes = await db.collection(U).insertMany(users);
  const itemRes = await db.collection(I).insertMany(items);
  if (E) await db.collection(E).insertMany(extras);

  await db.collection(R).insertMany(
    records.map(({ user, item, ...rest }) => ({
      ...rest,
      userId: String(userRes.insertedIds[user]),
      itemId: String(itemRes.insertedIds[item]),
      createdAt: new Date().toISOString(),
    }))
  );

  const targets = [U, I, E, R].filter(Boolean);
  for (const name of targets) {
    console.log(`${name}: ${await db.collection(name).countDocuments()} documents`);
  }
  console.log('Seed complete. Ready for development.');
  await closeDb();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await closeDb();
  process.exit(1);
});
