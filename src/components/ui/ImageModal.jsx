import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGE = '/dtilogo.png';

const ImageModal = ({ src, images, alt, onClose }) => {
  const hasCarousel = Array.isArray(images) && images.length > 1;
  const carouselImages = hasCarousel ? images : [src];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [imgLoading, setImgLoading] = useState({});
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const announcerRef = useRef(null);

  const totalImages = carouselImages.length;
  const currentSrc = carouselImages[currentIndex] || src;

  const goTo = useCallback(
    (index) => {
      const nextIndex = (index + totalImages) % totalImages;
      // Mark the target image as loading
      setImgLoading((prev) => ({ ...prev, [nextIndex]: true }));
      setCurrentIndex(nextIndex);
    },
    [totalImages],
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % totalImages;
      setImgLoading((l) => ({ ...l, [next]: true }));
      return next;
    });
  }, [totalImages]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + totalImages) % totalImages;
      setImgLoading((l) => ({ ...l, [next]: true }));
      return next;
    });
  }, [totalImages]);

  // Announce slide change for screen readers
  useEffect(() => {
    if (hasCarousel && announcerRef.current) {
      announcerRef.current.textContent = `Image ${currentIndex + 1} of ${totalImages}`;
    }
  }, [currentIndex, totalImages, hasCarousel]);

  // Focus trapping
  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = () =>
      Array.from(modal.querySelectorAll(focusableSelector)).filter(
        (el) => !el.disabled && el.offsetParent !== null,
      );

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (!hasCarousel) return;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        } else {
          e.preventDefault();
          goNext();
        }
        return;
      }

      if (e.key === 'Tab') {
        const focusable = focusableElements();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first focusable element in modal
    const focusable = focusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to trigger element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose, hasCarousel, goNext, goPrev]);

  const handleImageError = (index) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (imgSrc, index) => {
    if (imgErrors[index]) return FALLBACK_IMAGE;
    return imgSrc || FALLBACK_IMAGE;
  };

  if (!src && !hasCarousel) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image preview'}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        // Close only when clicking the backdrop, not the image or controls
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Live region announcer for screen readers */}
      {hasCarousel && (
        <div
          ref={announcerRef}
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          Image 1 of {totalImages}
        </div>
      )}

      <button
        className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-110"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Previous button */}
      {hasCarousel && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-110"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      <div className="relative max-w-5xl max-h-full flex items-center justify-center">
        {/* Loading spinner overlay */}
        {imgLoading[currentIndex] && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
          </div>
        )}
        <img
          src={getImageSrc(currentSrc, currentIndex)}
          alt={alt || ''}
          onLoad={() => setImgLoading((prev) => ({ ...prev, [currentIndex]: false }))}
          onError={() => {
            setImgLoading((prev) => ({ ...prev, [currentIndex]: false }));
            handleImageError(currentIndex);
          }}
          className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 ${
            imgLoading[currentIndex] ? 'opacity-30' : ''
          }`}
        />
      </div>

      {/* Next button */}
      {hasCarousel && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-110"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Dot indicators */}
      {hasCarousel && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-110">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageModal;
