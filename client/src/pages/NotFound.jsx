import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="card narrow">
      <h1>404 - Page not found</h1>
      <p><Link to="/">Go to home</Link></p>
    </section>
  );
}
