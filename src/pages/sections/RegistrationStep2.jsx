import { User, Building2, Handshake, Check } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';

const STEPS = [
  { number: 1, label: 'Attendee Information' },
  { number: 2, label: 'Review & Submit' },
];

/**
 * RegistrationStep2 — Figma-compliant Review & Submit screen.
 *
 * Design spec §2.5–2.8, §4.3–4.8:
 * - Three review sections with icon badges (User, Building2, Handshake),
 *   section subtitles, and "✎ Edit" pill buttons that scroll to the
 *   corresponding section on Step 1.
 * - Label/value display pairs: 12px gray label above 14px black value,
 *   organized in 2-column grids.
 * - Consent + Submit panel: rose-tinted block containing consent checkbox
 *   and "Submit Registration →" gradient button.
 * - No "Back" button — navigation via "✎ Edit" pills and step indicator.
 *
 * Props:
 * @param {object} form - All form field values (including form.consent)
 * @param {function} onChange - Generic field change handler
 * @param {object} errors - Validation errors from merged registrationSchema
 * @param {object} touched - Per-field touched state
 * @param {function} onSubmit - Submit handler
 * @param {function} onEdit - Navigate back to Step 1 and scroll to section.
 *   Signature: (sectionName: 'basicInfo' | 'organization' | 'purposeOfVisit') => void
 * @param {boolean} isSubmitting - API call in progress
 * @param {string|null} submitError - Inline error banner text
 */
