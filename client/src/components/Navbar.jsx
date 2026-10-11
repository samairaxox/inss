import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { APP_TITLE, AUTH_ENABLED, ADMIN_ROLE, DEFAULT_ROLE, ENTITIES, LABELS } from '../config.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // When auth is disabled, everything is publicly accessible
  if (!AUTH_ENABLED) {
    return (
      <header className="navbar">
        <Link to="/" className="brand">{APP_TITLE}</Link>
        <nav>
          <NavLink to="/" end>{LABELS.dashboard}</NavLink>
          {ENTITIES.map((ent) => (
            <NavLink key={ent.key} to={ent.apiPath}>{ent.label}</NavLink>
          ))}
          {ENTITIES.map((ent) => (
            <NavLink key={`admin-${ent.key}`} to={ent.adminPath}>Manage {ent.label}</NavLink>
          ))}
          <NavLink to="/admin/records">{LABELS.allRecords}</NavLink>
        </nav>
      </header>
    );
  }

  const isAdmin = user?.role === ADMIN_ROLE;

  return (
    <header className="navbar">
      <Link to="/" className="brand">{APP_TITLE}</Link>
      {user ? (
        <nav>
          <NavLink to="/" end>{LABELS.dashboard}</NavLink>
          {ENTITIES.map((ent) => (
            <NavLink key={ent.key} to={ent.apiPath}>{ent.label}</NavLink>
          ))}
          {!isAdmin && <NavLink to="/my-records">{LABELS.myRecords}</NavLink>}
          {isAdmin && (
            <>
              {ENTITIES.map((ent) => (
                <NavLink key={`admin-${ent.key}`} to={ent.adminPath}>Manage {ent.label}</NavLink>
              ))}
              <NavLink to="/admin/records">{LABELS.allRecords}</NavLink>
            </>
          )}
          <span className="who">{user.name} ({user.role})</span>
          <button id="logout-btn" className="btn small" onClick={handleLogout}>Logout</button>
        </nav>
      ) : (
        <nav>
          <NavLink to="/login">Login</NavLink>
        </nav>
      )}
    </header>
  );
}
