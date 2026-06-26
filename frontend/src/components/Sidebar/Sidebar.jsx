import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Users, MessageSquare, BarChart2, FileText, Settings, Hexagon } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart2,       label: 'Analytics', path: '/analytics' },
  { icon: FolderOpen,      label: 'Projects',  path: '/projects' },
  { icon: Users,           label: 'Team',      path: '/team' },
  { icon: MessageSquare,   label: 'Messages',  path: '/messages' },
  { icon: FileText,        label: 'Reports',   path: '/reports' },
  { icon: Settings,        label: 'Settings',  path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="glass-panel neo-sidebar">
      <div className="neo-brand">
        <Hexagon size={28} color="var(--neon-cyan)" strokeWidth={1.5} />
        <span className="text-gradient">DEVORYN</span>
      </div>

      <nav className="neo-nav">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button 
              key={item.path} 
              className={`neo-nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="neo-icon-wrap">
                <item.icon size={18} />
              </div>
              <span className="neo-nav-label">{item.label}</span>
              {active && <div className="neo-active-glow" />}
            </button>
          );
        })}
      </nav>

      <div className="neo-sidebar-footer">
        <div className="neo-user-card glass-panel">
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="neo-avatar" />
          <div className="neo-user-text">
            <span className="neo-uname">Admin Pro</span>
            <span className="neo-uplan">Ultra Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
