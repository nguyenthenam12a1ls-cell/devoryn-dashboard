import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login        from './pages/Login/Login';
import Dashboard   from './pages/Dashboard/Dashboard';
import Analytics   from './pages/Analytics/Analytics';
import Projects    from './pages/Projects/Projects';
import Team        from './pages/Team/Team';
import Reports     from './pages/Reports/Reports';
import Messages    from './pages/Messages/Messages';
import SettingsPage from './pages/Settings/SettingsPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Login />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/analytics"  element={<Analytics />} />
        <Route path="/projects"   element={<Projects />} />
        <Route path="/team"       element={<Team />} />
        <Route path="/reports"    element={<Reports />} />
        <Route path="/messages"   element={<Messages />} />
        <Route path="/settings"   element={<SettingsPage />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
