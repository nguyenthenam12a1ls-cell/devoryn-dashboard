import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { MoreHorizontal, Plus, Search, ChevronDown, X } from 'lucide-react';
import './Projects.css';

const initialProjects = [
  { id:1, name:'Nebula CRM Phase 2',     start:'05/3',  end:'Nov 01/13', status:'In Progress', color:'#1a9fff', members:3, border:'1px solid rgba(26,159,255,0.5)'    },
  { id:2, name:'Aethel Platform Launch', start:'05/5',  end:'Sep 11/29', status:'Blocked',     color:'#ef4444', members:2, border:'1px solid rgba(239,68,68,0.5)'      },
  { id:3, name:'Orion App MVP',          start:'01/20', end:'Nov 11/29', status:'Completed',   color:'#22d3ee', members:4, border:'1px solid rgba(0,229,255,0.3)'      },
  { id:4, name:'Project Polaris',        start:'05/9',  end:'Nov 11/29', status:'Completed',   color:'#22d3ee', members:2, border:'1px solid rgba(0,229,255,0.3)'      },
];

const statusColor = { 'In Progress':'#1a9fff', 'Blocked':'#ef4444', 'Completed':'#22d3ee', 'Planning':'#a78bfa' };
const statusList  = ['All','In Progress','Blocked','Completed','Planning'];

const timeline = [
  { name:'Nebula',       color:'#1a9fff', phases:[{ start:1, span:3 }] },
  { name:'Aethel',       color:'#a78bfa', phases:[{ start:2, span:3 }] },
  { name:'Orion App MVP',color:'#f59e0b', phases:[{ start:4, span:2 }] },
  { name:'Proj. Polaris',color:'#22d3ee', phases:[{ start:5, span:2 }] },
];

