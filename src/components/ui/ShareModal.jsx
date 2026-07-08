import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Facebook, Twitter, Instagram, Mail, MessageCircle } from 'lucide-react';

/**
 * ShareModal — Custom share dialog replacing navigator.share().
 *
 * Renders via React Portal to document.body. Supports:
 * - Overlay click to close
 * - Escape key to close
 * - X close button
 * - Focus trap: Tab cycles between focusable elements
 * - framer-motion animation: fade overlay + scale-up card
 * - Body scroll lock while open
 * - 7 share targets: Copy Link, Facebook, X (Twitter), Instagram, TikTok, Email, Messenger
 * - URL display box with click-to-copy
 *
 * Structural template from ConfirmationModal.jsx.
 */

// Custom TikTok SVG icon (lucide-react does not have one)
const TikTokIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SHARE_TARGETS = [
  {
    key: 'copy',
    label: 'Copy Link',
    icon: Copy,
    action: 'clipboard',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    action: 'popup',
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    icon: Twitter,
    action: 'popup',
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    action: 'clipboard',
    toastMessage: 'Link copied! Share it via Instagram.',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: TikTokIcon,
    action: 'clipboard',
    toastMessage: 'Link copied! Share it via TikTok.',
  },
  {
    key: 'email',
    label: 'Email',
    icon: Mail,
    action: 'mailto',
    getUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
  {
    key: 'messenger',
    label: 'Messenger',
    icon: MessageCircle,
    action: 'clipboard',
    toastMessage: 'Link copied! Share it via Messenger.',
  },
];

export default function ShareModal({ isOpen, onClose, event, onToast }) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const firstButtonRef = useRef(null);
  const lastButtonRef = useRef(null);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = event?.title || 'Toast Wedding Fair';

  // Reset copied state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Focus trap: on open, auto-focus first share button
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key handler + focus trap
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap: Tab / Shift+Tab cycles between focusable elements
      if (e.key === 'Tab') {
        const focusable = [
          firstButtonRef.current,
          lastButtonRef.current,
          closeRef.current,
        ].filter(Boolean);

        if (focusable.length < 2) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const handleCopyLink = async (customMessage) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (onToast) {
        onToast(customMessage || 'Link copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (onToast) {
        onToast('Failed to copy link');
      }
    }
  };

  const handleShareAction = (target) => {
    switch (target.action) {
      case 'clipboard':
        handleCopyLink(target.toastMessage || undefined);
        break;
      case 'popup':
        window.open(
          target.getUrl(url, title),
          '_blank',
          'width=600,height=400',
        );
        break;
      case 'mailto':
        window.open(target.getUrl(url, title));
        break;
      default:
        break;
    }
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <motion.div
            className="relative w-[448px] max-w-[calc(100vw-32px)] bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-[0px_2px_4px_rgba(20,20,20,0.15)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 text-[#737373] hover:text-[#121212] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C55F61] focus-visible:ring-offset-2 rounded"
              aria-label="Close share dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2
              id="share-modal-title"
              className="font-satoshi font-bold text-[24px] leading-[32px] text-[#121212] pr-8"
            >
              Share This Event
            </h2>

            {/* Share target buttons — 2-column grid */}
            <div className="grid grid-cols-2 gap-3">
              {SHARE_TARGETS.map((target, index) => {
                const Icon = target.icon;
                const isFirst = index === 0;
                const isLast = index === SHARE_TARGETS.length - 1;

                return (
                  <button
                    key={target.key}
                    ref={isFirst ? firstButtonRef : isLast ? lastButtonRef : undefined}
                    onClick={() => handleShareAction(target)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#C55F61] text-[#C55F61] font-satoshi font-bold text-sm transition-all duration-200 hover:bg-[#C55F61] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C55F61] focus-visible:ring-offset-2"
                  >
                    <Icon className="w-4 h-4" />
                    {target.label}
                  </button>
                );
              })}
            </div>

            {/* URL display box */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleCopyLink()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCopyLink();
                }
              }}
              className="flex items-center gap-2 bg-[#F1F1F1] rounded-lg px-4 py-3 cursor-pointer hover:bg-[#E5E5E5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C55F61] focus-visible:ring-offset-2"
              aria-label="Click to copy event link"
            >
              <Copy className="w-4 h-4 text-[#737373] shrink-0" />
              <span className="text-sm text-[#606060] font-satoshi truncate flex-1 text-left">
                {copied ? 'Copied!' : url}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
