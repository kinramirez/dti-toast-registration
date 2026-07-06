import React, { useState } from 'react';
import { X } from 'lucide-react';

const FALLBACK_IMAGE = '/dtilogo.png';

const ImageModal = ({ src, alt, onClose }) => {
  const [imgSrc, setImgSrc] = useState(src);

  if (!src) return null;

  return (
    <div
      className='fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300'
      onClick={onClose}
    >
      <button
        className='absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-110'
        onClick={onClose}
        aria-label='Close'
      >
        <X className='h-8 w-8' />
      </button>

      <div className='relative max-w-5xl max-h-full flex items-center justify-center'>
        <img
          src={imgSrc}
          alt={alt}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300'
        />
      </div>
    </div>
  );
};

export default ImageModal;
