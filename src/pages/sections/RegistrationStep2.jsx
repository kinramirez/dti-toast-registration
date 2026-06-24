import { useMemo } from 'react';
import { Check } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';
import StepIndicator from '@/components/ui/StepIndicator';

import toastLogo from '@/assets/toast.png';
import toastBg from '@/assets/toast-bg.png';

const STEPS = [
  { number: 1, label: 'Registration' },
  { number: 2, label: 'Purpose of Visit' },
];

// Placeholder options — accept from parent for future-proofing
const ROLE_OPTIONS = [
  'I am the one planning it.',
  'I am accompanying someone.',
  'I am just looking around.',
];

const EVENT_DATE_OPTIONS = [
  'July-Dec 2026',
  'Jan-June 2027',
  'July-Dec 2027',
  'Jan-June 2028',
  'July-Dec 2028',
  'Jan-June 2029',
  'July 2029 onwards',
];

const OCCASION_OPTIONS = [
  'Wedding',
  'Debut',
  'Birthday Party',
  'Social Gathering',
  'Anniversary',
  'Family Reunion',
  'Corporate Event',
  'Other',
];

const GUESTS_OPTIONS = [
  'Below 50',
  '50-100',
  '101-150',
  '151-200',
  '201-250',
  '251-300',
  '301-350',
  '351-400',
  '401-450',
  '451-500',
  '501 and above',
];

const BUDGET_OPTIONS = [
  'Below PHP 100,000',
  'PHP 100,000 - PHP 300,000',
  'PHP 301,000 - PHP 500,000',
  'PHP 501,000 - PHP 999,000',
  'PHP 1,000,000 - PHP 1,500,000',
  'PHP 1,600,000 - PHP 2,000,000',
  'PHP 2,100,000 - PHP 2,900,000',
  'PHP 3,000,000 and above',
];

const LUMI_OPTIONS = [
  'Yes, send me discounts & promos',
  'No, not right now',
  'Maybe later',
];

const DISCOVERY_OPTIONS = [
  'Toast Wedding Fair Instagram',
  'Toast Wedding Fair Facebook',
  'Toast Wedding Fair Tiktok',
  'Bride and Breakfast',
  'Email Newsletter',
  'Text Message',
  'Billboards/ Outdoor Banners',
  'Flyer',
  'Friends & Family',
  'WhenInManila',
  'DiscoverMNL',
];

const SUPPLIERS_OPTIONS = [
  'Alcohol Suppliers',
  'Bridal Car',
  'Bridal Shoes and Accessories',
  'Cakes and other Baked Goods',
  'Caterers',
  'Coordinator',
  'Entertainment',
  'Event Stylist',
  'Fashion Stylist',
  'Florist',
  'Food Carts',
  'Gowns and Suits',
  'Host',
  'Invitations and Stationary',
  'Jewelry',
  'Lights and Sounds',
  'Make Up Artists',
  'Mobile Bar',
  'Photographers',
  'Prenup Needs',
  'Tent and Aircon Rental',
  'Venue',
  'Videographers',
  'Souvenirs',
  'Other',
];

