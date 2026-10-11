import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { LABELS, ENTITIES } from '../config.js';
import Message from '../components/Message.jsx';

// Reusable dashboard showing summary statistics across configured entities
export default function Dashboard() {
  const [stats, setStats] = useState({
    items: null,
    extras: null,
    records: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/items/stats').catch(() => null),
      api.get('/extras/stats').catch(() => null),
      api.get('/records/stats').catch(() => null),
    ])
      .then(([items, extras, records]) => {
        setStats({ items, extras, records });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1>{LABELS.dashboard}</h1>
      <Message type="error">{error}</Message>

      {loading ? (
        <p className="muted">Loading dashboard statistics...</p>
      ) : (
        <div className="stats-grid">
          {stats.items && (
            <div className="card stat-card">
              <h3>{LABELS.items}</h3>
              <div className="stat-number">{stats.items.count}</div>
              <p className="muted">Total {LABELS.items}</p>
              {stats.items.numericField && (
                <div className="stat-details">
                  <span>Total {stats.items.numericField}: <strong>{stats.items.sum}</strong></span>
                  <span>Avg {stats.items.numericField}: <strong>{stats.items.avg}</strong></span>
                </div>
              )}
              <div className="stat-actions">
                <Link className="btn small" to="/items">Browse {LABELS.items}</Link>
              </div>
            </div>
          )}

          {stats.extras && (
            <div className="card stat-card">
              <h3>{LABELS.extras}</h3>
              <div className="stat-number">{stats.extras.count}</div>
              <p className="muted">Total {LABELS.extras}</p>
              {stats.extras.numericField && (
                <div className="stat-details">
                  <span>Total {stats.extras.numericField}: <strong>{stats.extras.sum}</strong></span>
                  <span>Avg {stats.extras.numericField}: <strong>{stats.extras.avg}</strong></span>
                </div>
              )}
              <div className="stat-actions">
                <Link className="btn small" to="/extras">Browse {LABELS.extras}</Link>
              </div>
            </div>
          )}

          {stats.records && (
            <div className="card stat-card">
              <h3>{LABELS.records}</h3>
              <div className="stat-number">{stats.records.count}</div>
              <p className="muted">Total {LABELS.records}</p>
              {stats.records.numericField && (
                <div className="stat-details">
                  <span>Total {stats.records.numericField}: <strong>{stats.records.sum}</strong></span>
                  <span>Avg {stats.records.numericField}: <strong>{stats.records.avg}</strong></span>
                </div>
              )}
              <div className="stat-actions">
                <Link className="btn small" to="/admin/records">View {LABELS.allRecords}</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
