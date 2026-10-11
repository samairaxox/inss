import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ITEM_TITLE_FIELD, LABELS, PERMISSIONS, RECORD_FIELDS } from '../config.js';
import DataTable from '../components/DataTable.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Message from '../components/Message.jsx';

// User: view, edit (reschedule) and cancel own records
export default function MyRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadRecords() {
    setLoading(true);
    api
      .get(`/records?userId=${user._id}`)
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadRecords, [user._id]);

  async function handleSave(values) {
    await api.put(`/records/${editing._id}`, values);
    setSuccess(`${LABELS.record} updated.`);
    setEditing(null);
    loadRecords();
  }

  async function handleCancel(record) {
    if (!window.confirm(`${LABELS.cancelRecord} this ${LABELS.record.toLowerCase()}?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.del(`/records/${record._id}`);
      setSuccess(`${LABELS.record} cancelled.`);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    { name: 'item', label: LABELS.item, render: (r) => r.item?.[ITEM_TITLE_FIELD] ?? '(deleted)' },
    ...RECORD_FIELDS,
  ];

  return (
    <section>
      <h1>{LABELS.myRecords}</h1>
      {editing && (
        <div className="card">
          <h2>Edit {LABELS.record}: {editing.item?.[ITEM_TITLE_FIELD]}</h2>
          <ItemForm
            key={editing._id}
            idPrefix="myrecord"
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
          emptyText={`You have no ${LABELS.records.toLowerCase()} yet.`}
          actions={PERMISSIONS.userCanEditRecords ? (row) => (
            <>
              <button className="btn small" onClick={() => { setEditing(row); setSuccess(''); }}>Edit</button>
              <button className="btn small danger" onClick={() => handleCancel(row)}>{LABELS.cancelRecord}</button>
            </>
          ) : undefined}
        />
      )}
    </section>
  );
}
