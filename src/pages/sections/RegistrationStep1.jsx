import { ArrowRight } from 'lucide-react';

import StepIndicator from '@/components/ui/StepIndicator';

import BasicInfoSection from './BasicInfoSection';
import OrganizationSection from './OrganizationSection';
import PurposeOfVisitSection from './PurposeOfVisitSection';

const STEPS = [
  { number: 1, label: 'Attendee Information' },
  { number: 2, label: 'Review & Submit' },
];

/**
 * RegistrationStep1 — Consolidated data-entry form with all 24 fields.
 *
 * Design spec §2.3–2.8, §4.3–4.9:
 * - Form card: 977px, white, rounded-lg, shadow
 * - Card header: Cormorant Garamond 32px title + rose 20px subtitle
 * - Step indicator: "Attendee Information" / "Review & Submit"
 * - Three sub-sections with icon badges: BasicInfo, Organization, PurposeOfVisit
 * - "Save & Continue →" gradient button (205×48px)
 *
 * Props:
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
 * @param {object} errors - Merged validation errors (all 24 fields)
 * @param {object} touched - Per-field touched state
 * @param {function} onNext - "Save & Continue" handler (validates → setStep(2))
 * @param {string} regionCode - Current region code for cascading
 * @param {function} setRegionCode - Region change handler
 * @param {string} cityCode - Current city code
 * @param {function} setCityCode - City change handler
 * @param {string} barangayCode - Current barangay code
 * @param {function} setBarangayCode - Barangay change handler
 * @param {array} regionOptions - Async-loaded region list
 * @param {array} cityOptions - Async-loaded city list
 * @param {array} barangayOptions - Async-loaded barangay list
 * @param {string|null} addressError - Address loading error
 */
export default function RegistrationStep1({
  form,
  onChange,
  errors,
  touched,
  onNext,
  regionCode,
  setRegionCode,
  cityCode,
  setCityCode,
  barangayCode,
  setBarangayCode,
  regionOptions,
  cityOptions,
  barangayOptions,
  addressError,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onNext();
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
          Pre-Register for FREE Entrance - Toast Wedding Fair
        </h1>
        <p
          className='text-[20px] font-bold font-satoshi'
          style={{ color: '#C55F61' }}
        >
          August 8 - 9, 2026 - SMX Convention Center Manila
        </p>
      </div>

      {/* ── Step Indicator ── */}
      <div className='mb-10'>
        <StepIndicator currentStep={1} steps={STEPS} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Section 1: Basic Information ── */}
        <BasicInfoSection
          form={form}
          onChange={onChange}
          errors={errors}
          touched={touched}
          regionCode={regionCode}
          setRegionCode={setRegionCode}
          cityCode={cityCode}
          setCityCode={setCityCode}
          barangayCode={barangayCode}
          setBarangayCode={setBarangayCode}
          regionOptions={regionOptions}
          cityOptions={cityOptions}
          barangayOptions={barangayOptions}
          addressError={addressError}
        />

        {/* ── Section 2: Organization/Company Information ── */}
        <OrganizationSection
          form={form}
          onChange={onChange}
        />

        {/* ── Section 3: Purpose of Visit ── */}
        <PurposeOfVisitSection
          form={form}
          onChange={onChange}
          errors={errors}
          touched={touched}
        />

        {/* ── Save & Continue Button ── */}
        <div className='flex justify-center mt-8'>
          <button
            type='submit'
            className='w-[205px] h-[48px] rounded-lg font-bold text-[16px] text-white shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2'
            style={{
              background:
                'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            Save & Continue
            <ArrowRight className='w-4 h-4' aria-hidden='true' />
          </button>
        </div>
      </form>
    </div>
  );
}
