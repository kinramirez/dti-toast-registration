import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * LegalModal — Unified modal for Privacy Policy and Terms of Use.
 *
 * Renders via React Portal to document.body. Supports:
 * - Overlay click to close
 * - Escape key to close
 * - X close button
 * - Focus trap: Tab cycles between focusable elements
 * - framer-motion animation: fade overlay + scale-up card
 * - Body scroll lock while open
 *
 * Structural template from ConfirmationModal.jsx / ShareModal.jsx.
 *
 * Props:
 * - isOpen (boolean)
 * - onClose (function)
 * - type ('privacy' | 'terms')
 */

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    body: 'We are putting the finishing touches on our legal pages. Our comprehensive Privacy Policy and Terms of Use will be available shortly. Thank you for your patience!',
  },
  terms: {
    title: 'Terms of Use',
    body: 'We are putting the finishing touches on our legal pages. Our comprehensive Privacy Policy and Terms of Use will be available shortly. Thank you for your patience!',
  },
};

export default function LegalModal({ isOpen, onClose, type = 'privacy', triggerRef }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);

  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.privacy;

  // Focus trap: on open, auto-focus close button
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Helper: query all tabbable elements within the modal card
  const getTabbableElements = useCallback(() => {
    if (!cardRef.current) return [];
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(cardRef.current.querySelectorAll(selector)).filter(
      (el) => !el.closest('[aria-hidden="true"]') && el.offsetParent !== null,
    );
  }, []);

  // Escape key handler + focus trap
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap: Tab / Shift+Tab cycles between all tabbable elements
      if (e.key === 'Tab') {
        const focusable = getTabbableElements();

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
    [isOpen, onClose, getTabbableElements],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Return focus to trigger element on close
  useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

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
          aria-labelledby="legal-modal-title"
          aria-describedby="legal-modal-body"
        >
          <motion.div
            ref={cardRef}
            className="relative w-[448px] max-w-[calc(100vw-32px)] bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-[0px_2px_4px_rgba(20,20,20,0.15)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 text-[#737373] hover:text-[#121212] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C55F61] focus-visible:ring-offset-2 rounded"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2
              id="legal-modal-title"
              className="font-satoshi font-bold text-[24px] leading-[32px] text-[#121212] pr-8"
            >
              {content.title}
            </h2>

            {/* Body */}
            <p
              id="legal-modal-body"
              className="font-satoshi font-medium text-base leading-[22px] text-[#606060]"
            >
              {content.body}
            </p>

            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
                style={{
                  background:
                    'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.boxShadow =
                    '0px 4px 12px rgba(197, 95, 97, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
