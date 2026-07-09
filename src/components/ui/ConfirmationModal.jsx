import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ConfirmationModal — Reusable confirmation dialog.
 *
 * Renders via React Portal to document.body. Supports:
 * - Overlay click to close (calls onCancel)
 * - Escape key to close (calls onCancel)
 * - Focus trap: Tab cycles between Cancel and Continue buttons
 * - framer-motion animation: fade overlay + scale-up card
 *
 * Design spec (Section 9):
 * - Card: w-[408px], bg-white, rounded-2xl, p-8, shadow
 * - Icon: 32x32px, bg-[#1877F2], rounded
 * - Title: 24px Bold, #121212
 * - Body: 20px Medium, #808080, single <p>
 * - Cancel: bg-[#ED1C24], Continue: bg-[#1877F2]
 * - Mobile: max-w-[calc(100vw-32px)]
 */
export default function ConfirmationModal({
  isOpen,
  onCancel,
  onContinue,
  title,
  body,
  cancelLabel = 'Cancel',
  continueLabel = 'Continue',
  icon,
}) {
  const cancelRef = useRef(null);
  const continueRef = useRef(null);
  const overlayRef = useRef(null);

  // Focus trap: on open, focus Cancel button
  useEffect(() => {
    if (isOpen) {
      // Small delay to let the animation start before focusing
      const timer = setTimeout(() => {
        cancelRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      // Focus trap: Tab / Shift+Tab cycles between Cancel and Continue
      if (e.key === 'Tab') {
        const focusable = [cancelRef.current, continueRef.current].filter(Boolean);
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
    [isOpen, onCancel],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

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
          className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onCancel();
          }}
          role='dialog'
          aria-modal='true'
          aria-labelledby='confirm-modal-title'
          aria-describedby='confirm-modal-body'
        >
          <motion.div
            className='w-[408px] max-w-[calc(100vw-32px)] bg-white rounded-2xl p-8 flex flex-col gap-4 shadow-[0px_2px_4px_rgba(20,20,20,0.15)]'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Icon */}
            {icon && (
              <div className='flex items-center justify-center w-8 h-8 rounded bg-[#1877F2] text-white'>
                {icon}
              </div>
            )}

            {/* Title */}
            <h2
              id='confirm-modal-title'
              className='text-[24px] font-bold text-[#121212]'
            >
              {title}
            </h2>

            {/* Body */}
            <p
              id='confirm-modal-body'
              className='text-[20px] font-medium text-[#808080]'
            >
              {body}
            </p>

            {/* Buttons */}
            <div className='self-end flex flex-row gap-4 mt-2'>
              <button
                ref={cancelRef}
                type='button'
                onClick={onCancel}
                className='bg-[#ED1C24] text-white text-[20px] font-bold px-3 py-2 rounded hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#ED1C24] focus:ring-offset-2'
              >
                {cancelLabel}
              </button>
              <button
                ref={continueRef}
                type='button'
                onClick={onContinue}
                className='bg-[#1877F2] text-white text-[20px] font-bold px-3 py-2 rounded hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2'
              >
                {continueLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
