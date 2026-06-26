import React from 'react';
import Layout from '../../components/Layout/Layout';
import { FileText, Download, Filter } from 'lucide-react';

const reports = [
  { name: 'Monthly Financials - Q3', date: 'Oct 1, 2024', size: '2.4 MB' },
  { name: 'User Growth & Retention', date: 'Sep 28, 2024', size: '1.8 MB' },
  { name: 'Server Performance Log', date: 'Sep 15, 2024', size: '4.2 MB' },
  { name: 'Marketing Campaign ROI', date: 'Sep 10, 2024', size: '3.1 MB' },
];

export default function Reports() {
  return (
    <Layout title="Reports" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Reports</span>
    </>}>
      <div className="neo-dash-layout">
        <div className="analytics-header">
          <h1 className="title-font text-gradient" style={{fontSize: 28}}>Generated Reports</h1>
          <button className="neo-btn" style={{background: 'linear-gradient(135deg, var(--neon-cyan), #00b8ff)'}}><Filter size={16}/> Filter</button>
        </div>

        <div className="glass-panel neo-table-card">
          <table className="neo-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Date Generated</th>
                <th style={{textAlign: 'right'}}>Size</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i}>
                  <td style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <div className="project-icon" style={{background: 'rgba(255,255,255,0.05)', color: 'var(--neon-purple)', width: 36, height: 36}}>
                      <FileText size={18} />
                    </div>
                    <span style={{fontWeight: 600}}>{r.name}</span>
                  </td>
                  <td style={{color: 'var(--text-dim)'}}>{r.date}</td>
                  <td style={{textAlign: 'right', color: 'var(--text-dim)'}}>{r.size}</td>
                  <td style={{textAlign: 'right'}}>
                    <button className="icon-btn" style={{color: 'var(--neon-cyan)'}}><Download size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
