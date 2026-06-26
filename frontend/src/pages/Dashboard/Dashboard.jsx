import React from 'react';
import Layout from '../../components/Layout/Layout';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Zap, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

const chartData = [
  { name: 'Mon', rev: 12000, users: 800 },
  { name: 'Tue', rev: 18000, users: 1100 },
  { name: 'Wed', rev: 16000, users: 950 },
  { name: 'Thu', rev: 24000, users: 1500 },
  { name: 'Fri', rev: 28000, users: 1800 },
  { name: 'Sat', rev: 22000, users: 1600 },
  { name: 'Sun', rev: 32000, users: 2100 }
];

const donutData = [
  { name: 'Premium', value: 65, color: '#ff2a85' },
  { name: 'Standard', value: 25, color: '#00f0ff' },
  { name: 'Basic', value: 10, color: '#9b4dff' },
];

const transData = [
  { id: '#TRX-001', to: 'Samantha W.', date: 'Oct 24, 2024', amt: '+$4,250.00', stat: 'Completed' },
  { id: '#TRX-002', to: 'David P.', date: 'Oct 24, 2024', amt: '-$120.00', stat: 'Pending' },
  { id: '#TRX-003', to: 'Netflix Inc.', date: 'Oct 23, 2024', amt: '-$19.99', stat: 'Completed' },
  { id: '#TRX-004', to: 'Upwork', date: 'Oct 22, 2024', amt: '+$8,400.00', stat: 'Completed' },
];

function NeoTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="neo-tooltip glass-panel">
        <p className="tooltip-val" style={{color: payload[0].color}}>${payload[0].value.toLocaleString()}</p>
        {payload[1] && <p className="tooltip-val-2" style={{color: payload[1].color}}>{payload[1].value.toLocaleString()} Users</p>}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  return (
    <Layout>
      <div className="neo-dash-layout">
        
        {/* KPI Row */}
        <div className="neo-kpi-row">
          <div className="glass-panel neo-kpi-card">
            <div className="kpi-icon-glow pink">
              <Zap size={24} />
            </div>
            <span className="neo-kpi-label">Total Balance</span>
            <span className="text-gradient-neon" style={{fontSize: '36px', lineHeight: 1}}>$124,500</span>
            <div className="neo-kpi-bottom">
              <span className="neo-badge-trend positive"><ArrowUpRight size={14}/> +12.5%</span>
              <span className="neo-hint">vs last month</span>
            </div>
          </div>
          
          <div className="glass-panel neo-kpi-card">
            <div className="kpi-icon-glow cyan">
              <Activity size={24} />
            </div>
            <span className="neo-kpi-label">Active Users</span>
            <span className="text-gradient" style={{fontSize: '36px', lineHeight: 1}}>48.2K</span>
            <div className="neo-kpi-bottom">
              <span className="neo-badge-trend positive"><ArrowUpRight size={14}/> +5.2%</span>
              <span className="neo-hint">vs last month</span>
            </div>
          </div>
          
          <div className="glass-panel neo-kpi-card">
            <div className="kpi-icon-glow purple">
              <ShieldCheck size={24} />
            </div>
            <span className="neo-kpi-label">Avg. Conversion</span>
            <span className="text-gradient" style={{fontSize: '36px', lineHeight: 1}}>3.8%</span>
            <div className="neo-kpi-bottom">
              <span className="neo-badge-trend negative"><ArrowDownRight size={14}/> -0.4%</span>
              <span className="neo-hint">vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="neo-charts-row">
          <div className="glass-panel neo-chart-main">
            <div className="neo-card-head">
              <h2 className="title-font" style={{fontSize: 22}}>Revenue Flow</h2>
              <button className="neo-btn">Download Report</button>
            </div>
            <div className="neo-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{top:20, right:20, left:0, bottom:0}}>
                  <defs>
                    <linearGradient id="glowPink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2a85" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ff2a85" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="glowCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<NeoTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="rev" stroke="#ff2a85" strokeWidth={4} fillOpacity={1} fill="url(#glowPink)" style={{filter: 'drop-shadow(0 0 10px rgba(255,42,133,0.5))'}} />
                  <Area type="monotone" dataKey="users" stroke="#00f0ff" strokeWidth={4} fillOpacity={1} fill="url(#glowCyan)" style={{filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.5))'}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel neo-chart-side">
            <h2 className="title-font" style={{fontSize: 20, marginBottom: 20}}>Subscription Tiers</h2>
            <div className="neo-donut-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                    {donutData.map((e,i)=><Cell key={i} fill={e.color} style={{filter: `drop-shadow(0 0 10px ${e.color})`}}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="neo-donut-center">
                <span className="title-font" style={{fontSize:28, fontWeight:700}}>100%</span>
              </div>
            </div>
            <div className="neo-donut-legend">
              {donutData.map((d,i)=>(
                <div key={i} className="neo-legend-item">
                  <div className="neo-legend-color" style={{background: d.color, boxShadow:`0 0 10px ${d.color}`}} />
                  <span style={{flex:1}}>{d.name}</span>
                  <span className="title-font" style={{fontWeight:700}}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-panel neo-table-card">
          <div className="neo-card-head" style={{marginBottom: 20}}>
            <h2 className="title-font" style={{fontSize: 22}}>Recent Activity</h2>
          </div>
          <table className="neo-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Sent To</th>
                <th>Date</th>
                <th style={{textAlign:'right'}}>Amount</th>
                <th style={{textAlign:'right'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transData.map((t,i)=>(
                <tr key={i}>
                  <td style={{color: 'var(--text-dim)'}}>{t.id}</td>
                  <td style={{fontWeight: 600}}>{t.to}</td>
                  <td style={{color: 'var(--text-dim)'}}>{t.date}</td>
                  <td style={{textAlign:'right', fontWeight:700, color: t.amt.startsWith('+') ? 'var(--neon-cyan)' : 'white'}}>{t.amt}</td>
                  <td style={{textAlign:'right'}}>
                    <span className={`neo-status ${t.stat==='Completed'?'ok':'wait'}`}>{t.stat}</span>
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
