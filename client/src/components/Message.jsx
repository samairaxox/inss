// <Message type="error|success|info">text</Message>  - renders nothing if empty
export default function Message({ type = 'info', children }) {
  if (!children) return null;
  return <div className={`message ${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}
