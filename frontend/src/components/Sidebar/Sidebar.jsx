import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, FolderOpen, Users,
  FileText, MessageSquare, Settings, LogOut, Grid3X3
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart2,       label: 'Analytics',  path: '/analytics'  },
  { icon: FolderOpen,      label: 'Projects',   path: '/projects'   },
  { icon: Users,           label: 'Team',       path: '/team'       },
  { icon: FileText,        label: 'Reports',    path: '/reports'    },
  { icon: MessageSquare,   label: 'Messages',   path: '/messages'   },
  { icon: Settings,        label: 'Settings',   path: '/settings'   },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');

  return (
    <aside className="sidebar glass-card">
      {/* Logo */}
      <div className="sidebar-logo">
        <Grid3X3 size={16} className="logo-icon" />
        <span className="logo-text">
          D<span>E</span>VORYN
        </span>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(path)}
              id={`nav-${label.toLowerCase()}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="nav-item logout" onClick={handleLogout} id="nav-logout">
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
