import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, visible, onClose, duration = 3000 }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setExiting(false);
      return;
    }

    setExiting(false);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible && !exiting) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white text-[#121212] px-5 py-4 rounded-lg shadow-lg border border-[#C55F61]/20 max-w-sm ${
        exiting ? 'toast-exit' : 'toast-enter'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="w-5 h-5 rounded-full bg-[#C55F61] flex items-center justify-center shrink-0">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="text-sm font-medium font-satoshi flex-1">{message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onClose?.(), 300);
        }}
        className="text-[#ACACAC] hover:text-[#737373] transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
