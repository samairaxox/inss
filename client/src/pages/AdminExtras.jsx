import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { EXTRA_FIELDS, EXTRA_TITLE_FIELD, LABELS } from '../config.js';
import DataTable from '../components/DataTable.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Message from '../components/Message.jsx';

export default function AdminExtras() {
  const [extras, setExtras] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadExtras() {
    setLoading(true);
    api
      .get('/extras')
      .then(setExtras)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadExtras, []);

  async function handleSave(values) {
    setSuccess('');
    if (editing) {
      await api.put(`/extras/${editing._id}`, values);
      setSuccess(`${LABELS.extra} updated.`);
    } else {
      await api.post('/extras', values);
      setSuccess(`${LABELS.extra} added.`);
    }
    setEditing(null);
    setFormKey((k) => k + 1);
    loadExtras();
  }

  async function handleDelete(extra) {
    if (!window.confirm(`Delete "${extra[EXTRA_TITLE_FIELD]}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.del(`/extras/${extra._id}`);
      setSuccess(`${LABELS.extra} deleted.`);
      loadExtras();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(extra) {
    setEditing(extra);
    setFormKey((k) => k + 1);
    setSuccess('');
    window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setEditing(null);
    setFormKey((k) => k + 1);
  }

  return (
    <section>
      <h1>{LABELS.manageExtras}</h1>
      <div className="card">
        <h2>{editing ? `Edit ${LABELS.extra}` : `Add ${LABELS.extra}`}</h2>
        <ItemForm
          key={formKey}
          idPrefix="extra"
          fields={EXTRA_FIELDS}
          initial={editing}
          onSubmit={handleSave}
          submitLabel={editing ? 'Update' : 'Add'}
          onCancel={editing ? cancelEdit : undefined}
        />
      </div>
      <Message type="success">{success}</Message>
      <Message type="error">{error}</Message>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <DataTable
          columns={EXTRA_FIELDS}
          rows={extras}
          actions={(row) => (
            <>
              <button className="btn small" onClick={() => startEdit(row)}>Edit</button>
              <button className="btn small danger" onClick={() => handleDelete(row)}>Delete</button>
            </>
          )}
        />
      )}
    </section>
  );
}
