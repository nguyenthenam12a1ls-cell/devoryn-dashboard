import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { MoreHorizontal, Settings, Download, RefreshCw } from 'lucide-react';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import './Analytics.css';

const PERIODS = ['7D', '30D', '90D', 'All'];

const chartData = {
  '7D': { peaks: [40,55,35,70,60,80,50],  total: '420K', sessions: '38K', bounce: '38%'  },
  '30D':{ peaks: [30,50,45,65,55,75,60,70,80,75,90,60,65,70,80,85,55,60,75,80,70,65,90,85,70,75,60,80,85,90], total:'2.1M', sessions:'140K', bounce:'34%' },
  '90D':{ peaks: [45,60,50,70,65,80,55,75,85,70,80,90,60,75,80,85,70,65,90,85,70,75,60,80,85,90,80,75,70,65], total:'6.3M', sessions:'480K', bounce:'31%' },
  'All':{ peaks: [50,65,55,75,70,85,60,80,90,75,85,95,65,80,85,90,75,70,95,90,75,80,65,85,90,95,85,80,75,70], total:'18.2M', sessions:'1.2M', bounce:'29%' },
};

const funnelData = [
  { label: 'Impressions',    pct: 100, color: '#1a9fff', val: '3.88%' },
  { label: 'Clicks',         pct: 65,  color: '#00e5ff', val: '0.96%' },
  { label: 'Sign-ups',       pct: 35,  color: '#34d399', val: '0.32%' },
  { label: 'First Purchase', pct: 20,  color: '#f59e0b', val: ''      },
];

function LineChart({ period }) {
  const data = chartData[period] || chartData['30D'];
  const pts  = data.peaks;
  const W = 300, H = 80;
  const xs = pts.map((_, i) => (i/(pts.length-1))*W);
  const ys = pts.map(p => H - (p/100)*(H-10));
  const d  = xs.map((x, i) => `${i===0?'M':'L'}${x},${ys[i]}`).join(' ');
  const area = `${d} L${W},${H} L0,${H}Z`;
  
  const [hoverIdx, setHoverIdx] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg className="analytics-line-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = x / rect.width;
          const idx = Math.min(pts.length-1, Math.max(0, Math.round(pct * (pts.length-1))));
          setHoverIdx(idx);
        }}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ cursor: 'crosshair' }}
      >
        <defs>
          <linearGradient id="alg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#alg1)" />
        <path d={d} fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
        
        {hoverIdx !== null && (
          <>
            <line x1={xs[hoverIdx]} y1="0" x2={xs[hoverIdx]} y2={H} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={xs[hoverIdx]} cy={ys[hoverIdx]} r="3" fill="#00e5ff" stroke="#fff" strokeWidth="1" />
          </>
        )}
        
        {['Jan','Feb','Mar','Apr','May','Jun'].map((l,i) => (
          <text key={l} x={10+i*54} y={H-2} fontSize="7" fill="rgba(255,255,255,0.4)" textAnchor="middle" style={{ pointerEvents: 'none' }}>{l}</text>
        ))}
      </svg>
      {hoverIdx !== null && (
        <div style={{
          position: 'absolute', top: -20, left: `${(hoverIdx/(pts.length-1))*100}%`, transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px',
          color: '#fff', pointerEvents: 'none', whiteSpace: 'nowrap', border: '1px solid rgba(0,229,255,0.3)'
        }}>
          Val: {pts[hoverIdx]}
        </div>
      )}
    </div>
  );
}