export default function RegistrationStep2({
  form,
  onChange,
  errors,
  touched,
  onSubmit,
  onEdit,
  isSubmitting,
  submitError,
}) {
  const fullName = `${form.firstName} ${form.lastName}`.trim();

  function handleConsentToggle() {
    onChange({
      target: {
        name: 'consent',
        value: !form.consent,
        type: 'checkbox',
        checked: !form.consent,
      },
    });
  }

  return (
    <div
      className='bg-white rounded-lg p-6 sm:p-10 lg:p-16 w-full font-satoshi'
      style={{
        boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)',
      }}
    >
      {/* ── Card Header ── */}
      <div className='flex flex-col items-center text-center mb-16'>
        <h1 className='font-cormorant text-[32px] font-bold text-brand-dark leading-tight mb-2'>
          Review Your Registration
        </h1>
        <p
          className='text-[20px] font-bold font-satoshi'
          style={{ color: '#C55F61' }}
        >
          Please review your details before submitting
        </p>
      </div>

      {/* ── Step Indicator ── */}
      <div className='mb-10'>
        <StepIndicator
          currentStep={2}
          steps={STEPS}
          onStepClick={(stepNum) => {
            if (stepNum === 1) onEdit();
          }}
        />
      </div>

      {/* ── Review Sections ── */}
      <div className='flex flex-col gap-[34px] mb-12'>
        {/* ── Section 1: Basic Information ── */}
        <section>
          {/* Section header */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-6 min-w-0 flex-1'>
              <div
                className='w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0'
                style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
                aria-hidden='true'
              >
                <User className='w-6 h-6' style={{ color: '#C55F61' }} />
              </div>
              <div className='flex flex-col'>
                <h3 className='font-satoshi text-[20px] font-bold text-brand-dark'>
                  Basic Information
                </h3>
                <p className='font-satoshi text-[12px] text-text-meta'>
                  Review your personal details that you have provided. Make sure
                  your name, contact number, email address, and other information
                  are accurate and up to date.
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => onEdit('basicInfo')}
              className='flex-shrink-0 ml-4 border border-[#C55F61] text-[#C55F61] hover:bg-[#C55F61]/10 transition-all rounded font-bold text-[12px] font-satoshi px-3 py-1 whitespace-nowrap'
              style={{ height: '28px' }}
              aria-label='Edit Basic Information'
            >
              ✎ Edit
            </button>
          </div>

          {/* Label/value grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-[70px] gap-y-6'>
            {/* Full Name — full-width */}
            <div className='md:col-span-2 flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Full Name
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {fullName || '—'}
              </span>
            </div>

            {/* Age / Gender — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Age
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.age || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Gender
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.gender || '—'}
              </span>
            </div>

            {/* Email Address / Mobile Number — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Email Address
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi break-all'>
                {form.email || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Mobile Number
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.phone ? `+63${form.phone}` : '—'}
              </span>
            </div>

            {/* Region / City — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Region
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.province || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                City
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.city || '—'}
              </span>
            </div>

            {/* Barangay — full-width */}
            <div className='md:col-span-2 flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Barangay
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.barangay || '—'}
              </span>
            </div>
          </div>
        </section>

        {/* ── Section 2: Organization/Company Information ── */}
        <section>
          {/* Section header */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-6'>
              <div
                className='w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0'
                style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
                aria-hidden='true'
              >
                <Building2 className='w-6 h-6' style={{ color: '#C55F61' }} />
              </div>
              <div className='flex flex-col'>
                <h3 className='font-satoshi text-[20px] font-bold text-brand-dark'>
                  Organization/Company Information
                </h3>
                <p className='font-satoshi text-[12px] text-text-meta'>
                  Confirm the organization or company details you have provided.
                  Please check that the company name and position.
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => onEdit('organization')}
              className='flex-shrink-0 ml-4 border border-[#C55F61] text-[#C55F61] hover:bg-[#C55F61]/10 transition-all rounded font-bold text-[12px] font-satoshi px-3 py-1 whitespace-nowrap'
              style={{ height: '28px' }}
              aria-label='Edit Organization/Company Information'
            >
              ✎ Edit
            </button>
          </div>

          {/* Label/value grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-[70px] gap-y-6'>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Company Name
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.company || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Job Position
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.position || '—'}
              </span>
            </div>
          </div>
        </section>

        {/* ── Section 3: Purpose of Visit ── */}
        <section>
          {/* Section header */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-6'>
              <div
                className='w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0'
                style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
                aria-hidden='true'
              >
                <Handshake className='w-6 h-6' style={{ color: '#C55F61' }} />
              </div>
              <div className='flex flex-col'>
                <h3 className='font-satoshi text-[20px] font-bold text-brand-dark'>
                  Purpose of Visit
                </h3>
                <p className='font-satoshi text-[12px] text-text-meta'>
                  Review the reason for your visit that you have selected or
                  described. Ensure it clearly reflects your intent for attending
                  the event
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={() => onEdit('purposeOfVisit')}
              className='flex-shrink-0 ml-4 border border-[#C55F61] text-[#C55F61] hover:bg-[#C55F61]/10 transition-all rounded font-bold text-[12px] font-satoshi px-3 py-1 whitespace-nowrap'
              style={{ height: '28px' }}
              aria-label='Edit Purpose of Visit'
            >
              ✎ Edit
            </button>
          </div>

          {/* Label/value grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-[70px] gap-y-6'>
            {/* Role / Event Date — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                My role in the upcoming occasion.
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.role || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                When is your event?
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.eventDate || '—'}
              </span>
            </div>

            {/* Occasion / Guests — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                What occasion are you planning for?
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.occasion || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                How many guests are you expecting for your event?
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.guests || '—'}
              </span>
            </div>

            {/* Conditional: occasionOther */}
            {form.occasion === 'Other' && (
              <div className='md:col-span-2 flex flex-col gap-1'>
                <span className='text-[12px] text-text-meta font-satoshi'>
                  Occasion (Other)
                </span>
                <span className='text-[14px] text-brand-dark font-satoshi'>
                  {form.occasionOther || '—'}
                </span>
              </div>
            )}

            {/* Budget / Suppliers — 2-col */}
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                How much is your budget for your event?
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.budget || '—'}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Which suppliers are you looking for? Tick all that you need.
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {(form.suppliers || []).join(', ') || '—'}
              </span>
            </div>

            {/* Conditional: suppliersOther */}
            {(form.suppliers || []).includes('Other') && (
              <div className='md:col-span-2 flex flex-col gap-1'>
                <span className='text-[12px] text-text-meta font-satoshi'>
                  Suppliers (Other)
                </span>
                <span className='text-[14px] text-brand-dark font-satoshi'>
                  {form.suppliersOther || '—'}
                </span>
              </div>
            )}

            {/* Specific Suppliers — full-width */}
            <div className='md:col-span-2 flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Any specific suppliers you want to get major deals from?
              </span>
              <span className='text-[14px] text-brand-dark font-satoshi'>
                {form.specificSuppliers || '—'}
              </span>
            </div>

            {/* Lumi Candles — full-width (radio-derived, use #434343) */}
            <div className='md:col-span-2 flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                Would you like to receive discounts & promos from Lumi Candles?
              </span>
              <span
                className='text-[14px] font-satoshi'
                style={{ color: '#434343' }}
              >
                {form.lumiPromos || '—'}
              </span>
            </div>

            {/* Discovery — full-width (radio-derived, use #434343) */}
            <div className='md:col-span-2 flex flex-col gap-1'>
              <span className='text-[12px] text-text-meta font-satoshi'>
                How did you hear about the Toast Wedding Fair?
              </span>
              <span
                className='text-[14px] font-satoshi'
                style={{ color: '#434343' }}
              >
                {form.discoveryChannel || '—'}
              </span>
            </div>

            {/* Conditional: discoveryOther */}
            {form.discoveryChannel === 'Other' && (
              <div className='md:col-span-2 flex flex-col gap-1'>
                <span className='text-[12px] text-text-meta font-satoshi'>
                  Discovery (Other)
                </span>
                <span className='text-[14px] text-brand-dark font-satoshi'>
                  {form.discoveryOther || '—'}
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Submit Error Banner ── */}
      {submitError && (
        <div className='max-w-[760px] mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm text-center'>
          {submitError}
        </div>
      )}

      {/* ── Consent + Submit Panel ── */}
      <form onSubmit={onSubmit}>
        <div
          className='rounded-lg p-6 sm:p-8 flex flex-col items-center'
          style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
        >
          {/* Consent checkbox + text */}
          <div className='flex flex-col items-start w-full mb-6'>
            <div className='flex items-start gap-3'>
              <button
                type='button'
                role='checkbox'
                aria-checked={form.consent}
                onClick={handleConsentToggle}
                className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1 mt-0.5 ${
                  form.consent
                    ? 'bg-[#C55F61] border-[#C55F61]'
                    : 'border-[#ACACAC] bg-white'
                }`}
              >
                {form.consent && <Check className='w-3 h-3 text-white' />}
              </button>
              <span className='text-[12px] text-brand-dark font-satoshi leading-relaxed'>
                I agree to receive updates, reminders, and promotional
                communications from AFT Corp. through email, SMS, or phone. I
                understand that I can unsubscribe at any time.
              </span>
            </div>
            {/* Consent error */}
            {touched.consent && errors.consent && (
              <p className='text-[11px] text-red-500 mt-0.5 ml-7'>
                {errors.consent}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-lg font-bold text-[20px] text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-6'
            style={{
              minWidth: '228px',
              height: '48px',
              background:
                'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration →'}
          </button>
        </div>
      </form>
    </div>
  );
}