export default function RegistrationStep2({
  form,
  onChange,
  errors,
  touched,
  onSubmit,
  onBack,
  isSubmitting,
  regionCode,
  setRegionCode,
  cityCode,
  setCityCode,
  regionOptions,
  cityOptions,
  addressError,
  submitError,
}) {
  function handleChange(e) {
    onChange(e);
  }

  function handleRadioChange(name, value) {
    onChange({ target: { name, value } });
  }

  function handleConsentChange() {
    onChange({
      target: { name: 'consent', type: 'checkbox', checked: !form.consent },
    });
  }

  function handleSuppliersChange(supplier) {
    const current = form.suppliers || [];
    const next = current.includes(supplier)
      ? current.filter((s) => s !== supplier)
      : [...current, supplier];
    onChange({ target: { name: 'suppliers', value: next } });
  }

  // Transform hook options to { value, label } format for SearchableSelect
  const provinceOptions = useMemo(
    () =>
      regionOptions.map((r) => ({
        value: r.region_code,
        label: r.region_name,
      })),
    [regionOptions],
  );

  const citySelectOptions = useMemo(
    () =>
      cityOptions.map((c) => ({
        value: c.city_code,
        label: c.city_name,
      })),
    [cityOptions],
  );

  function handleProvinceChange(nextCode) {
    setRegionCode(nextCode);
    const selected = regionOptions.find((r) => r.region_code === nextCode);
    onChange({
      target: { name: 'province', value: selected?.region_name ?? '' },
    });
    // Reset city when province changes
    onChange({ target: { name: 'city', value: '' } });
  }

  function handleCityChange(nextCode) {
    setCityCode(nextCode);
    const selected = cityOptions.find((c) => c.city_code === nextCode);
    onChange({
      target: { name: 'city', value: selected?.city_name ?? '' },
    });
  }

  return (
    <div
      className='min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-start items-center py-20 px-4'
      style={{ backgroundImage: `url(${toastBg})` }}
    >
      <img
        src={toastLogo}
        alt='Toast Wedding Fair'
        className='w-[214px] h-auto object-contain mb-8'
      />
      <div className='bg-white rounded-2xl shadow-[0px_4px_4px_rgba(18,18,18,0.15)] p-6 sm:p-10 lg:p-16 max-w-7xl w-full font-saira'>
        {/* ── Header Block ── */}
        <div className='flex flex-col items-center text-center mb-16'>
          <h1 className='text-[32px] font-bold text-brand-dark leading-tight mb-2'>
            Pre-Register for FREE Entrance - Toast Wedding Fair
          </h1>
          <p className='text-[20px] font-medium text-brand-blue'>
            March 7-8, 2026 - World Trade Center
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div className='mb-10'>
          <StepIndicator
            currentStep={2}
            steps={STEPS}
            onStepClick={(stepNum) => {
              if (stepNum === 1) onBack();
            }}
          />
        </div>

        <form onSubmit={onSubmit}>
          {/* ── Purpose of Visit ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Purpose of Visit
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <FormSelect
                label='My role in the upcoming occasion.'
                name='role'
                required
                value={form.role}
                onChange={handleChange}
                placeholder='Select role in the upcoming occasion'
                options={ROLE_OPTIONS}
                error={touched.role ? errors.role : undefined}
              />
              <FormSelect
                label='When is your event?'
                name='eventDate'
                required
                value={form.eventDate}
                onChange={handleChange}
                placeholder='Select Month-Year of event'
                options={EVENT_DATE_OPTIONS}
                error={touched.eventDate ? errors.eventDate : undefined}
              />
              <FormSelect
                label='What occasion are you planning for?'
                name='occasion'
                required
                value={form.occasion}
                onChange={handleChange}
                placeholder='Select the occasion you are planning for'
                options={OCCASION_OPTIONS}
                error={touched.occasion ? errors.occasion : undefined}
              />
              {form.occasion === 'Other' && (
                <FormField
                  label='Please specify'
                  name='occasionOther'
                  required
                  value={form.occasionOther}
                  onChange={handleChange}
                  placeholder='Please specify your occasion'
                  error={
                    touched.occasionOther ? errors.occasionOther : undefined
                  }
                />
              )}
              <FormSelect
                label='How many guests are you expecting for your event?'
                name='guests'
                required
                value={form.guests}
                onChange={handleChange}
                placeholder='How many guests are you expecting?'
                options={GUESTS_OPTIONS}
                error={touched.guests ? errors.guests : undefined}
              />
              <FormSelect
                label='How much is your budget for your event?'
                name='budget'
                required
                value={form.budget}
                onChange={handleChange}
                placeholder='Choose your budget range'
                options={BUDGET_OPTIONS}
                error={touched.budget ? errors.budget : undefined}
              />
            </div>

            {/* Field 6: Suppliers Multi-Select Checklist */}
            <div className='mt-8 flex flex-col gap-1'>
              <label className='text-[#1877F2] mb-2 block text-base font-medium'>
                Which suppliers are you looking for? Tick all that you need.<span className='text-red-500 ml-0.5'>*</span>
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-2'>
                {SUPPLIERS_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <button
                      type='button'
                      onClick={() => handleSuppliersChange(option)}
                      className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1 ${
                        (form.suppliers || []).includes(option)
                          ? 'bg-[#1877F2] border-[#1877F2]'
                          : 'border-[#808080] bg-white'
                      }`}
                      aria-checked={(form.suppliers || []).includes(option)}
                      role='checkbox'
                    >
                      {(form.suppliers || []).includes(option) && (
                        <Check className='w-3 h-3 text-white' />
                      )}
                    </button>
                    <span className='text-[16px] text-text-dark font-medium'>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              {touched.suppliers && errors.suppliers ? (
                <p className='text-[11px] text-red-500 mt-0.5'>
                  {errors.suppliers}
                </p>
              ) : null}
            </div>

            {/* Conditional Suppliers "Other" Input */}
            {(form.suppliers || []).includes('Other') && (
              <div className='mt-8'>
                <FormField
                  label='Please specify'
                  name='suppliersOther'
                  required
                  value={form.suppliersOther}
                  onChange={handleChange}
                  placeholder='Please specify other suppliers'
                  error={
                    touched.suppliersOther ? errors.suppliersOther : undefined
                  }
                />
              </div>
            )}

            {/* Field 7: Specific Suppliers (full-width) */}
            <div className='mt-8'>
              <FormField
                label='Any specific suppliers you want to get major deals from? Let us know and we just might have them!'
                name='specificSuppliers'
                value={form.specificSuppliers}
                onChange={handleChange}
                placeholder="Have specific suppliers in mind?"
              />
            </div>

            {/* Field 8: Lumi Candles Radio (full-width horizontal row) */}
            <div className='mt-8 flex flex-col gap-1'>
              <label className='text-[#1877F2] mb-2 block text-base font-medium'>
                Would you like to receive discounts & promos from Lumi Candles?
              </label>
              <div className='flex flex-row flex-wrap items-center gap-4 pt-2'>
                {LUMI_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <div className='relative'>
                      <input
                        type='radio'
                        name='lumiPromos'
                        value={option}
                        checked={form.lumiPromos === option}
                        onChange={() => handleRadioChange('lumiPromos', option)}
                        className='sr-only'
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          form.lumiPromos === option
                            ? 'border-[#1877F2]'
                            : 'border-[#DADADA]'
                        }`}
                      >
                        {form.lumiPromos === option && (
                          <div className='w-2.5 h-2.5 rounded-full bg-[#1877F2]' />
                        )}
                      </div>
                    </div>
                    <span className='text-[16px] text-text-dark font-medium'>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Discovery ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Discovery
            </h2>

            {/* Field 9: Discovery Radio Grid (3-column) */}
            <div className='flex flex-col gap-1'>
              <label className='text-[#1877F2] mb-2 block text-base font-medium'>
                How did you hear about the Toast Wedding Fair?<span className='text-red-500 ml-0.5'>*</span>
              </label>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
                {DISCOVERY_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <div className='relative'>
                      <input
                        type='radio'
                        name='discoveryChannel'
                        value={option}
                        checked={form.discoveryChannel === option}
                        onChange={() =>
                          handleRadioChange('discoveryChannel', option)
                        }
                        className='sr-only'
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          form.discoveryChannel === option
                            ? 'border-[#1877F2]'
                            : 'border-[#DADADA]'
                        }`}
                      >
                        {form.discoveryChannel === option && (
                          <div className='w-2.5 h-2.5 rounded-full bg-[#1877F2]' />
                        )}
                      </div>
                    </div>
                    <span className='text-[16px] text-text-dark font-medium'>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              {touched.discoveryChannel && errors.discoveryChannel ? (
                <p className='text-[11px] text-red-500 mt-0.5'>
                  {errors.discoveryChannel}
                </p>
              ) : null}
            </div>

            {/* Field 10: Discovery Other (full-width) */}
            <div className='mt-8'>
              <FormField
                label='Other'
                name='discoveryOther'
                value={form.discoveryOther}
                onChange={handleChange}
                placeholder='Tell us how you found us'
              />
            </div>
          </div>

          {/* ── Where You're From ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Where You're From
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <SearchableSelect
                label='Province'
                required
                value={regionCode}
                onChange={handleProvinceChange}
                options={provinceOptions}
                placeholder='Choose Province'
                error={
                  touched.province && (errors.province || addressError)
                    ? errors.province || addressError
                    : undefined
                }
              />
              <SearchableSelect
                label='City'
                required
                value={cityCode}
                onChange={handleCityChange}
                options={citySelectOptions}
                placeholder='Choose City'
                disabled={!regionCode}
                error={
                  touched.city && errors.city ? errors.city : undefined
                }
              />
            </div>

            {/* Field 13: Location Other (full-width, always required) */}
            <div className='mt-8'>
              <FormField
                label='Other'
                name='locationOther'
                required
                value={form.locationOther}
                onChange={handleChange}
                placeholder="Please specify the province/city you're coming from."
                error={
                  touched.locationOther ? errors.locationOther : undefined
                }
              />
            </div>
          </div>

          {/* ── Consent Checkbox ── */}
          <div className='flex flex-row items-start gap-4 max-w-[760px] mx-auto mb-8'>
            <button
              type='button'
              onClick={handleConsentChange}
              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1 ${
                form.consent
                  ? 'bg-[#1877F2] border-[#1877F2]'
                  : 'border-[#808080] bg-white'
              }`}
              aria-checked={form.consent}
              role='checkbox'
            >
              {form.consent && <Check className='w-3 h-3 text-white' />}
            </button>
            <label
              className='text-text-dark text-[16px] font-medium cursor-pointer'
              onClick={handleConsentChange}
            >
              I agree to receive updates, reminders, and promotional
              communications from AFT Corp. through email, SMS, or phone. I
              understand that I can unsubscribe at any time.
              <span className='text-red-500 ml-0.5'>*</span>
            </label>
          </div>
          {touched.consent && errors.consent ? (
            <p className='text-[11px] text-red-500 text-center -mt-6 mb-4'>
              {errors.consent}
            </p>
          ) : null}

          {/* ── Submit Error Banner ── */}
          {submitError && (
            <div className='max-w-[760px] mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm text-center'>
              {submitError}
            </div>
          )}

          {/* ── Back + Submit Buttons ── */}
          <div className='flex flex-row items-center justify-center gap-4 max-w-[600px] mx-auto'>
            <button
              type='button'
              onClick={onBack}
              className='border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/5 transition-all px-8 py-4 rounded-lg font-bold text-[20px]'
            >
              Back
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-[489px] h-[64px] bg-[#1877F2] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white rounded-lg font-bold text-[24px] shadow-lg'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
