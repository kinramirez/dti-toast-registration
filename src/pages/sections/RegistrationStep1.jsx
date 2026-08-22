import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

import StepIndicator from '@/components/ui/StepIndicator';

import BasicInfoSection from './BasicInfoSection';
import OrganizationSection from './OrganizationSection';
import PurposeOfVisitSection from './PurposeOfVisitSection';
import { parseDateAsLocal } from '@/lib/utils/eventUtils';

const STEPS = [
  { number: 1, label: 'Attendee Information' },
  { number: 2, label: 'Review & Submit' },
];

// Full field order across all Step 1 fields, in the order they appear
// visually on the page (Basic Info → Organization → Purpose of
// Visit). This drives "scroll to first invalid field" — update this
// list if fields are reordered or added.
const FIELD_ORDER = [
  // Basic Information
  'firstName',
  'lastName',
  'age',
  'gender',
  'email',
  'phone',
  'region',
  'province',
  'city',
  'barangay',
  // Organization/Company 
  'company',
  'position',
  // Purpose of Visit
  'role',
  'eventDate',
  'occasion',
  'guests',
  'occasionOther',
  'budget',
  'suppliers',
  'suppliersOther',
  'specificSuppliers',
  'discoveryChannel',
  'discoveryOther',
];

/**
 * Builds a compact, human-friendly date range label that avoids repeating
 * the year (and month) when they're shared between start/end dates:
 *   - Same day:            "November 12, 2026"
 *   - Same month & year:   "November 12 – 16, 2026"
 *   - Same year only:      "November 12 – December 16, 2026"
 *   - Different years:     "November 12, 2026 – January 3, 2027"
 */
function formatDateRange(startDateStr, endDateStr) {
  const start = startDateStr ? parseDateAsLocal(startDateStr) : null;
  const end = endDateStr ? parseDateAsLocal(endDateStr) : null;

  const startValid = start && !Number.isNaN(start.getTime());
  const endValid = end && !Number.isNaN(end.getTime());

  if (!startValid && !endValid) return 'TBA';
  if (startValid && !endValid) {
    return start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  if (!startValid && endValid) {
    return end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const month = start.toLocaleDateString('en-US', { month: 'long' });
    return `${month} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
  }

  if (sameYear) {
    const startLabel = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endLabel = end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
  }

  const startLabel = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const endLabel = end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${startLabel} – ${endLabel}`;
}

/**
 * RegistrationStep1 — Consolidated data-entry form with all fields.
 *
 * Card header: the boilerplate "Pre-Register for FREE Entrance" copy is
 * a small tracked eyebrow label, separate from the event title, which
 * is rendered large (64/80/88px) in the brand rose gradient so it's the
 * dominant element on the header rather than trailing off the end of a
 * sentence. Date/venue sits below as a supporting line.
 *
 * Props:
 * @param {object} event - Event data (same object passed to EventOverviewCard).
 *   Used to derive the header title, date/venue subtitle so it always matches
 *   the event's actual data instead of being hardcoded.
 * @param {boolean} isAddressRequired - Whether this event needs an address
 *   (region/province/city/barangay) collected at all. Comes from
 *   event.isAddressRequired (EventFormPage resolves the default),
 *   forwarded straight through to BasicInfoSection, which hides the
 *   entire address block when false.
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
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
 * @param {array} provinceOptions - Async-loaded province list (depends on regionCode)
 * @param {array} cityOptions - Async-loaded city list (depends on provinceCode)
 * @param {array} barangayOptions - Async-loaded barangay list (depends on cityCode)
 * @param {string|null} addressError - Address loading error
 * @param {object} formOptions - Shared useFormOptions() return value, forwarded
 *   to BasicInfoSection (age, gender) and PurposeOfVisitSection (role, eventDate,
 *   occasion, guests, budget, suppliers, discoveryChannel)
 */
export default function RegistrationStep1({
  event,
  isAddressRequired = true,
  form,
  onChange,
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
  const fieldRefs = useRef({});
  const prevTouchedRef = useRef({});

  const eventTitle = event?.title ?? '';

  // Derive the header date range from the same event data EventOverviewCard uses,
  // collapsing the year (and month, when possible) so it doesn't repeat.
  const dateRangeLabel = formatDateRange(event?.startDate, event?.endDate);

  const dateVenueLabel = event?.location
    ? `${dateRangeLabel} - ${event.location}`
    : dateRangeLabel;

  // Shared registration function passed to every section so each
  // field — regardless of which section renders it — reports its
  // DOM node into one central map.
  function registerField(name) {
    return (el) => {
      fieldRefs.current[name] = el;
    };
  }

  // Whenever a field newly becomes touched (either from a single
  // blur, or all-at-once on a failed submit) and it has an error,
  // scroll to the FIRST invalid field in true page order and focus it.
  useEffect(() => {
    const prevTouched = prevTouchedRef.current;
    const newlyTouchedInvalid = FIELD_ORDER.find((name) => {
      const isNewlyTouched = touched?.[name] && !prevTouched?.[name];
      return isNewlyTouched && errors?.[name];
    });

    if (newlyTouchedInvalid) {
      const el = fieldRefs.current[newlyTouchedInvalid];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = el.matches('input, select, textarea, button')
          ? el
          : el.querySelector('input, select, textarea, button');
        focusable?.focus({ preventScroll: true });
      }
    }

    prevTouchedRef.current = touched || {};
  }, [touched, errors]);

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
          {dateVenueLabel}
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
          errors={errors}
          touched={touched}
          registerField={registerField}
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
          errors={errors}
          touched={touched}
          registerField={registerField}
        />

        {/* ── Section 3: Purpose of Visit ── */}
        <PurposeOfVisitSection
          form={form}
          onChange={onChange}
          errors={errors}
          touched={touched}
          registerField={registerField}
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