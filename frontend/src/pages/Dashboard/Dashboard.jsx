import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { MoreHorizontal, ArrowRight } from 'lucide-react';
import './Dashboard.css';

/* Animated counter hook */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

const projects = [
  { name: 'Nebula CRM', pct: 78, color: '#00e5ff', path: '/projects' },
  { name: 'Aethel Platform', pct: 94, color: '#1a9fff', path: '/projects' },
  { name: 'Orion App', pct: 52, color: '#f59e0b', path: '/projects' },
];

const tasksPie = [
  { label: 'In Progress', pct: 45, color: '#00e5ff' },
  { label: 'Done',        pct: 30, color: '#22d3ee' },
  { label: 'Backlog',     pct: 25, color: '#f59e0b' },
];

const activityFeed = [
  { user: 'Anna',  color: '#00e5ff', action: 'uploaded Nebula CRM wireframes', time: '2m ago'  },
  { user: 'Ben',   color: '#1a9fff', action: 'commented on Aethel Platform',   time: '15m ago' },
  { user: 'Chloe', color: '#a78bfa', action: 'completed User Testing milestone', time: '1h ago' },
  { user: 'David', color: '#f59e0b', action: 'updated Orion App MVP status',   time: '2h ago'  },
  { user: 'Emily', color: '#34d399', action: 'generated Monthly Report',       time: '3h ago'  },
];

function MiniLineChart() {
  return (
    <svg className="mini-line-chart" viewBox="0 0 200 80" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,60 C20,50 40,30 60,40 C80,50 100,20 120,25 C140,30 160,10 180,15 L200,10 L200,80 L0,80Z" fill="url(#lg1)" />
      <path d="M0,60 C20,50 40,30 60,40 C80,50 100,20 120,25 C140,30 160,10 180,15 L200,10" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MiniBarChart() {
  const bars = [30,55,40,70,50,80,45,90,60,75,55,85];
  return (
    <div className="mini-bar-chart">
      {bars.map((h, i) => (
        <div key={i} className="bar-wrap">
          <div className="bar" style={{ height:`${h}%`, background: i%2===0 ? '#1a9fff' : '#f59e0b' }} />
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const r = 40, cx = 50, cy = 50, circ = 2*Math.PI*r;
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox="0 0 100 100" className="donut-chart">
        {segments.map((s, i) => {
          const dash = (s.pct/100)*circ;
          const isHovered = hovered === i;
          const segmentOffset = (segments.slice(0, i).reduce((acc, curr) => acc + curr.pct, 0) / 100) * circ;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} 
              strokeWidth={isHovered ? "22" : "18"}
              strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-segmentOffset}
              style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
      {hovered !== null && (
        <div className="donut-tooltip" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none', background: 'rgba(0,0,0,0.6)', 
          padding: '4px 8px', borderRadius: '6px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{segments[hovered].label}</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: segments[hovered].color }}>{segments[hovered].pct}%</div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const rev   = useCounter(14500, 1500);
  const eff   = useCounter(92, 1200);
  const tasks = useCounter(312, 1300);
  const [activeActivity, setActiveActivity] = useState(null);

  const formatRev = (v) => v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${v}`;

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <div className="dashboard-page">
        <div className="page-title-row">
          <h2 className="page-title">Dashboard Overview</h2>
          <button className="icon-sm"><MoreHorizontal size={16} /></button>
        </div>

        <div className="dash-grid">
          {/* Performance Metrics */}
          <div className="card perf-card glass-card-dark">
            <div className="card-head">
              <span className="card-title">Performance Metrics</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <MiniLineChart />
            <MiniBarChart />
            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-val">{formatRev(rev)}</span>
                <span className="metric-lbl">Revenue</span>
              </div>
              <div className="metric-item">
                <span className="metric-val">{eff}%</span>
                <span className="metric-lbl">Efficiency</span>
              </div>
              <div className="metric-item">
                <span className="metric-val">{tasks}</span>
                <span className="metric-lbl">Active Tasks</span>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="card projects-card glass-card-dark">
            <div className="card-head">
              <span className="card-title">Active Projects</span>
              <button className="card-link-btn" onClick={() => navigate('/projects')}>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="project-list">
              {projects.map(p => (
                <div
                  key={p.name}
                  className="project-row clickable"
                  onClick={() => navigate('/projects')}
                  title="View all projects"
                >
                  <span className="proj-name">{p.name}</span>
                  <div className="proj-bar-bg">
                    <div className="proj-bar-fill" style={{ width:`${p.pct}%`, background: p.color }} />
                  </div>
                  <span className="proj-pct">{p.pct}%</span>
                </div>
              ))}
            </div>

            <div className="card-head" style={{ marginTop: 10 }}>
              <span className="card-title">Tasks Status</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            {[
              { label:'Nebula', pct: 45, color:'#00e5ff' },
              { label:'Done',   pct: 20, color:'#22d3ee' },
            ].map(t => (
              <div key={t.label} className="task-mini-row">
                <div className="avatar-sm" style={{ background: t.color }}>{t.label[0]}</div>
                <span className="task-mini-lbl">{t.label}</span>
                <span className="task-mini-pct">{t.pct}%</span>
              </div>
            ))}
          </div>

          {/* Tasks Status Donut */}
          <div className="card donut-card glass-card-dark">
            <div className="card-head">
              <span className="card-title">Tasks Status</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <div className="donut-wrap">
              <DonutChart segments={tasksPie} />
            </div>
            <div className="legend-list">
              {tasksPie.map(s => (
                <div key={s.label} className="legend-item">
                  <span className="legend-dot" style={{ background: s.color }} />
                  <span className="legend-lbl">{s.label}</span>
                  <span className="legend-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="team-activity-bar glass-card-dark">
          <div className="card-head">
            <span className="card-title">Team Activity</span>
            <button className="card-link-btn" onClick={() => navigate('/team')}>
              View Team <ArrowRight size={12} />
            </button>
          </div>
          <div className="activity-feed">
            {activityFeed.map((a, i) => (
              <div
                key={i}
                className={`activity-item ${activeActivity === i ? 'active' : ''}`}
                onClick={() => setActiveActivity(activeActivity === i ? null : i)}
              >
                <div className="act-avatar" style={{ background: a.color }}>{a.user[0]}</div>
                <div className="act-body">
                  <span className="act-user">{a.user}</span>
                  <span className="act-action">{a.action}</span>
                </div>
                <span className="act-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
