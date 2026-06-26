import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import './Messages.css';

const contacts = [
  { name: 'Sarah Connor', msg: 'The new designs look great!', time: '10:42 AM', active: true },
  { name: 'John Doe', msg: 'Can we sync at 3?', time: 'Yesterday', active: false },
  { name: 'Emma Watson', msg: 'I sent the files over.', time: 'Monday', active: false },
];

export default function Messages() {
  return (
    <Layout title="Messages" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Messages</span>
    </>}>
      <div className="neo-dash-layout" style={{ height: 'calc(100vh - 160px)' }}>
        
        <div className="messages-container glass-panel">
          <div className="messages-sidebar">
            <div className="messages-header">
              <h2 className="title-font" style={{fontSize: 20}}>Chats</h2>
            </div>
            <div className="contact-list">
              {contacts.map((c, i) => (
                <div key={i} className={`contact-item ${c.active ? 'active' : ''}`}>
                  <div className="contact-avatar">{c.name.charAt(0)}</div>
                  <div className="contact-info">
                    <div className="contact-top">
                      <span className="contact-name">{c.name}</span>
                      <span className="contact-time">{c.time}</span>
                    </div>
                    <span className="contact-msg">{c.msg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="messages-main">
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="contact-avatar">S</div>
                <div>
                  <h3 className="title-font" style={{fontSize: 18}}>Sarah Connor</h3>
                  <span style={{fontSize: 12, color: 'var(--neon-cyan)'}}>Online</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-btn"><Phone size={18}/></button>
                <button className="icon-btn"><Video size={18}/></button>
                <button className="icon-btn"><MoreVertical size={18}/></button>
              </div>
            </div>
            
            <div className="chat-history">
              <div className="chat-bubble theirs">
                Hey! Did you check the new Neo-Premium layout?
              </div>
              <div className="chat-bubble mine">
                Yes, it looks absolutely stunning! The glow effects are perfect.
              </div>
            </div>
            
            <div className="chat-input-area">
              <input type="text" placeholder="Type a message..." className="chat-input" />
              <button className="neo-btn" style={{padding: '10px'}}><Send size={18}/></button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
