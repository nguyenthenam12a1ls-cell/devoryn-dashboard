import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { MoreHorizontal, Settings, Plus, Trash2, Check } from 'lucide-react';
import './SettingsPage.css';

const initSessions = [
  { id:1, name:'iPhone 13',           icon:'📱', current:false },
  { id:2, name:'MacBook Pro (Work)',   icon:'💻', current:true  },
  { id:3, name:'iPhonook Pro',        icon:'📱', current:false },
  { id:4, name:'MacBook Pro (Personal)', icon:'💻', current:false },
];

const initTeam = [
  { id:1, name:'Anna',  role:'Admin',  color:'#00e5ff' },
  { id:2, name:'Ben',   role:'Editor', color:'#1a9fff' },
  { id:3, name:'Chloe', role:'Editor', color:'#a78bfa' },
  { id:4, name:'David', role:'Viewer', color:'#f59e0b' },
  { id:5, name:'Emily', role:'Viewer', color:'#34d399' },
];

function RainbowArc({ count, max }) {
  const arcs = [
    { color:'#ef4444', r:44, sw:6 },
    { color:'#f59e0b', r:36, sw:6 },
    { color:'#22d3ee', r:28, sw:6 },
    { color:'#1a9fff', r:20, sw:6 },
  ];
  return (
    <svg viewBox="0 0 100 60" style={{ width:100, height:60 }}>
      {arcs.map((a,i) => {
        const circ = 2*Math.PI*a.r, half=circ/2;
        return (
          <circle key={i} cx="50" cy="55" r={a.r} fill="none"
            stroke={a.color} strokeWidth={a.sw}
            strokeDasharray={`${half} ${circ}`} strokeLinecap="round"
            style={{ transform:'rotate(180deg)', transformOrigin:'50px 55px' }} />
        );
      })}
      <text x="50" y="58" fontSize="9" fill="rgba(255,255,255,0.6)" textAnchor="middle">
        {count}/{max}
      </text>
    </svg>
  );
}

