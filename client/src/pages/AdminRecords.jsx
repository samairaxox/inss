import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { ITEM_TITLE_FIELD, LABELS, RECORD_FIELDS } from '../config.js';
import DataTable from '../components/DataTable.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Message from '../components/Message.jsx';

// Admin: all records (schedule) with a date filter; edit or delete any record
export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadRecords() {
    setLoading(true);
    setError('');
    api
      .get(`/records${date ? `?date=${date}` : ''}`)
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadRecords, [date]);

  async function handleSave(values) {
    await api.put(`/records/${editing._id}`, values);
    setSuccess(`${LABELS.record} updated.`);
    setEditing(null);
    loadRecords();
  }

  async function handleDelete(record) {
    if (!window.confirm(`Delete this ${LABELS.record.toLowerCase()}?`)) return;
    setSuccess('');
    try {
      await api.del(`/records/${record._id}`);
      setSuccess(`${LABELS.record} deleted.`);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    { name: 'item', label: LABELS.item, render: (r) => r.item?.[ITEM_TITLE_FIELD] ?? '(deleted)' },
    { name: 'user', label: LABELS.user, render: (r) => r.user?.name ?? '(unknown)' },
    ...RECORD_FIELDS,
  ];

  return (
    <section>
      <h1>{LABELS.allRecords}</h1>
      <div className="toolbar">
        <label className="inline">
          Filter by date: <input id="record-date-filter" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        {date && <button className="btn" onClick={() => setDate('')}>Show all</button>}
      </div>
      {editing && (
        <div className="card">
          <h2>Edit {LABELS.record}: {editing.item?.[ITEM_TITLE_FIELD]} ({editing.user?.name})</h2>
          <ItemForm
            key={editing._id}
            idPrefix="adminrecord"
            fields={RECORD_FIELDS}
            initial={editing}
            onSubmit={handleSave}
            submitLabel="Update"
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
      <Message type="success">{success}</Message>
      <Message type="error">{error}</Message>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          rows={records}
          actions={(row) => (
            <>
              <button className="btn small" onClick={() => { setEditing(row); setSuccess(''); }}>Edit</button>
              <button className="btn small danger" onClick={() => handleDelete(row)}>Delete</button>
            </>
          )}
        />
      )}
    </section>
  );
}
