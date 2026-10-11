import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { APP_TITLE, ROLES, ADMIN_ROLE } from './config.js';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ItemList from './pages/ItemList.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import ExtraList from './pages/ExtraList.jsx';
import AdminItems from './pages/AdminItems.jsx';
import AdminExtras from './pages/AdminExtras.jsx';
import MyRecords from './pages/MyRecords.jsx';
import AdminRecords from './pages/AdminRecords.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute roles={ROLES}><Dashboard /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute roles={ROLES}><ItemList /></ProtectedRoute>} />
            <Route path="/items/:id" element={<ProtectedRoute roles={ROLES}><ItemDetail /></ProtectedRoute>} />
            <Route path="/extras" element={<ProtectedRoute roles={ROLES}><ExtraList /></ProtectedRoute>} />
            <Route path="/my-records" element={<ProtectedRoute roles={ROLES.filter((r) => r !== ADMIN_ROLE)}><MyRecords /></ProtectedRoute>} />
            <Route path="/admin/items" element={<ProtectedRoute roles={[ADMIN_ROLE]}><AdminItems /></ProtectedRoute>} />
            <Route path="/admin/extras" element={<ProtectedRoute roles={[ADMIN_ROLE]}><AdminExtras /></ProtectedRoute>} />
            <Route path="/admin/records" element={<ProtectedRoute roles={[ADMIN_ROLE]}><AdminRecords /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
