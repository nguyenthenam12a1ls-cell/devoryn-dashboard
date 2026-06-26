import { Bell, Search, Settings } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="glass-panel neo-header">
      <div className="neo-header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search anything..." className="neo-search-input" />
        <div className="search-shortcut">⌘K</div>
      </div>
      
      <div className="neo-header-actions">
        <button className="neo-icon-btn">
          <Settings size={20} />
        </button>
        <button className="neo-icon-btn active-notif">
          <Bell size={20} />
          <span className="neo-badge" />
        </button>
      </div>
    </header>
  );
}
