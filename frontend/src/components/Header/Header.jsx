import { Bell, ChevronDown, Moon, Sun, Settings, LogOut, User, CheckCircle2, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ title, subtitle }) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  
  const notifRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    document.body.classList.toggle('light-theme', !dark);
  }, [dark]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-header">
      <div className="header-title">
        <h1 className="greeting">{title || 'Hi, Devoryn! 👋'}</h1>
        <p className="subtitle">{subtitle || 'Welcome to your Workspace'}</p>
      </div>

      <div className="header-right">
        <div className="header-dropdown-wrap" ref={notifRef}>
          <button 
            className={`icon-btn ${showNotif?'active':''}`} 
            id="btn-notifications" 
            onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
          >
            <Bell size={18} />
            <span className="notif-dot" />
          </button>
          
          {showNotif && (
            <div className="header-dropdown notif-dropdown">
              <div className="hd-head">
                <span className="hd-title">Notifications</span>
                <span className="hd-action">Mark all read</span>
              </div>
              <div className="notif-list">
                <div className="notif-item unread">
                  <div className="notif-icon" style={{background:'rgba(0,229,255,0.1)', color:'#00e5ff'}}><MessageSquare size={12}/></div>
                  <div className="notif-content">
                    <p className="notif-text"><strong>Anna</strong> mentioned you in <em>Nebula CRM</em></p>
                    <span className="notif-time">2m ago</span>
                  </div>
                  <div className="unread-dot"/>
                </div>
                <div className="notif-item">
                  <div className="notif-icon" style={{background:'rgba(34,211,153,0.1)', color:'#34d399'}}><CheckCircle2 size={12}/></div>
                  <div className="notif-content">
                    <p className="notif-text">Project <strong>Orion App</strong> was marked completed</p>
                    <span className="notif-time">1h ago</span>
                  </div>
                </div>
              </div>
              <button className="hd-footer-btn" onClick={() => navigate('/messages')}>View All Messages</button>
            </div>
          )}
        </div>

        <div className="theme-toggle">
          <button
            className={`theme-btn ${!dark ? 'active' : ''}`}
            onClick={() => setDark(false)}
            id="btn-light-mode"
          >
            <Sun size={14} />
          </button>
          <button
            className={`theme-btn ${dark ? 'active' : ''}`}
            onClick={() => setDark(true)}
            id="btn-dark-mode"
          >
            <Moon size={14} />
          </button>
        </div>

        <div className="header-dropdown-wrap" ref={userRef}>
          <div 
            className={`user-badge ${showUser?'active':''}`} 
            id="user-badge" 
            onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
          >
            <div className="user-avatar">D</div>
            <div className="user-info">
              <span className="user-name">Devoryn</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown size={14} className={`chevron ${showUser?'open':''}`} />
          </div>

          {showUser && (
            <div className="header-dropdown user-dropdown">
              <div className="user-drop-head">
                <div className="user-avatar lg">D</div>
                <div className="user-info">
                  <span className="user-name" style={{fontSize:14}}>Devoryn</span>
                  <span className="user-role">admin@devoryn.com</span>
                </div>
              </div>
              <div className="user-drop-menu">
                <button className="user-drop-item" onClick={() => { setShowUser(false); navigate('/settings'); }}>
                  <User size={14} /> Profile Settings
                </button>
                <button className="user-drop-item" onClick={() => { setShowUser(false); navigate('/settings'); }}>
                  <Settings size={14} /> Workspace Preferences
                </button>
                <div className="user-drop-sep" />
                <button className="user-drop-item danger" onClick={() => navigate('/login')}>
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
