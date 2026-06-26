import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.css';

export default function Layout({ children, title, breadcrumbs }) {
  return (
    <div className="neo-layout">
      <div className="mesh-background" />
      <div className="floating-sidebar-wrap">
        <Sidebar />
      </div>
      <div className="floating-main-wrap">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <div className="neo-content-scroll">
          <div className="neo-content-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