export default function Projects() {
  const { toasts, addToast, removeToast } = useToast();
  const [projects, setProjects]     = useState(initialProjects);
  const [search, setSearch]         = useState('');
  const [statusFilter, setFilter]   = useState('All');
  const [showStatusDD, setShowStatusDD] = useState(false);
  
  // Modals state
  const [modalOpen, setModalOpen]   = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [form, setForm]             = useState({ id:null, name:'', status:'In Progress', start:'', end:'' });
  const [formErr, setFormErr]       = useState({});

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleNew = () => { setForm({ id:null, name:'', status:'In Progress', start:'', end:'' }); setFormErr({}); setModalOpen(true); };
  
  const handleEdit = (p, e) => {
    e.stopPropagation();
    setForm({ id: p.id, name: p.name, status: p.status, start: p.start, end: p.end });
    setFormErr({});
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Project name is required';
    setFormErr(errs);
    if (Object.keys(errs).length) return;

    const color = statusColor[form.status] || '#1a9fff';
    
    if (form.id) {
      // Update
      setProjects(prev => prev.map(p => p.id === form.id ? {
        ...p, name: form.name, start: form.start||'TBD', end: form.end||'TBD',
        status: form.status, color, border: `1px solid ${color}55`
      } : p));
      addToast(`Project updated!`, 'success');
    } else {
      // Create
      setProjects(prev => [...prev, {
        id: Date.now(), name: form.name, start: form.start||'TBD', end: form.end||'TBD',
        status: form.status, color, members: 1,
        border: `1px solid ${color}55`,
      }]);
      addToast(`Project created!`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    addToast('Project removed.', 'info');
  };

  const openDetails = (p) => {
    setSelectedProject(p);
    setDetailModalOpen(true);
  };

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="projects-page">
        <div className="page-title-row">
          <h2 className="page-title">Projects Overview</h2>
          <button className="btn-new-project" id="btn-new-project" onClick={handleNew}>
            <Plus size={14} /> New Project
          </button>
        </div>

        {/* Filters */}
        <div className="projects-filters">
          <div className="search-box">
            <Search size={13} className="search-icon" />
            <input id="input-search-project" placeholder="Search Projects..."
              className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="search-clear" onClick={() => setSearch('')}><X size={12} /></button>}
          </div>

          <div className="dropdown-wrap">
            <button className="filter-btn" onClick={() => setShowStatusDD(!showStatusDD)}>
              Status: {statusFilter} <ChevronDown size={12} />
            </button>
            {showStatusDD && (
              <div className="dropdown-menu">
                {statusList.map(s => (
                  <button key={s} className={`dropdown-item ${statusFilter===s?'active':''}`}
                    onClick={() => { setFilter(s); setShowStatusDD(false); }}>
                    {s !== 'All' && <span className="dot" style={{ background: statusColor[s] }} />}
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="filter-count">{filtered.length} project{filtered.length!==1?'s':''}</span>
        </div>

        {/* Project Cards */}
        <div className="project-cards-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">No projects match your filters</div>
          ) : filtered.map(p => (
            <div key={p.id} className="proj-card glass-card-dark" style={{ border:p.border }} onClick={() => openDetails(p)}>
              <div className="proj-card-head">
                <span className="proj-card-name">{p.name}</span>
                <div className="proj-card-menu">
                  <button className="proj-delete-btn" onClick={(e) => handleDelete(p.id, e)} title="Remove"><X size={12} /></button>
                  <button className="proj-delete-btn" style={{color:'#1a9fff'}} onClick={(e) => handleEdit(p, e)} title="Edit"><MoreHorizontal size={14} /></button>
                </div>
              </div>
              <div className="proj-avatars">
                {[...Array(p.members)].map((_,i) => (
                  <div key={i} className="proj-avatar" style={{ background:`hsl(${i*60+180},70%,55%)`, marginLeft:i>0?-8:0 }}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <span className="proj-status-badge"
                style={{ background:`${statusColor[p.status]}22`, color:statusColor[p.status], border:`1px solid ${statusColor[p.status]}55` }}>
                {p.status}
              </span>
              <div className="proj-dates"><span>Date: {p.start}</span><span>{p.end}</span></div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="timeline-section glass-card-dark">
          <div className="card-head">
            <span className="card-title">Project Timeline</span>
          </div>
          <div className="timeline-grid">
            <div className="timeline-labels">
              <div className="tl-header-blank">Phase</div>
              {timeline.map(t => (
                <div key={t.name} className="tl-row-label">
                  <span className="tl-dot" style={{ background:t.color }} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
            <div className="timeline-bars">
              <div className="tl-phases-header">
                {[1,2,3,4,5,6,7].map(p => <span key={p} className="tl-phase-label">Phase {p}</span>)}
              </div>
              {timeline.map(t => (
                <div key={t.name} className="tl-bar-row">
                  {t.phases.map((ph,i) => (
                    <div key={i} className="tl-bar tooltip-container" style={{
                      marginLeft:`${(ph.start-1)*(100/7)}%`,
                      width:`${ph.span*(100/7)}%`,
                      background:t.color,
                      position: 'relative'
                    }}>
                      <div className="tl-tooltip">
                        <strong>{t.name}</strong><br/>
                        Phase {ph.start} to {ph.start+ph.span-1}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Project" : "New Project"}>
        <div className="modal-field">
          <label className="modal-label">Project Name *</label>
          <input className={`modal-input ${formErr.name?'input-err':''}`} placeholder="e.g. Nebula CRM v3"
            value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
          {formErr.name && <span style={{fontSize:'11px',color:'#ef4444'}}>{formErr.name}</span>}
        </div>
        <div className="modal-field">
          <label className="modal-label">Status</label>
          <select className="modal-select" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
            {['In Progress','Planning','Blocked','Completed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="modal-row-2">
          <div className="modal-field">
            <label className="modal-label">Start Date</label>
            <input className="modal-input" type="date" value={form.start} onChange={e => setForm({...form, start:e.target.value})} />
          </div>
          <div className="modal-field">
            <label className="modal-label">End Date</label>
            <input className="modal-input" type="date" value={form.end} onChange={e => setForm({...form, end:e.target.value})} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleSubmit}>{form.id ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </Modal>

      {/* Project Details Modal */}
      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Project Details">
        {selectedProject && (
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '18px', color: '#fff' }}>{selectedProject.name}</strong>
              <span className="proj-status-badge" style={{ background:`${selectedProject.color}22`, color:selectedProject.color, border:`1px solid ${selectedProject.color}55` }}>
                {selectedProject.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div><span style={{ color:'rgba(255,255,255,0.4)' }}>Start Date</span><br/>{selectedProject.start}</div>
              <div><span style={{ color:'rgba(255,255,255,0.4)' }}>End Date</span><br/>{selectedProject.end}</div>
              <div><span style={{ color:'rgba(255,255,255,0.4)' }}>Team Size</span><br/>{selectedProject.members} members</div>
              <div><span style={{ color:'rgba(255,255,255,0.4)' }}>Tasks</span><br/>24 active</div>
            </div>
            <div>
              <strong>Quick Actions</strong>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className="arch-btn" onClick={() => addToast('Viewed tasks','info')}>View Tasks</button>
                <button className="arch-btn" onClick={() => addToast('Manage team modal','info')}>Manage Team</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
