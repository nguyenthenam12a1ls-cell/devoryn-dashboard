import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { MoreHorizontal, Calendar, ChevronDown, Eye, Trash2, ExternalLink, Loader2, Download } from 'lucide-react';
import './Reports.css';

const initArchive = [
  { id:1, name:'Nebula CRM',      date:'03/05/2023', type:'Project',  status:'Ready',      statusColor:'#22d3ee' },
  { id:2, name:'Aethel Platform', date:'03/05/2023', type:'Ready',    status:'Generating', statusColor:'#f59e0b' },
  { id:3, name:'Orion App',       date:'03/05/2023', type:'Project',  status:'Failed',     statusColor:'#ef4444' },
];

function DonutBreakdown({ highlight }) {
  const segments = [
    { pct:30, color:'#1a9fff', label:'Performance' },
    { pct:25, color:'#a78bfa', label:'Financial'   },
    { pct:20, color:'#f59e0b', label:'Project'     },
    { pct:15, color:'#34d399', label:'Analytics'   },
    { pct:10, color:'#ef4444', label:'Other'       },
  ];
  let offset = 0;
  const r = 38, circ = 2*Math.PI*r;
  return (
    <div>
      <svg viewBox="0 0 100 100" style={{ width:90, height:90 }}>
        {segments.map((s,i) => {
          const dash = (s.pct/100)*circ;
          const el = (
            <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="16"
              strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-offset}
              style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', opacity: highlight&&highlight!==s.label?0.4:1, transition:'opacity 0.2s' }} />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="breakdown-legend">
        {segments.map(s => (
          <div key={s.label} className="breakdown-leg-item">
            <span style={{ width:8, height:8, borderRadius:'50%', background:s.color, display:'inline-block', marginRight:4 }} />
            <span>{s.label} {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  const { toasts, addToast, removeToast } = useToast();
  const [archive, setArchive]     = useState(initArchive);
  const [reportType, setType]     = useState('Performance');
  const [reportDate, setDate]     = useState('');
  const [generating, setGen]      = useState(false);
  const [donutHighlight, setHL]   = useState(null);
  const [expandedRow, setExpanded] = useState(null);
  
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const filteredArchive = archive.filter(r => {
    const matchType = filterType === 'All' || r.type === filterType;
    const matchDate = !filterDate || r.date === filterDate;
    return matchType && matchDate;
  });

  const handleGenerate = async () => {
    if (!reportType) { addToast('Please select a report type', 'warning'); return; }
    setGen(true);
    await new Promise(r => setTimeout(r, 2000));
    const now = new Date();
    const dateStr = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`;
    setArchive(prev => [{ id:Date.now(), name:`${reportType} Report`, date:dateStr, type:reportType, status:'Ready', statusColor:'#22d3ee' }, ...prev]);
    setGen(false);
    addToast(`${reportType} report generated successfully!`, 'success');
  };

  const handleDeleteReport = (id) => {
    setArchive(prev => prev.filter(r => r.id !== id));
    addToast('Report deleted.', 'info');
  };

  const handleViewReport = (r) => {
    setExpanded(expandedRow === r.id ? null : r.id);
    addToast(`Viewing: ${r.name}`, 'info');
  };

  const handleDownload = (r) => {
    addToast(`Downloading ${r.name} report…`, 'info');
    const dummyData = `Devoryn Workspace Report\nName: ${r.name}\nType: ${r.type}\nDate: ${r.date}\nStatus: ${r.status}\n\nMetrics Data:\n- Sessions: 140k\n- Bounce Rate: 34%`;
    const blob = new Blob([dummyData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${r.name.replace(/\s+/g, '_').toLowerCase()}.txt`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="reports-page">
        <div className="page-title-row">
          <h2 className="page-title">Reports Center</h2>
          <button className="icon-sm"><MoreHorizontal size={14} /></button>
        </div>

        <div className="reports-grid">
          <div className="reports-left">
            {/* Report Wizard */}
            <div className="card glass-card-dark">
              <div className="card-head">
                <span className="card-title">Report Wizard</span>
                <MoreHorizontal size={15} className="card-more" />
              </div>
              <div className="wizard-row">
                <div className="wizard-select">
                  <select className="glass-select" id="select-report-type" value={reportType} onChange={e => setType(e.target.value)}>
                    <option>Performance</option>
                    <option>Financial</option>
                    <option>Project</option>
                    <option>Analytics</option>
                  </select>
                  <ChevronDown size={12} className="select-arrow" />
                </div>
                <div className="wizard-date">
                  <Calendar size={12} />
                  <input type="date" className="wizard-date-input" value={reportDate} onChange={e => setDate(e.target.value)} placeholder="Pick date" />
                </div>
              </div>

              <div className="wizard-types">
                {['Financial','Project','Analytics'].map(t => (
                  <div key={t} className={`wizard-type-item ${reportType===t?'active':''}`} onClick={() => setType(t)}>{t}</div>
                ))}
              </div>

              <button className="btn-generate" id="btn-generate-report" onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Loader2 size={14} className="spin" /> Generating...
                  </span>
                ) : 'Generate Report'}
              </button>
            </div>

            {/* Report Archive */}
            <div className="card glass-card-dark">
              <div className="card-head">
                <span className="card-title">Report Archive</span>
                <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                  <input type="date" className="glass-input" style={{ width:'110px', height:'26px', fontSize:'10px', padding:'2px 6px' }}
                    value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                  <select className="glass-select" style={{ height:'26px', fontSize:'10px', padding:'2px 6px', width:'80px' }}
                    value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="Project">Project</option>
                    <option value="Performance">Performance</option>
                    <option value="Financial">Financial</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                  <MoreHorizontal size={15} className="card-more" />
                </div>
              </div>
              <div className="archive-table">
                <div className="archive-header">
                  <span>Name</span><span>Date</span><span>Type</span><span>Status</span><span>Actions</span>
                </div>
                {filteredArchive.length === 0 ? (
                  <div style={{ padding:'20px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'12px' }}>No reports found</div>
                ) : filteredArchive.map(r => (
                  <div key={r.id}>
                    <div className={`archive-row ${expandedRow===r.id?'expanded':''}`}>
                      <span className="archive-name">{r.name}</span>
                      <span className="archive-date">{r.date}</span>
                      <span className="archive-type">{r.type}</span>
                      <span className="archive-status" style={{ color:r.statusColor, background:`${r.statusColor}20`, border:`1px solid ${r.statusColor}40` }}>{r.status}</span>
                      <div className="archive-actions">
                        <button className="arch-btn" onClick={() => handleViewReport(r)} title="View"><Eye size={12} /></button>
                        <button className="arch-btn" onClick={() => handleDownload(r)} title="Download"><Download size={12} /></button>
                        <button className="arch-btn danger" onClick={() => handleDeleteReport(r.id)} title="Delete"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    {expandedRow===r.id && (
                      <div className="archive-detail">
                        <p>📊 <strong>{r.name}</strong> — Type: {r.type} | Generated: {r.date}</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'8px', fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>
                          <div>• Growth: +24% MoM</div>
                          <div>• Cost/Acq: $14.50</div>
                          <div>• Active Users: 1.2M</div>
                          <div>• Retention: 42%</div>
                        </div>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', marginTop:'8px' }}>Click Download to export this report as a PDF.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribed Reports */}
            <div className="card glass-card-dark">
              <div className="card-head">
                <span className="card-title">Subscribed Reports</span>
                <MoreHorizontal size={15} className="card-more" />
              </div>
              <div className="subscribed-row">
                <span className="sub-name">Upcoming Scheduled Report</span>
                <span className="sub-time">5 view to 12:35 PM</span>
                <div className="sub-actions">
                  <button className="arch-btn" onClick={() => addToast('Viewing scheduled report','info')}><Eye size={13} /></button>
                  <button className="arch-btn danger" onClick={() => addToast('Unsubscribed','warning')}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Breakdown */}
          <div className="reports-right">
            <div className="card glass-card-dark" style={{ height:'100%' }}>
              <div className="card-head">
                <span className="card-title">Reports Breakdown by Type</span>
                <MoreHorizontal size={15} className="card-more" />
              </div>
              <div className="breakdown-donut">
                <DonutBreakdown highlight={donutHighlight} />
              </div>
              <div className="breakdown-actions">
                {['Upport View','Unsubscribe'].map((lbl,i) => (
                  <div key={lbl} className="breakdown-action-item" onMouseEnter={() => setHL(i===0?'Performance':'Financial')} onMouseLeave={() => setHL(null)}>
                    <span>{lbl}</span>
                    <div className="ba-icons">
                      <button className="arch-btn" onClick={() => addToast(`${lbl} selected`,'info')}><Eye size={12} /></button>
                      {i===0 ? <button className="arch-btn" onClick={() => addToast('Exported','success')}><ExternalLink size={12} /></button>
                              : <button className="arch-btn danger" onClick={() => addToast('Unsubscribed','warning')}><Trash2 size={12} /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
