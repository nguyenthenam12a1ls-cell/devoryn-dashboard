import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { MoreHorizontal, Plus, Check, X } from 'lucide-react';
import './Team.css';

const initMembers = [
  { id:1, name:'Anna',  role:'UX Lead',          color:'#00e5ff', workload:85, tasks:12, milestones:[true,true,false,false] },
  { id:2, name:'Ben',   role:'Frontend Dev',     color:'#1a9fff', workload:62, tasks:8,  milestones:[true,false,false,false] },
  { id:3, name:'Chloe', role:'Product Designer', color:'#a78bfa', workload:91, tasks:15, milestones:[true,true,true,false] },
  { id:4, name:'David', role:'Backend Dev',      color:'#f59e0b', workload:48, tasks:6,  milestones:[true,true,false,false] },
  { id:5, name:'Emily', role:'Project Manager',  color:'#34d399', workload:73, tasks:10, milestones:[true,true,true,true] },
];

const systemResources = [
  { label:'API',     pct:78, color:'#1a9fff' },
  { label:'DB',      pct:55, color:'#a78bfa' },
  { label:'Storage', pct:34, color:'#22d3ee' },
  { label:'CDN',     pct:89, color:'#f59e0b' },
];

const milestoneLabels = ['M1','M2','M3','M4'];

