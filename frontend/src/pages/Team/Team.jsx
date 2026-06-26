import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Mail, Phone, MoreHorizontal, UserPlus } from 'lucide-react';
import './Team.css';

const team = [
  { name: 'Sarah Connor', role: 'Product Manager', img: 'https://i.pravatar.cc/150?u=sarah' },
  { name: 'John Doe', role: 'Lead Developer', img: 'https://i.pravatar.cc/150?u=john' },
  { name: 'Emma Watson', role: 'UX Designer', img: 'https://i.pravatar.cc/150?u=emma' },
  { name: 'Michael Smith', role: 'Marketing', img: 'https://i.pravatar.cc/150?u=michael' },
  { name: 'Olivia Davis', role: 'Sales Exec', img: 'https://i.pravatar.cc/150?u=olivia' },
];

export default function Team() {
  return (
    <Layout title="Team" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Team Directory</span>
    </>}>
      <div className="neo-dash-layout">
        <div className="analytics-header">
          <h1 className="title-font text-gradient" style={{fontSize: 28}}>Team Directory</h1>
          <button className="neo-btn"><UserPlus size={16}/> Add Member</button>
        </div>

        <div className="team-grid">
          {team.map((m, i) => (
            <div key={i} className="glass-panel team-card">
              <button className="icon-btn absolute-more"><MoreHorizontal size={16}/></button>
              <div className="team-avatar-wrap">
                <img src={m.img} alt={m.name} className="team-avatar" />
              </div>
              <h3 className="title-font" style={{fontSize: 18, marginTop: 12, textAlign: 'center'}}>{m.name}</h3>
              <p style={{color: 'var(--neon-cyan)', fontSize: 13, marginBottom: 20, textAlign: 'center'}}>{m.role}</p>
              
              <div className="team-actions">
                <button className="team-action-btn"><Mail size={16}/></button>
                <button className="team-action-btn"><Phone size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
