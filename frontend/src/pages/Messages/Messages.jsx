import { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { Search, Edit3, MoreHorizontal, Send, Smile, Paperclip, X } from 'lucide-react';
import './Messages.css';

const initChannels = {
  'design-feedback': {
    name: 'Design Feedback',
    channel: '#design-feedback',
    messages: [
      { id:1, sender:'Anna',  time:'7:39 PM', text:'Just uploaded the new Nebula CRM wireframes!', color:'#00e5ff' },
      { id:2, sender:'Ben',   time:'7:57 PM', text:"Awesome, I'll take a look now. Did you see the client comments?", color:'#1a9fff' },
      { id:3, sender:'Chloe', time:'7:38 PM', text:'Anna, can you check the color palette for the analytics page? 🎨', color:'#a78bfa' },
    ],
  },
  'general': {
    name: 'General',
    channel: '#general',
    messages: [
      { id:1, sender:'David', time:'9:00 AM', text:'Good morning team! 🌟', color:'#f59e0b' },
      { id:2, sender:'Emily', time:'9:05 AM', text:'Morning! Ready for the sprint review?', color:'#34d399' },
    ],
  },
};

const directMessages = [
  { id:'dm-anna',  name:'Anna',          snippet:'Recent snippet...', online:true,  color:'#00e5ff' },
  { id:'dm-david', name:'David',         snippet:'Recent snippet t...', online:false, color:'#f59e0b' },
  { id:'dm-mkt',   name:'Marketing Team',snippet:'Recent snippet...', online:true,  color:'#34d399', isGroup:true },
];

const groupAvatars = ['#00e5ff','#1a9fff','#a78bfa','#34d399'];
const emojis = ['😊','👍','🎉','🔥','✅','💡','🚀','⚡'];

export default function Messages() {
  const { toasts, addToast, removeToast } = useToast();
  const [activeChannel, setActiveChannel] = useState('design-feedback');
  const [channels, setChannels]           = useState(initChannels);
  const [input, setInput]                 = useState('');
  const [showEmoji, setShowEmoji]         = useState(false);
  const [composeOpen, setComposeOpen]     = useState(false);
  const [composeForm, setComposeForm]     = useState({ to:'', subject:'', body:'' });
  const [searchQuery, setSearchQuery]     = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const channel = channels[activeChannel] || { 
    name: directMessages.find(d => d.id === activeChannel)?.name || 'Direct Message', 
    channel: 'Direct Message', 
    messages: [] 
  };
  
  const filteredMsgs = (channel.messages || []).filter(m =>
    m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [channel.messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    const newMsg = { id: Date.now(), sender:'Devoryn', time:now, text, color:'#00e5ff', self:true };
    
    if (channels[activeChannel]) {
      setChannels(prev => ({
        ...prev,
        [activeChannel]: { ...prev[activeChannel], messages: [...prev[activeChannel].messages, newMsg] },
      }));
    } else {
      // Create new channel entry for DM if it doesn't exist
      setChannels(prev => ({
        ...prev,
        [activeChannel]: { name: directMessages.find(d => d.id === activeChannel)?.name || 'DM', channel: 'Direct Message', messages: [newMsg] }
      }));
    }
    
    setInput('');
    inputRef.current?.focus();
  };

  const handleDeleteMsg = (msgId) => {
    setChannels(prev => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        messages: prev[activeChannel].messages.filter(m => m.id !== msgId)
      }
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleComposeSubmit = () => {
    if (!composeForm.to || !composeForm.body) return;
    setComposeOpen(false);
    setComposeForm({ to:'', subject:'', body:'' });
  };

  return (
    <Layout title="Hi, Devoryn! 👋" subtitle="Welcome to your Workspace">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="messages-page">
        <div className="messages-title-row">
          <h2 className="page-title">Messages</h2>
          <div className="msg-title-actions">
            <div className="msg-search-box">
              <Search size={13} className="msg-search-icon" />
              <input id="input-search-msg" placeholder="Search messages..."
                className="msg-search-input" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button className="search-clear-btn" onClick={() => setSearchQuery('')}><X size={12} /></button>}
            </div>
            <button className="btn-compose" id="btn-compose" onClick={() => setComposeOpen(true)}>
              <Edit3 size={13} /> Compose
            </button>
          </div>
        </div>

        <div className="messages-grid">
          {/* Main chat */}
          <div className="msg-main glass-card-dark">
            <div className="chat-header">
              <div className="chat-header-left">
                <span className="chat-name">{channel.name}</span>
                <span className="chat-channel">{channel.channel}</span>
              </div>
              <div className="chat-header-right">
                <div className="chat-avatars">
                  {groupAvatars.map((c,i) => (
                    <div key={i} className="chat-avatar" style={{ background:c, marginLeft:i>0?-8:0 }}>{String.fromCharCode(65+i)}</div>
                  ))}
                  <MoreHorizontal size={14} className="card-more" style={{ marginLeft:6 }} />
                </div>
                {/* Channel switcher */}
                <div className="channel-switcher">
                  {Object.keys(channels).map(ch => (
                    <button key={ch} className={`ch-btn ${activeChannel===ch?'active':''}`}
                      onClick={() => setActiveChannel(ch)}>
                      #{channels[ch].name.toLowerCase().replace(' ','-')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {filteredMsgs.length === 0 ? (
                <div className="no-msgs">No messages yet. Start the conversation!</div>
              ) : filteredMsgs.map(m => (
                <div key={m.id} className={`chat-msg ${m.self ? 'self' : ''} msg-hover-wrap`}>
                  {!m.self && <div className="chat-msg-avatar" style={{ background:m.color }}>{m.sender[0]}</div>}
                  <div className="chat-msg-body">
                    {!m.self && (
                      <div className="chat-msg-meta">
                        <span className="chat-msg-sender">{m.sender}</span>
                        <span className="chat-msg-time">{m.time}</span>
                      </div>
                    )}
                    <div className="msg-text-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: m.self ? 'row-reverse' : 'row' }}>
                      <div className={`chat-msg-text ${m.self ? 'self-text' : ''}`}>{m.text}</div>
                      <button className="msg-delete-btn" onClick={() => handleDeleteMsg(m.id)} title="Delete message">
                        <X size={12} />
                      </button>
                    </div>
                    {m.self && <span className="chat-msg-time self-time">{m.time}</span>}
                  </div>
                  {m.self && <div className="chat-msg-avatar self-avatar">D</div>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="chat-input-area">
              {showEmoji && (
                <div className="emoji-picker">
                  {emojis.map(e => (
                    <button key={e} className="emoji-btn" onClick={() => { setInput(i => i+e); setShowEmoji(false); }}>{e}</button>
                  ))}
                </div>
              )}
              <div className="chat-input-row">
                <button className="chat-tool-btn" onClick={() => setShowEmoji(!showEmoji)} title="Emoji">
                  <Smile size={16} />
                </button>
                <button className="chat-tool-btn" title="Attach file" onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = () => addToast('File attached ready to send', 'info');
                  input.click();
                }}>
                  <Paperclip size={16} />
                </button>
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  id="input-chat-message"
                  placeholder={`Message ${channel.channel}...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className={`btn-send ${input.trim() ? 'active' : ''}`}
                  id="btn-send-message"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send size={15} />
                </button>
              </div>
              <span className="input-hint">Enter to send · Shift+Enter for new line</span>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="msg-sidebar">
            <div className="card glass-card-dark">
              <div className="card-head"><span className="card-title">My Direct Messages</span></div>
              {directMessages.map(dm => (
                <div key={dm.id} className={`dm-item ${activeChannel===dm.id?'dm-active':''}`}
                  onClick={() => setActiveChannel(dm.id)}>
                  <div className="dm-avatar-wrap">
                    <div className="dm-avatar" style={{ background:dm.color }}>{dm.name[0]}</div>
                    {dm.online && <span className="dm-online" />}
                  </div>
                  <div className="dm-info">
                    <span className="dm-name">{dm.name}</span>
                    <span className="dm-snippet">{dm.snippet}</span>
                  </div>
                  {dm.online && dm.id === 'dm-anna' && (
                    <div style={{ background: '#00e5ff', color: '#000', fontSize: '9px', fontWeight: 'bold', padding: '1px 5px', borderRadius: '10px', marginLeft: 'auto' }}>2</div>
                  )}
                </div>
              ))}
            </div>

            <div className="card glass-card-dark">
              <div className="card-head"><span className="card-title">Important Threads</span></div>
              {[
                { label:'Pinned Topics',    color:'#1a9fff' },
                { label:'Pinned Message...', color:'#a78bfa' },
                { label:'Pinned Pinned to...', color:'#f59e0b' },
              ].map(pt => (
                <div key={pt.label} className="pinned-item">
                  <span className="pin-icon" style={{ color:pt.color }}>◆</span>
                  <span className="pin-label">{pt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="New Message">
        <div className="modal-field">
          <label className="modal-label">To</label>
          <input className="modal-input" placeholder="Recipient name or email"
            value={composeForm.to} onChange={e => setComposeForm({...composeForm, to:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Subject</label>
          <input className="modal-input" placeholder="Optional subject"
            value={composeForm.subject} onChange={e => setComposeForm({...composeForm, subject:e.target.value})} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Message</label>
          <textarea className="modal-textarea" placeholder="Write your message..."
            value={composeForm.body} onChange={e => setComposeForm({...composeForm, body:e.target.value})} />
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setComposeOpen(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleComposeSubmit}
            disabled={!composeForm.to || !composeForm.body}>
            <Send size={13} /> Send
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
