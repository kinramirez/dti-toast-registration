import { ArrowRight } from 'lucide-react';

import StepIndicator from '@/components/ui/StepIndicator';
import { formatDate } from '@/lib/utils/eventUtils';

import BasicInfoSection from './BasicInfoSection';
import OrganizationSection from './OrganizationSection';
import PurposeOfVisitSection from './PurposeOfVisitSection';

const STEPS = [
  { number: 1, label: 'Attendee Information' },
  { number: 2, label: 'Review & Submit' },
];

/**
 * RegistrationStep1 — Consolidated data-entry form with all fields.
 *
 * Card header title/date/venue is bound directly to the `event` prop
 * (event.title / event.startDate / event.endDate / event.location).
 *
 * Props:
 * @param {object} form - All form field values
 * @param {object} event - Current event object, null while loading
 * @param {function} onChange - Generic field change handler
 * @param {function} onFieldTouch - Marks a single field as touched (fieldName) => void,
 *   used for per-field blur/selection validation so errors show as soon as the
 *   user leaves a field, not only on "Save & Continue"
 * @param {object} errors - Merged validation errors
 * @param {object} touched - Per-field touched state
 * @param {function} onNext - "Save & Continue" handler (validates → setStep(2))
 * @param {string} regionCode - Current region code for cascading
 * @param {function} setRegionCode - Region change handler
 * @param {string} provinceCode - Current province code for cascading
 * @param {function} setProvinceCode - Province change handler
 * @param {string} cityCode - Current city code
 * @param {function} setCityCode - City change handler
 * @param {string} barangayCode - Current barangay code
 * @param {function} setBarangayCode - Barangay change handler
 * @param {array} regionOptions - Async-loaded region list
 * @param {array} provinceOptions - Async-loaded province list
 * @param {array} cityOptions - Async-loaded city list
 * @param {array} barangayOptions - Async-loaded barangay list
 * @param {string|null} addressError - Address loading error
 */
export default function RegistrationStep1({
  form,
  event,
  onChange,
  onFieldTouch,
  errors,
  touched,
  onNext,
  regionCode,
  setRegionCode,
  provinceCode,
  setProvinceCode,
  cityCode,
  setCityCode,
  barangayCode,
  setBarangayCode,
  regionOptions,
  provinceOptions,
  cityOptions,
  barangayOptions,
  addressError,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onNext();
  }

  const title = event?.title
    ? `Pre-Register for FREE Entrance - ${event.title}`
    : '';

  const dateStr = event?.startDate
    ? `${formatDate(event.startDate)}${event.endDate ? ` - ${formatDate(event.endDate)}` : ''}`
    : '';

  const dateVenue = [dateStr, event?.location].filter(Boolean).join(' - ');

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
          {title}
        </h1>
        <p
          className='text-[20px] font-bold font-satoshi'
          style={{ color: '#C55F61' }}
        >
          {dateVenue}
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
          onFieldTouch={onFieldTouch}
          errors={errors}
          touched={touched}
          regionCode={regionCode}
          setRegionCode={setRegionCode}
          provinceCode={provinceCode}
          setProvinceCode={setProvinceCode}
          cityCode={cityCode}
          setCityCode={setCityCode}
          barangayCode={barangayCode}
          setBarangayCode={setBarangayCode}
          regionOptions={regionOptions}
          provinceOptions={provinceOptions}
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
          onFieldTouch={onFieldTouch}
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