import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Folder, MoreVertical, Plus } from 'lucide-react';
import './Projects.css';

const projects = [
  { name: 'Website Redesign', status: 'In Progress', progress: 75, color: 'var(--neon-purple)' },
  { name: 'Mobile App V2', status: 'Planning', progress: 15, color: 'var(--neon-cyan)' },
  { name: 'Marketing Campaign', status: 'Completed', progress: 100, color: '#10B981' },
  { name: 'API Integration', status: 'In Progress', progress: 45, color: 'var(--neon-pink)' },
];

export default function Projects() {
  return (
    <Layout title="Projects" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Projects</span>
    </>}>
      <div className="neo-dash-layout">
        <div className="analytics-header">
          <h1 className="title-font text-gradient" style={{fontSize: 28}}>All Projects</h1>
          <button className="neo-btn"><Plus size={16}/> New Project</button>
        </div>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={i} className="glass-panel project-card">
              <div className="project-header">
                <div className="project-icon" style={{background: `color-mix(in srgb, ${p.color} 20%, transparent)`, color: p.color, border: `1px solid ${p.color}`}}>
                  <Folder size={20} />
                </div>
                <button className="icon-btn"><MoreVertical size={16}/></button>
              </div>
              <h3 className="title-font" style={{fontSize: 18, marginTop: 16}}>{p.name}</h3>
              <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 16}}>{p.status}</p>
              <div className="project-progress">
                <div className="progress-info">
                  <span style={{fontSize: 12}}>Progress</span>
                  <span style={{fontSize: 12, fontWeight: 600}}>{p.progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{width: `${p.progress}%`, background: p.color, boxShadow: `0 0 10px ${p.color}`}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
