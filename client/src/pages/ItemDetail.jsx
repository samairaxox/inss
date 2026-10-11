import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ITEM_FIELDS, ITEM_TITLE_FIELD, LABELS, PERMISSIONS, RECORD_FIELDS, ROLES } from '../config.js';
import ItemForm from '../components/ItemForm.jsx';
import Message from '../components/Message.jsx';

// Shows one item + a form to create a record for it (buy / book / add report).
// Admins also pick which user the record is for.
export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user.role === ROLES.admin;
  const [item, setItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const requests = [api.get(`/items/${id}`), isAdmin ? api.get(`/users?role=${ROLES.user}`) : []];
    Promise.all(requests)
      .then(([itemData, userData]) => {
        setItem(itemData);
        setUsers(userData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  // Admin chooses the user; normal users always create for themselves
  const recordFields = isAdmin
    ? [{ name: 'userId', label: LABELS.user, type: 'select', required: true, options: users.map((u) => ({ value: u._id, label: u.name })) }, ...RECORD_FIELDS]
    : RECORD_FIELDS;

  async function handleCreate(values) {
    setSuccess('');
    await api.post('/records', { ...values, itemId: id });
    setSuccess(`${LABELS.record} created.`);
  }

  if (loading) return <p className="muted">Loading...</p>;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <section>
      <p><Link to="/">&larr; Back to {LABELS.items}</Link></p>
      <div className="card">
        <h1>{item[ITEM_TITLE_FIELD]}</h1>
        <dl className="details">
          {ITEM_FIELDS.map((f) => (
            <div key={f.name}>
              <dt>{f.label}</dt>
              <dd>{String(item[f.name] ?? '-')}</dd>
            </div>
          ))}
        </dl>
      </div>

      {(isAdmin || PERMISSIONS.userCanCreateRecords) && (
        <div className="card">
          <h2>{LABELS.createRecord}</h2>
          <Message type="success">
            {success && (
              <>
                {success}{' '}
                {isAdmin ? <Link to="/admin/records">View {LABELS.allRecords}</Link> : <Link to="/my-records">View {LABELS.myRecords}</Link>}
              </>
            )}
          </Message>
          <ItemForm
            idPrefix="record"
            fields={recordFields}
            initial={{}}
            onSubmit={handleCreate}
            submitLabel={LABELS.createRecord}
            resetOnSubmit
          />
        </div>
      )}
    </section>
  );
}
