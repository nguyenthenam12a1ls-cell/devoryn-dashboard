import React from 'react';
import Layout from '../../components/Layout/Layout';
import { User, Bell, Shield, PaintBucket, Globe } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <Layout title="Settings" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Settings</span>
    </>}>
      <div className="neo-dash-layout">
        <div className="analytics-header">
          <h1 className="title-font text-gradient" style={{fontSize: 28}}>System Settings</h1>
        </div>

        <div className="settings-grid">
          {/* Settings Sidebar */}
          <div className="glass-panel settings-menu">
            <button className="settings-menu-item active">
              <User size={18}/> Profile
            </button>
            <button className="settings-menu-item">
              <PaintBucket size={18}/> Appearance
            </button>
            <button className="settings-menu-item">
              <Bell size={18}/> Notifications
            </button>
            <button className="settings-menu-item">
              <Shield size={18}/> Security
            </button>
            <button className="settings-menu-item">
              <Globe size={18}/> Language
            </button>
          </div>

          {/* Settings Content */}
          <div className="glass-panel settings-content">
            <h2 className="title-font" style={{fontSize: 20, marginBottom: 24}}>Profile Information</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="neo-input" defaultValue="Admin Pro" />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="neo-input" defaultValue="admin@devoryn.com" />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea className="neo-input" rows="4" defaultValue="Lead system administrator at Devoryn." />
              </div>

              <div style={{marginTop: 16}}>
                <button className="neo-btn">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
