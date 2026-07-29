import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import flowerBg from '@/assets/flower_bg.png';

/**
 * RegistrationHero — Hero band for the registration page.
 *
 * Design spec §4.2:
 * - Full-width, 631px tall
 * - Background: floral photo (right-aligned) + gradient overlay (#FFF6F3 → transparent)
 * - Breadcrumb: "‹ Back to Event" → /event/:eventId
 * - Headline: "Let's get you" — Cormorant Garamond 700, 64px
 * - Script accent: "*Registered*" — Corinthia 400, 96px, #C55F61
 * - Body: Satoshi 500, 20px, #434343
 *
 * @param {string} eventId - The event GUID for the back link target
 */
export default function RegistrationHero({ eventId }) {
  return (
    <section
      className='relative w-full h-[631px] flex items-center overflow-hidden'
      style={{ backgroundColor: '#FFF6F3' }}
    >
      {/* Floral background image — right-aligned */}
      <img
        src={flowerBg}
        alt=''
        aria-hidden='true'
        className='absolute right-0 top-0 h-full w-auto object-cover object-right'
      />

      {/* Gradient overlay: #FFF6F3 → transparent (left to right) */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(to right, #FFF6F3 0%, #FFF6F3 35%, rgba(255,246,243,0.6) 60%, transparent 100%)',
        }}
        aria-hidden='true'
      />

      {/* Text content */}
      <div className='relative z-10 w-full max-w-container mx-auto px-8'>
        {/* Breadcrumb */}
        <Link
          to={eventId ? `/event/${eventId}` : '/event'}
          className='inline-flex items-center gap-1.5 text-[#808080] hover:text-[#C55F61] transition-colors font-satoshi text-[16px] font-medium mb-8'
        >
          <ArrowLeft className='w-4 h-4' aria-hidden='true' />
          Back to Event
        </Link>

        {/* Headline + Script accent */}
        <div className='max-w-[635px]'>
          <h1 className='font-cormorant text-[64px] font-bold leading-[1.1] text-brand-dark'>
            Let's get you
          </h1>
          <span
            className='font-corinthia text-[96px] leading-[1.1] block'
            style={{ color: '#C55F61' }}
          >
            Registered
          </span>
          <p className='font-satoshi text-[20px] font-medium text-text-dark mt-4 leading-relaxed'>
            Fill out the form below so we can personalize your Toast Wedding
            experience
          </p>
        </div>
      </div>
    </section>
  );
}
