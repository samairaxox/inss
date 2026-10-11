import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { EXTRA_FIELDS, LABELS } from '../config.js';
import DataTable from '../components/DataTable.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Message from '../components/Message.jsx';

export default function ExtraList() {
  const [extras, setExtras] = useState([]);
  const [q, setQ] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (date) params.set('date', date);

    setLoading(true);
    setError('');
    api
      .get(`/extras?${params}`)
      .then(setExtras)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [q, date]);

  return (
    <section>
      <h1>{LABELS.extras}</h1>
      <div className="toolbar">
        <SearchBar onSearch={setQ} placeholder={`Search ${LABELS.extras.toLowerCase()}...`} />
        <label className="inline">
          Date: <input id="extra-date-filter" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <Message type="error">{error}</Message>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <DataTable
          columns={EXTRA_FIELDS}
          rows={extras}
        />
      )}
    </section>
  );
}