function StackedBars() {
  const data = [
    { label:'Organic Search', vals:[60,25,15] },
    { label:'Social',         vals:[40,35,25] },
    { label:'Direct',         vals:[70,20,10] },
    { label:'Referral',       vals:[50,30,20] },
  ];
  const colors = ['#1a9fff','#f59e0b','#34d399'];
  return (
    <div className="stacked-bars">
      {data.map(d => (
        <div key={d.label} className="stacked-bar-col">
          <div className="bar-stack">
            {d.vals.map((v,i) => <div key={i} className="bar-seg" style={{ height:`${v}%`, background:colors[i] }} />)}
          </div>
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function FunnelChart() {
  const [filterIdx, setFilterIdx] = useState(null);
  
  return (
    <div className="funnel-chart">
      {funnelData.map((s, i) => (
        <div key={s.label} className="funnel-row" onClick={() => setFilterIdx(filterIdx === i ? null : i)} style={{ cursor: 'pointer', opacity: filterIdx !== null && filterIdx !== i ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <span className="funnel-label">{s.label}</span>
          <div className="funnel-bar-bg">
            <div className="funnel-bar" style={{ width:`${s.pct}%`, background:s.color }} />
          </div>
          {s.val && <span className="funnel-val">{s.val}</span>}
        </div>
      ))}
    </div>
  );
}

function DonutRoas() {
  const [hovered, setHovered] = useState(null);
  const segments = [
    { stroke:'#1a9fff', dash:'98 122', offset:'-10', pct: 45, label: 'Search' },
    { stroke:'#f59e0b', dash:'43 177', offset:'-108', pct: 20, label: 'Social' },
    { stroke:'#34d399', dash:'22 198', offset:'-151', pct: 10, label: 'Email' },
    { stroke:'#a78bfa', dash:'57 163', offset:'-173', pct: 25, label: 'Referral' },
  ];
  return (
    <div className="donut-roas" style={{ position: 'relative' }}>
      <svg viewBox="0 0 100 100" className="donut-roas-svg">
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
        {segments.map((c,i) => (
          <circle key={i} cx="50" cy="50" r="35" fill="none" stroke={c.stroke} strokeWidth={hovered === i ? "24" : "20"}
            strokeDasharray={c.dash} strokeDashoffset={c.offset}
            style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', transition: 'all 0.2s', cursor: 'pointer', opacity: hovered !== null && hovered !== i ? 0.6 : 1 }} 
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>
      {hovered !== null && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>{segments[hovered].label}</div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: segments[hovered].stroke }}>{segments[hovered].pct}%</div>
        </div>
      )}
    </div>
  );
}

function Heatmap() {
  const cols = ['Home','Product','Checkout'];
  const [hovered, setHovered] = useState(null);
  const cells = [[90,50,70],[40,80,60],[60,30,90],[70,90,40]];
  const getColor = (v) => {
    if (v>75) return 'rgba(255,80,40,0.8)';
    if (v>55) return 'rgba(255,180,0,0.7)';
    if (v>35) return 'rgba(40,200,100,0.6)';
    return 'rgba(0,100,200,0.5)';
  };
  return (
    <div className="heatmap">
      <div className="heatmap-cols">
        {cols.map(c => <span key={c} className="heatmap-col-label">{c}</span>)}
      </div>
      {cells.map((row,i) => (
        <div key={i} className="heatmap-row">
          {row.map((v,j) => {
            const key = `${i}-${j}`;
            return (
              <div key={j} className={`heatmap-cell ${hovered===key ? 'hovered' : ''}`}
                style={{ background:getColor(v) }}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                title={`${cols[j]}: ${v}%`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState('30D');
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const data = chartData[period];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 900));
    setRefreshing(false);
    addToast('Analytics data refreshed!', 'success');
  };

  const handleExport = () => {
    addToast('Report exported as CSV', 'info');
    // Simulate real download
    const dummyData = "Date,Users,Sessions,BounceRate\n2023-01-01,1420,1500,34%\n";
    const blob = new Blob([dummyData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `analytics_${period}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="analytics-page">
        <div className="page-title-row">
          <h2 className="page-title">Analytics Insights</h2>
          <div className="analytics-controls">
            {PERIODS.map(p => (
              <button key={p} className={`period-btn ${period===p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
            <button className="icon-sm" onClick={handleRefresh} title="Refresh">
              <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
            </button>
            <button className="icon-sm" onClick={handleExport} title="Export CSV">
              <Download size={13} />
            </button>
            <button className="icon-sm" title="Settings"><Settings size={14} /></button>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Traffic card */}
          <div className="card a-traffic glass-card-dark">
            <div className="card-head">
              <span className="card-title">Detailed Traffic and Acquisition</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <span className="card-subtitle">User Sessions over Time</span>
            <LineChart period={period} />
            <div className="card-head" style={{ marginTop:6 }}>
              <span className="card-title">Traffic by Channel</span>
            </div>
            <StackedBars />
            <div className="traffic-footer">
              <div className="tf-item"><span className="tf-val">{data.total}</span><span className="tf-lbl">Total Users</span></div>
              <div className="tf-item"><span className="tf-val">4m 32s</span><span className="tf-lbl">Avg. Session Duration</span></div>
              <div className="tf-item"><span className="tf-val">6.1</span><span className="tf-lbl">Pages per Sess.</span></div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="card a-funnel glass-card-dark">
            <div className="card-head">
              <span className="card-title">Conversion Funnel Performance</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <FunnelChart />
            <div className="card-head" style={{ marginTop:10 }}>
              <span className="card-title">Channel Contribution and ROAS</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <div className="channel-contrib-row">
              <DonutRoas />
              <div className="contrib-info">
                <div className="contrib-stats">
                  <div className="contrib-kv"><span className="contrib-k">Contb.</span><span className="contrib-v cyan-text">3.7%</span></div>
                  <div className="contrib-kv"><span className="contrib-k contrib-hl">20%</span></div>
                  <div className="contrib-kv"><span className="contrib-k">ROAS</span><span className="contrib-v">13.1K</span></div>
                </div>
              </div>
            </div>
            <div className="contrib-legend">
              {['Search','Social','Email','Referral'].map((l,i) => (
                <span key={l} className={`contrib-tag t${i}`}>{l}</span>
              ))}
            </div>
          </div>

          {/* ROAS + Heatmap */}
          <div className="card a-roas glass-card-dark">
            <div className="card-head">
              <span className="card-title">Channel Contribution and ROAS</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <div className="roas-legend">
              {[
                { label:'Search',  pct:'45%', val:'8.7x', color:'#1a9fff' },
                { label:'Social',  pct:'20%', val:'3.7x', color:'#f59e0b' },
                { label:'Email',   pct:'10%', val:'2.2x', color:'#34d399' },
                { label:'Referral',pct:'',    val:'',     color:'#a78bfa' },
              ].map(r => (
                <div key={r.label} className="roas-row">
                  <span className="legend-dot" style={{ background:r.color }} />
                  <span className="roas-lbl">{r.label}</span>
                  <span className="roas-pct">{r.pct}</span>
                  <span className="roas-val">{r.val}</span>
                </div>
              ))}
            </div>
            <div className="roas-donut-wrap"><DonutRoas /></div>
            <div className="card-head" style={{ marginTop:8 }}>
              <span className="card-title">Top User Paths (Heatmap)</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <Heatmap />
          </div>
        </div>
      </div>
    </Layout>
  );
}