export default function SettingsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [twoFA, setTwoFA]         = useState(false);
  const [sessions, setSessions]   = useState(initSessions);
  const [team, setTeam]           = useState(initTeam);
  const [inviteModal, setInviteModal] = useState(false);
  
  // New States
  const [profileForm, setProfileForm] = useState({ name: 'Devoryn', email: 'admin@devoryn.com', role: 'Administrator' });
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, slack: false, marketing: false });
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'GitHub', desc: 'Sync repositories and issues', connected: true },
    { id: 2, name: 'Slack', desc: 'Send notifications to channels', connected: false },
    { id: 3, name: 'Google Drive', desc: 'Attach files from Drive', connected: true },
    { id: 4, name: 'Jira', desc: 'Link commits to issues', connected: false }
  ]);

  const [pwModal, setPwModal]     = useState(false);
  const [pw, setPw]               = useState({ current:'', newPw:'', confirm:'' });
  const [pwErr, setPwErr]         = useState('');
  const [inviteName, setInvName]  = useState('');
  const [inviteRole, setInvRole]  = useState('Viewer');
  const [saved, setSaved]         = useState(false);

  const handleRevoke = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    addToast('Session revoked', 'warning');
  };

  const handleRoleChange = (id, role) => {
    setTeam(prev => prev.map(m => m.id===id ? {...m, role} : m));
    addToast('Role updated', 'success');
  };

  const handlePwSubmit = () => {
    if (!pw.current) { setPwErr('Current password required'); return; }
    if (pw.newPw.length < 6) { setPwErr('New password must be ≥ 6 chars'); return; }
    if (pw.newPw !== pw.confirm) { setPwErr('Passwords do not match'); return; }
    setPwModal(false); setPw({ current:'', newPw:'', confirm:'' }); setPwErr('');
    addToast('Password updated successfully!', 'success');
  };

  const handleInvite = () => {
    if (!inviteName.trim()) { addToast('Name is required', 'warning'); return; }
    const colors = ['#00e5ff','#1a9fff','#a78bfa','#f59e0b','#34d399'];
    setTeam(prev => [...prev, { id:Date.now(), name:inviteName, role:inviteRole, color:colors[prev.length%colors.length] }]);
    setInviteModal(false); setInvName(''); addToast(`${inviteName} invited as ${inviteRole}!`, 'success');
  };

  const handleSave = () => {
    setSaved(true);
    addToast('Settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Workspace Settings" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="settings-page">
        <div className="page-title-row">
          <h2 className="page-title">Devoryn Workspace</h2>
          <div className="title-actions">
            <button className={`btn-save-settings ${saved?'saved':''}`} onClick={handleSave}>
              {saved ? <><Check size={13}/> Saved!</> : 'Save Changes'}
            </button>
            <button className="icon-sm"><Settings size={14} /></button>
          </div>
        </div>

        <div className="settings-grid">
          {/* Account & Security */}
          <div className="card glass-card-dark">
            <div className="card-head">
              <span className="card-title">Account &amp; Security</span>
              <MoreHorizontal size={15} className="card-more" />
            </div>

            <button className="settings-btn" id="btn-change-password" onClick={() => setPwModal(true)}>
              <span>🔑 Change Password</span>
              <span className="settings-btn-arrow">›</span>
            </button>

            <div className="settings-toggle-row">
              <span>🔒 Two-Factor Authentication</span>
              <span className={`status-active ${twoFA?'':'inactive'}`}>{twoFA?'(Active)':'(Inactive)'}</span>
              <div
                className={`toggle-switch ${twoFA?'active':''}`}
                onClick={() => { setTwoFA(!twoFA); addToast(`2FA ${!twoFA?'enabled':'disabled'}`, !twoFA?'success':'warning'); }}
              />
            </div>

            <div className="card-head" style={{ marginTop:6 }}>
              <span className="card-title">Session Management</span>
              <span className="sessions-count">{sessions.length} active</span>
            </div>
            <div className="sessions-list">
              {sessions.map(s => (
                <div key={s.id} className="session-item">
                  <span className="session-icon">{s.icon}</span>
                  <span className="session-name">{s.name}</span>
                  {s.current && <span className="session-current">Current</span>}
                  {!s.current && (
                    <button className="session-revoke" onClick={() => handleRevoke(s.id)} title="Revoke">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="rainbow-row">
              <div className="session-legend">
                <div className="session-legend-item"><span className="leg-dot" style={{ background:'#22d3ee' }} /> Active Sessions ({sessions.length}/5)</div>
                <div className="session-legend-item"><span className="leg-dot" style={{ background:'#f59e0b' }} /> Last Password Change</div>
                <div className="session-legend-item"><span className="leg-dot" style={{ background:'#a78bfa' }} /> Last Password Change</div>
              </div>
              <RainbowArc count={sessions.length} max={5} />
            </div>
            <button className="btn-recovery" id="btn-recovery-codes" onClick={() => addToast('Recovery codes sent to email!', 'info')}>
              Recovery Codes
            </button>
          </div>

          {/* Right column */}
          <div className="settings-right">
            <div className="card glass-card-dark">
              <div className="card-head">
                <span className="card-title">Profile Settings</span>
              </div>
              <div className="profile-edit-form">
                <div className="set-field">
                  <label>Display Name</label>
                  <input className="glass-input" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name:e.target.value})} />
                </div>
                <div className="set-field">
                  <label>Email Address</label>
                  <input className="glass-input" type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email:e.target.value})} />
                </div>
                <div className="set-field">
                  <label>Role</label>
                  <input className="glass-input" value={profileForm.role} disabled />
                </div>
              </div>

              <div className="card-head" style={{ marginTop: '20px' }}>
                <span className="card-title">Notification Preferences</span>
              </div>
              <div className="notif-prefs-list">
                {Object.entries(notifPrefs).map(([key, val]) => (
                  <div key={key} className="set-row">
                    <div>
                      <span className="set-row-title" style={{textTransform:'capitalize'}}>{key} Notifications</span>
                      <span className="set-row-desc">Receive updates via {key}.</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={val} onChange={(e) => {
                        setNotifPrefs({...notifPrefs, [key]: e.target.checked});
                        addToast(`Preference updated`, 'info');
                      }} />
                      <span className="slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Access */}
            <div className="card glass-card-dark">
              <div className="card-head">
                <span className="card-title">Workspace Team Access</span>
                <MoreHorizontal size={15} className="card-more" />
              </div>
              <div className="team-access-header"><span>Team</span><span>Role</span></div>
              {team.map(ta => (
                <div key={ta.id} className="team-access-row">
                  <div className="ta-avatar" style={{ background:ta.color }}>{ta.name[0]}</div>
                  <span className="ta-name">{ta.name}</span>
                  <select
                    className="ta-role-select-native"
                    value={ta.role}
                    onChange={e => handleRoleChange(ta.id, e.target.value)}
                  >
                    {['Admin','Editor','Viewer'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              ))}
              <button className="btn-invite" id="btn-invite-member" onClick={() => setInviteModal(true)}>
                <Plus size={13} /> Invite New Member
              </button>
            </div>
          </div>
        </div>

        {/* System Connections */}
        <div className="sys-connections glass-card-dark">
          <div className="card-head">
            <span className="card-title">Connected Services</span>
            <MoreHorizontal size={15} className="card-more" />
          </div>
          <div className="connections-row">
            {integrations.map(integ => (
              <div key={integ.id} className="connection-item">
                <div className="conn-icon" style={{ background: integ.connected ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)', color: integ.connected ? '#00e5ff' : '#fff' }}>
                  {integ.name[0]}
                </div>
                <div className="conn-info">
                  <span className="conn-name">{integ.name}</span>
                  <span className="conn-sub" style={{ color: integ.connected ? '#22d3ee' : 'rgba(255,255,255,0.4)' }}>
                    {integ.connected ? '✓ Connected' : 'Not connected'}
                  </span>
                </div>
                {integ.connected ? (
                  <button className="btn-sync-now" onClick={() => {
                    setIntegrations(prev => prev.map(i => i.id === integ.id ? {...i, connected: false} : i));
                    addToast(`${integ.name} disconnected`, 'info');
                  }} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                    Remove
                  </button>
                ) : (
                  <button className="btn-sync-now" onClick={() => {
                    setIntegrations(prev => prev.map(i => i.id === integ.id ? {...i, connected: true} : i));
                    addToast(`${integ.name} connected`, 'success');
                  }}>
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal open={pwModal} onClose={() => { setPwModal(false); setPwErr(''); }} title="Change Password">
        {pwErr && <div style={{ color:'#ef4444', fontSize:'12px', marginBottom:10, padding:'8px 10px', background:'rgba(239,68,68,0.1)', borderRadius:7 }}>{pwErr}</div>}
        <div className="modal-field">
          <label className="modal-label">Current Password</label>
          <input className="modal-input" type="password" placeholder="••••••••" value={pw.current} onChange={e => setPw({...pw, current:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">New Password</label>
          <input className="modal-input" type="password" placeholder="Min. 6 characters" value={pw.newPw} onChange={e => setPw({...pw, newPw:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Confirm New Password</label>
          <input className="modal-input" type="password" placeholder="Repeat new password" value={pw.confirm} onChange={e => setPw({...pw, confirm:e.target.value})} />
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setPwModal(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handlePwSubmit}>Update Password</button>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite New Member">
        <div className="modal-field">
          <label className="modal-label">Name</label>
          <input className="modal-input" placeholder="Full name" value={inviteName} onChange={e => setInvName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Role</label>
          <select className="modal-select" value={inviteRole} onChange={e => setInvRole(e.target.value)}>
            {['Admin','Editor','Viewer'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setInviteModal(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleInvite}>Send Invite</button>
        </div>
      </Modal>
    </Layout>
  );
}
