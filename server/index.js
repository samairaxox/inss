const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDb } = require('./db');
const notFound = require('./middleware/notFound');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/extras', require('./routes/extras'));
app.use('/api/records', require('./routes/records'));
app.use('/api/users', require('./routes/users'));

app.use(notFound);

// Error handler (Express 5 forwards errors from async handlers here)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

connectDb().then(() => {
  app
    .listen(config.port, () => console.log(`API running at http://localhost:${config.port}/api`))
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use. Change PORT in server/.env`);
      } else {
        console.error(err);
      }
      process.exit(1);
    });
});
