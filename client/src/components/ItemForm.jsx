import { useState } from 'react';
import Message from './Message.jsx';

// Generic controlled form generated from field definitions (see config.js).
// Used for items AND records.
//   fields:   field definitions
//   initial:  starting values (e.g. the item being edited)
//   onSubmit: async (values) => {}  - throw an Error to show it in the form
//   resetOnSubmit: clear the form after a successful submit
// Tip: give it a `key` prop that changes when you switch which record you edit.
function startValues(fields, initial) {
  const values = {};
  fields.forEach((f) => {
    values[f.name] = initial?.[f.name] ?? f.default ?? '';
  });
  return values;
}

function validate(fields, values) {
  const errors = {};
  fields.forEach((f) => {
    const v = String(values[f.name] ?? '').trim();
    if (f.required && v === '') errors[f.name] = `${f.label} is required`;
    else if (v !== '' && f.type === 'number' && isNaN(Number(v))) errors[f.name] = `${f.label} must be a number`;
    else if (v !== '' && f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) errors[f.name] = `${f.label} must be a valid email`;
  });
  return errors;
}

export default function ItemForm({ fields, initial, onSubmit, submitLabel = 'Save', onCancel, resetOnSubmit, idPrefix = 'form' }) {
  const [values, setValues] = useState(() => startValues(fields, initial));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Convert number fields from text to numbers
    const out = { ...values };
    fields.forEach((f) => {
      if (f.type === 'number' && out[f.name] !== '') out[f.name] = Number(out[f.name]);
    });

    setSaving(true);
    setServerError('');
    try {
      await onSubmit(out);
      if (resetOnSubmit) setValues(startValues(fields));
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {fields.map((f) => {
        const id = `${idPrefix}-${f.name}`;
        const common = { id, name: f.name, value: values[f.name], onChange: handleChange };
        return (
          <div className="field" key={f.name}>
            <label htmlFor={id}>
              {f.label} {f.required && <span className="req">*</span>}
            </label>
            {f.type === 'textarea' ? (
              <textarea rows={3} {...common} />
            ) : f.type === 'select' ? (
              <select {...common}>
                <option value="">-- select --</option>
                {(f.options || []).map((o) => {
                  const opt = typeof o === 'object' ? o : { value: o, label: o };
                  return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                })}
              </select>
            ) : (
              <input type={f.type || 'text'} step={f.type === 'number' ? 'any' : undefined} {...common} />
            )}
            {errors[f.name] && <small className="error-text">{errors[f.name]}</small>}
          </div>
        );
      })}
      <Message type="error">{serverError}</Message>
      <div className="form-buttons">
        <button id={`${idPrefix}-submit`} className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel edit</button>}
      </div>
    </form>
  );
}
