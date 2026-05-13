import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.css';

export default function Layout({ children, title, subtitle, pageClass }) {
  return (
    <div className="app-shell">
      {/* Ambient background orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      <div className="app-inner glass-card">
        <Sidebar />
        <div className="main-area">
          <Header title={title} subtitle={subtitle} />
          <div className={`page-content page-enter ${pageClass || ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
