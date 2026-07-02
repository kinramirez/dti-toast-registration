import { Shield } from 'lucide-react';

/**
 * TrustFooterStrip — Privacy/security reassurance card below the form.
 *
 * Design spec §2.9, §4.10:
 * - Separate white card, full-width within content area, 118px tall
 * - Shadow: 0px 9px 4px 1px rgba(18,18,18,0.05)
 * - Left: Shield icon + "Your Information is safe with us." + subtitle
 * - Right: Shield icon (representing lock) + "Secure Registration"
 *
 * Icons: lucide Shield for both positions.
 */
export default function TrustFooterStrip() {
  return (
    <div
      className='w-full bg-white rounded-lg flex items-center justify-between px-8 py-6 font-satoshi'
      style={{
        boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)',
        minHeight: '118px',
      }}
    >
      {/* Left side: Shield + privacy text */}
      <div className='flex items-center gap-4'>
        <div
          className='w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0'
          style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
          aria-hidden='true'
        >
          <Shield className='w-6 h-6' style={{ color: '#C55F61' }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-[16px] font-bold text-brand-dark'>
            Your Information is safe with us.
          </span>
          <span className='text-[14px] text-neutral-gray'>
            We value our privacy, Your information will only be used for this
            event registration
          </span>
        </div>
      </div>

      {/* Right side: Lock icon + "Secure Registration" */}
      <div className='flex items-center gap-3'>
        <Shield
          className='w-5 h-5'
          style={{ color: '#C55F61' }}
          aria-hidden='true'
        />
        <span className='text-[16px] font-bold text-brand-dark'>
          Secure Registration
        </span>
      </div>
    </div>
  );
}
