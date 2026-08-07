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
 * Card header: the boilerplate "Pre-Register for FREE Entrance" copy is
 * a tracked eyebrow label, separate from the event title, which is
 * rendered large (64/88px) in the brand rose gradient so it's the
 * dominant element on the page. Eyebrow and date/venue are sized up
 * from the first pass (12px/15px → 14px/18px) so they read as a
 * supporting line rather than disappearing under the larger title —
 * still clearly secondary to the headline, but no longer illegible.
 *
 * Props:
 * @param {object} form - All form field values
 * @param {object} event - Current event object, null while loading
 * @param {boolean} isAddressRequired - Whether this event needs an
 *   address (region/province/city/barangay) collected at all. Comes
 *   from event.isAddressRequired (EventFormPage resolves the default),
 *   forwarded straight through to BasicInfoSection, which hides the
 *   entire address block when false.
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
 * @param {object} formOptions - Shared useFormOptions() return value, forwarded
 *   to BasicInfoSection (age, gender) and PurposeOfVisitSection (role, eventDate,
 *   occasion, guests, budget, suppliers, discoveryChannel)
 */
export default function RegistrationStep1({
  form,
  event,
  isAddressRequired = true,
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
  formOptions,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onNext();
  }

  const eventTitle = event?.title ?? '';

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
      <div className='flex flex-col items-center text-center mb-12'>
        {/* Eyebrow — de-emphasized boilerplate, separated from the title */}
        {eventTitle && (
          <span
            className='inline-flex items-center gap-3 mb-4 font-satoshi text-xl font-bold uppercase tracking-[0.2em]'
            style={{ color: '#C55F61' }}
          >
            <span
              className='h-px w-10'
              style={{ backgroundColor: '#C55F61', opacity: 0.5 }}
              aria-hidden='true'
            />
            Pre-Register for FREE Entrance
            <span
              className='h-px w-10'
              style={{ backgroundColor: '#C55F61', opacity: 0.5 }}
              aria-hidden='true'
            />
          </span>
        )}

        {/* Event title — the dominant element on the page */}
        <h1 className='font-cormorant text-[64px] sm:text-[80px] lg:text-[88px] font-bold leading-[1] mb-3 px-4 break-words bg-gradient-to-b from-[#F57E80] to-[#C55F61] bg-clip-text text-transparent'>
          {eventTitle}
        </h1>

        {/* Accent underline — echoes the title gradient, punctuates it */}
        {eventTitle && (
          <div
            className='w-24 h-[4px] rounded-full mb-4 bg-gradient-to-b from-[#F57E80] to-[#C55F61]'
            aria-hidden='true'
          />
        )}

        {/* Date/venue — quieter than the title, but sized to stay readable */}
        <p className='text-2xl font-semibold font-satoshi text-neutral-gray'>
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
          isAddressRequired={isAddressRequired}
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
          formOptions={formOptions}
        />

        {/* ── Section 2: Organization/Company Information ── */}
        <OrganizationSection
          form={form}
          onChange={onChange}
          onFieldTouch={onFieldTouch}
          errors={errors}
          touched={touched}
        />

        {/* ── Section 3: Purpose of Visit ── */}
        <PurposeOfVisitSection
          form={form}
          onChange={onChange}
          onFieldTouch={onFieldTouch}
          errors={errors}
          touched={touched}
          formOptions={formOptions}
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