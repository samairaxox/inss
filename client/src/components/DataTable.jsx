// Generic table.
// columns: [{ name, label, render?(row) }]  (field definitions from config.js work directly)
// actions: optional (row) => JSX for the last column
export default function DataTable({ columns, rows, actions, emptyText = 'No data found.' }) {
  const visible = columns.filter((c) => !c.hideInTable);

  if (!rows.length) return <p className="muted">{emptyText}</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {visible.map((c) => <th key={c.name}>{c.label}</th>)}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {visible.map((c) => (
                <td key={c.name}>{c.render ? c.render(row) : String(row[c.name] ?? '')}</td>
              ))}
              {actions && <td className="actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
