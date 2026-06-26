import React from 'react';
import Layout from '../../components/Layout/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Filter, Download } from 'lucide-react';
import './Analytics.css';

const data = [
  { name: 'Mon', visits: 4000, bounce: 2400 },
  { name: 'Tue', visits: 3000, bounce: 1398 },
  { name: 'Wed', visits: 2000, bounce: 9800 },
  { name: 'Thu', visits: 2780, bounce: 3908 },
  { name: 'Fri', visits: 1890, bounce: 4800 },
  { name: 'Sat', visits: 2390, bounce: 3800 },
  { name: 'Sun', visits: 3490, bounce: 4300 },
];

export default function Analytics() {
  return (
    <Layout title="Analytics" breadcrumbs={<>
      <span className="bc-item">Dashboard</span><span className="bc-sep">/</span><span className="bc-item active">Analytics</span>
    </>}>
      <div className="neo-dash-layout">
        <div className="analytics-header">
          <h1 className="title-font text-gradient" style={{fontSize: 28}}>Audience Overview</h1>
          <div className="analytics-actions">
            <button className="neo-btn"><Filter size={16}/> Filter</button>
            <button className="neo-btn"><Download size={16}/> Export</button>
          </div>
        </div>

        <div className="glass-panel neo-chart-main">
          <h2 className="title-font" style={{fontSize: 20, marginBottom: 20}}>Visits vs Bounce Rate</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" tick={{fill: 'var(--text-dim)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-dim)" tick={{fill: 'var(--text-dim)'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: 8}}
                  itemStyle={{color: 'white'}}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="visits" fill="var(--neon-cyan)" radius={[4,4,0,0]} maxBarSize={40} />
                <Bar dataKey="bounce" fill="var(--neon-pink)" radius={[4,4,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="analytics-grid">
          <div className="glass-panel neo-table-card">
            <h2 className="title-font" style={{fontSize: 20, marginBottom: 16}}>Top Pages</h2>
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Page URL</th>
                  <th style={{textAlign: 'right'}}>Views</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>/home</td><td style={{textAlign: 'right'}}>12,450</td></tr>
                <tr><td>/pricing</td><td style={{textAlign: 'right'}}>8,210</td></tr>
                <tr><td>/about</td><td style={{textAlign: 'right'}}>4,100</td></tr>
              </tbody>
            </table>
          </div>

          <div className="glass-panel neo-table-card">
            <h2 className="title-font" style={{fontSize: 20, marginBottom: 16}}>Device Split</h2>
            <div className="device-stats">
              <div className="device-stat">
                <span className="text-gradient" style={{fontSize: 32}}>68%</span>
                <span style={{color: 'var(--text-dim)'}}>Mobile</span>
              </div>
              <div className="device-stat">
                <span className="text-gradient-neon" style={{fontSize: 32}}>32%</span>
                <span style={{color: 'var(--text-dim)'}}>Desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
