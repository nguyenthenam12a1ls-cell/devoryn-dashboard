import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const icons = {
  success: <CheckCircle size={16} />,
  error:   <XCircle    size={16} />,
  warning: <AlertCircle size={16}/>,
  info:    <AlertCircle size={16}/>,
};

export function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