export default function Team() {
  const { toasts, addToast, removeToast } = useToast();
  const [members, setMembers]     = useState(initMembers);
  const [selectedMember, setSel]  = useState(null);
  const [addModal, setAddModal]   = useState(false);
  const [form, setForm]           = useState({ id:null, name:'', role:'', workload:50 });
  const [search, setSearch]       = useState('');
  
  const [resources, setResources] = useState(systemResources);

  // Auto-refresh resources randomly every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => prev.map(r => ({
        ...r, pct: Math.max(10, Math.min(100, r.pct + Math.floor(Math.random() * 21) - 10))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMilestone = (memberId, mIdx) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId
        ? { ...m, milestones: m.milestones.map((v,i) => i===mIdx ? !v : v) }
        : m
    ));
    addToast('Milestone updated', 'success');
  };

  const handleEditClick = (m, e) => {
    e.stopPropagation();
    setForm({ id: m.id, name: m.name, role: m.role, workload: m.workload });
    setAddModal(true);
  };

  const handleAddMember = () => {
    if (!form.name.trim() || !form.role.trim()) { addToast('Name and role are required', 'warning'); return; }
    
    if (form.id) {
      setMembers(prev => prev.map(m => m.id === form.id ? { ...m, name: form.name, role: form.role, workload: parseInt(form.workload)||50 } : m));
      addToast(`${form.name} updated!`, 'success');
    } else {
      const colors = ['#00e5ff','#1a9fff','#a78bfa','#f59e0b','#34d399'];
      setMembers(prev => [...prev, {
        id: Date.now(), name:form.name, role:form.role, color:colors[prev.length%colors.length],
        workload:parseInt(form.workload)||50, tasks:0, milestones:[false,false,false,false],
      }]);
      addToast(`${form.name} added to team!`, 'success');
    }
    setAddModal(false); setForm({ id:null, name:'', role:'', workload:50 });
  };

  const handleRemoveMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selectedMember?.id === id) setSel(null);
    addToast('Member removed', 'info');
  };

  const workloadColor = (w) => w>=85 ? '#ef4444' : w>=65 ? '#f59e0b' : '#22d3ee';

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="team-page">
        <div className="page-title-row">
          <h2 className="page-title">Team Management</h2>
          <div style={{ display:'flex', gap:'8px' }}>
            <input 
              className="glass-input" 
              placeholder="Search team..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ width: '160px', padding: '6px 10px', fontSize: '11px', height: '30px', margin: 0 }}
            />
            <button className="btn-add-member" id="btn-add-member" onClick={() => { setForm({id:null, name:'', role:'', workload:50}); setAddModal(true); }}>
              <Plus size={14} /> Add Member
            </button>
          </div>
        </div>

        <div className="team-grid">
          {/* Workload + Milestones */}
          <div className="card glass-card-dark team-main-card">
            <div className="card-head">
              <span className="card-title">Team Workload</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>

            <div className="workload-list">
              {filteredMembers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>No members found</div>
              ) : filteredMembers.map(m => (
                <div
                  key={m.id}
                  className={`workload-row ${selectedMember?.id===m.id?'selected':''}`}
                  onClick={() => setSel(selectedMember?.id===m.id ? null : m)}
                >
                  <div className="wl-avatar" style={{ background:m.color }}>{m.name[0]}</div>
                  <div className="wl-info">
                    <div className="wl-name-row">
                      <span className="wl-name">{m.name}</span>
                      <span className="wl-role">{m.role}</span>
                    </div>
                    <div className="wl-bar-bg">
                      <div className="wl-bar-fill" style={{ width:`${m.workload}%`, background:workloadColor(m.workload) }} />
                    </div>
                  </div>
                  <div className="wl-right">
                    <span className="wl-pct" style={{ color:workloadColor(m.workload) }}>{m.workload}%</span>
                    <span className="wl-tasks">{m.tasks} tasks</span>
                    <div className="wl-actions" style={{ display: 'flex' }}>
                      <button className="member-remove-btn" style={{ color: '#1a9fff' }} onClick={(e) => handleEditClick(m, e)} title="Edit">
                        <MoreHorizontal size={11} />
                      </button>
                      <button className="member-remove-btn" onClick={(e) => { e.stopPropagation(); handleRemoveMember(m.id); }} title="Remove">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Member detail on click */}
            {selectedMember && (
              <div className="member-detail">
                <div className="member-detail-head">
                  <div className="md-avatar" style={{ background:selectedMember.color }}>{selectedMember.name[0]}</div>
                  <div>
                    <div className="md-name">{selectedMember.name}</div>
                    <div className="md-role">{selectedMember.role}</div>
                  </div>
                </div>
                <div className="milestone-section">
                  <span className="milestone-title">Milestones</span>
                  <div className="milestone-row">
                    {milestoneLabels.map((lbl, i) => (
                      <button
                        key={lbl}
                        className={`milestone-btn ${selectedMember.milestones[i]?'done':''}`}
                        onClick={() => { toggleMilestone(selectedMember.id, i); setSel(prev => ({ ...prev, milestones: prev.milestones.map((v,j) => j===i?!v:v) })); }}
                        title={`Toggle ${lbl}`}
                      >
                        {selectedMember.milestones[i] ? <Check size={12} /> : lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Resources */}
          <div className="card glass-card-dark">
            <div className="card-head">
              <span className="card-title">System Resources</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>
            <div className="resources-list">
              {resources.map(r => (
                <div key={r.label} className="resource-row">
                  <span className="resource-label">{r.label}</span>
                  <div className="resource-bar-bg">
                    <div className="resource-bar" style={{ width:`${r.pct}%`, background:r.color, transition: 'width 1s ease-in-out' }} />
                  </div>
                  <span className="resource-pct" style={{ color:r.color, transition: 'color 1s ease-in-out' }}>{r.pct}%</span>
                </div>
              ))}
            </div>

            <div className="card-head" style={{ marginTop:12 }}>
              <span className="card-title">Project Status</span>
            </div>
            {[
              { name:'Nebula CRM',      pct:78, color:'#1a9fff' },
              { name:'Aethel Platform', pct:94, color:'#a78bfa' },
              { name:'Orion App',       pct:52, color:'#f59e0b' },
            ].map(p => (
              <div key={p.name} className="proj-status-row">
                <span className="proj-status-name">{p.name}</span>
                <div className="proj-status-bar-bg">
                  <div className="proj-status-bar" style={{ width:`${p.pct}%`, background:p.color }} />
                </div>
                <span className="proj-status-pct">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title={form.id ? "Edit Team Member" : "Add Team Member"}>
        <div className="modal-field">
          <label className="modal-label">Full Name *</label>
          <input className="modal-input" placeholder="e.g. John Smith"
            value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Role *</label>
          <input className="modal-input" placeholder="e.g. Frontend Dev"
            value={form.role} onChange={e => setForm({...form, role:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Current Workload: {form.workload}%</label>
          <input type="range" min="0" max="100" className="modal-range"
            value={form.workload} onChange={e => setForm({...form, workload:e.target.value})} />
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setAddModal(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleAddMember}>{form.id ? "Save Changes" : "Add Member"}</button>
        </div>
      </Modal>
    </Layout>
  );
}
