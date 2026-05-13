import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Grid3X3, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import Modal from '../../components/Modal/Modal';
import { Toast } from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import './Login.css';

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.length > 2;
}

export default function Login() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [authError, setAuthError] = useState('');
  const [remember, setRemember] = useState(false);

  // Forgot password modal state
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = 'Email or username is required';
    if (!password.trim()) e.password = 'Password is required';
    if (password.length > 0 && password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1400));

    // Demo logic
    if (isSignUp) {
      addToast('Account created successfully!', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
      return;
    }

    if (password === 'wrong') {
      setAuthError('Invalid credentials. Please try again.');
      setLoading(false);
      return;
    }
    navigate('/dashboard');
  };

  const handleForgotSubmit = () => {
    if (!validateEmail(forgotEmail)) { addToast('Please enter a valid email', 'warning'); return; }
    setForgotModal(false);
    addToast('Password reset link sent to your email!', 'success');
  };

  const handleChange = (field, value) => {
    if (field === 'email')    setEmail(value);
    if (field === 'password') setPassword(value);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setAuthError('');
  };

  return (
    <div className="login-shell">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      {[...Array(10)].map((_, i) => (
        <div key={i} className="water-drop" style={{
          left: `${8 + i * 9}%`,
          animationDelay: `${i * 0.35}s`,
          animationDuration: `${2.8 + i * 0.25}s`,
        }} />
      ))}

      <div className="login-outer glass-card">
        <div className="login-logo">
          <Grid3X3 size={18} color="#00e5ff" />
          <span className="logo-text">D<span>E</span>VORYN</span>
        </div>

        <div className="login-card glass-card">
          <h2 className="login-title">{isSignUp ? 'Create an Account' : 'Please Log In'}</h2>
          <p className="login-subtitle">{isSignUp ? 'Join the Devoryn Workspace' : 'to your Devoryn Workspace'}</p>

          {authError && (
            <div className="auth-error">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="input-group">
              <User size={16} className="input-icon" />
              <input
                id="input-email"
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={e => handleChange('email', e.target.value)}
                className={`glass-input ${errors.email ? 'input-error' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}

            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                id="input-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => handleChange('password', e.target.value)}
                className={`glass-input ${errors.password ? 'input-error' : ''}`}
                disabled={loading}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}

            {!isSignUp && (
              <div className="remember-row">
                <label className="remember-label">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className={`btn-signin ${loading ? 'loading' : ''}`}
              id="btn-signin"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-inner">
                  <Loader2 size={16} className="spin" /> {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="login-links">
            {!isSignUp && <button className="link-btn" onClick={() => setForgotModal(true)}>Forgot Password?</button>}
            <span className="link-sep">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
              <button className="link-btn accent" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </span>
          </div>

          <p className="demo-hint">💡 Demo: any email + password (min 6 chars)</p>
        </div>
      </div>

      <Modal open={forgotModal} onClose={() => setForgotModal(false)} title="Reset Password">
        <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', marginBottom:12 }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <div className="modal-field">
          <label className="modal-label">Email Address</label>
          <div className="input-group" style={{ marginBottom:0 }}>
            <Mail size={16} className="input-icon" />
            <input className="glass-input" placeholder="name@example.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={() => setForgotModal(false)}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleForgotSubmit}>Send Link</button>
        </div>
      </Modal>
    </div>
  );
}
