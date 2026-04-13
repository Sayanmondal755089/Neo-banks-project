import { useState, useEffect } from 'react';

export default function ToastAlert() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };

    window.addEventListener('toast_alert', handleToast);
    return () => window.removeEventListener('toast_alert', handleToast);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`glass-card p-4 flex items-center gap-3 shadow-lg transform transition-all animate-slide-in-right ${toast.type === 'danger' ? 'border-red-500 shadow-red-500/20' : ''}`} style={{ borderColor: toast.type === 'danger' ? 'var(--accent-red)' : '' }}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ backgroundColor: toast.type === 'danger' ? 'var(--accent-red)' : 'var(--accent-cyan)' }}></div>
          <p className="font-medium text-sm">{toast.msg}</p>
        </div>
      ))}
    </div>
  );
}
