import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { ITEM_FIELDS, ITEM_TITLE_FIELD, LABELS } from '../config.js';
import DataTable from '../components/DataTable.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Message from '../components/Message.jsx';

// Admin: add, edit and delete items
export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // item being edited, or null when adding
  const [formKey, setFormKey] = useState(0); // changing the key resets the form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function loadItems() {
    setLoading(true);
    api
      .get('/items')
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadItems, []);

  async function handleSave(values) {
    setSuccess('');
    if (editing) {
      await api.put(`/items/${editing._id}`, values);
      setSuccess(`${LABELS.item} updated.`);
    } else {
      await api.post('/items', values);
      setSuccess(`${LABELS.item} added.`);
    }
    setEditing(null);
    setFormKey((k) => k + 1);
    loadItems();
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item[ITEM_TITLE_FIELD]}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.del(`/items/${item._id}`);
      setSuccess(`${LABELS.item} deleted.`);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(item) {
    setEditing(item);
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
      <h1>{LABELS.manageItems}</h1>
      <div className="card">
        <h2>{editing ? `Edit ${LABELS.item}` : `Add ${LABELS.item}`}</h2>
        <ItemForm
          key={formKey}
          idPrefix="item"
          fields={ITEM_FIELDS}
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
          columns={ITEM_FIELDS}
          rows={items}
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
