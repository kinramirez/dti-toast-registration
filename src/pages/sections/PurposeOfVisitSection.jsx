import { Handshake, Check } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';

/**
 * PurposeOfVisitSection — Purpose of Visit form sub-section.
 *
 * Design spec §2.7:
 * - Section header: Handshake icon badge + "Purpose of Visit" + subtitle
 * - Fields: role, eventDate, occasion, guests, budget, suppliers checklist,
 *   specificSuppliers, lumiPromos, discoveryChannel (2-col grid), discoveryOther
 *
 * Option lists (role, eventDate, occasion, guests, budget, suppliers,
 * lumiPromos, discoveryChannel) are no longer hardcoded here — they come
 * from the `formOptions` prop, sourced from a single GET /form-options
 * request via the useFormOptions hook and shared with BasicInfoSection's
 * age/gender fields. "Other" detection for occasion/suppliers/
 * discoveryChannel is driven by each option's `isOther` flag from the API
 * (via formOptions.getOtherValue) rather than a hardcoded 'Other' string,
 * so a backend rename of that option doesn't silently break the
 * specify-field logic.
 *
 * Props:
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
 * @param {object} errors - Validation errors
 * @param {object} touched - Per-field touched state
 * @param {function} registerField - name => refCallback, provided by
 *   RegistrationStep1 so this section's fields participate in the
 *   whole-form "scroll to first invalid field" behavior.
 * @param {object} formOptions - Shared useFormOptions() return value:
 *   { optionGroups, loading, error, getGroupValues, getOtherValue }
 */
export default function PurposeOfVisitSection({
  form,
  onChange,
  errors,
  touched,
  registerField,
  formOptions,
}) {
  const { getGroupValues, getOtherValue } = formOptions;

  const roleOptions = getGroupValues('role');
  const eventDateOptions = getGroupValues('eventDate');
  const occasionOptions = getGroupValues('occasion');
  const guestsOptions = getGroupValues('guests');
  const budgetOptions = getGroupValues('budget');
  const suppliersOptions = getGroupValues('suppliers');
  const lumiOptions = getGroupValues('lumiPromos');
  const discoveryOptions = getGroupValues('discoveryChannel');

  const occasionOtherValue = getOtherValue('occasion');
  const suppliersOtherValue = getOtherValue('suppliers');

  function handleChange(e) {
    onChange(e);
  }

  function handleRadioChange(name, value) {
    onChange({ target: { name, value } });
  }

  function handleSuppliersChange(supplier) {
    const current = form.suppliers || [];
    const next = current.includes(supplier)
      ? current.filter((s) => s !== supplier)
      : [...current, supplier];
    onChange({ target: { name: 'suppliers', value: next } });
  }

  const selectedSuppliers = form.suppliers || [];
  const hasOtherSuppliersSelected = selectedSuppliers.some(
    (s) => s !== suppliersOtherValue
  );

  // The free-text "Other" field is only usable when the isOther-flagged
  // discovery-channel option is selected; otherwise it stays disabled.
  const isDiscoveryOtherSelected = form.discoveryChannel === getOtherValue('discoveryChannel');

  return (
    <section id='purposeOfVisit' className='mb-[34px]'>
      {/* Section header block */}
      <div className='flex items-center gap-6 mb-8'>
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
          <p className='font-satoshi text-[12px] text-neutral-gray'>
            Help us understand your interest in this event so we can better
            tailor our programs and future activities to your needs.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        {/* Row 1: Role / Event Date (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('role')}>
            <FormSelect
              label='My role in the upcoming occasion'
              name='role'
              required
              value={form.role}
              onChange={handleChange}
              placeholder='Select your role'
              options={roleOptions}
              error={touched.role ? errors.role : undefined}
            />
          </div>
          <div ref={registerField('eventDate')}>
            <FormSelect
              label='When is your event?'
              name='eventDate'
              required
              value={form.eventDate}
              onChange={handleChange}
              placeholder='Select your event date'
              options={eventDateOptions}
              error={touched.eventDate ? errors.eventDate : undefined}
            />
          </div>
        </div>

        {/* Row 2: Occasion / Guests (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('occasion')}>
            <FormSelect
              label='What occasion are you planning for?'
              name='occasion'
              required
              value={form.occasion}
              onChange={handleChange}
              placeholder='Select occasion'
              options={occasionOptions}
              error={touched.occasion ? errors.occasion : undefined}
            />
          </div>
          <div ref={registerField('guests')}>
            <FormSelect
              label='How many guests are you expecting?'
              name='guests'
              required
              value={form.guests}
              onChange={handleChange}
              placeholder='Select number of guests'
              options={guestsOptions}
              error={touched.guests ? errors.guests : undefined}
            />
          </div>
        </div>

        {/* Conditional Occasion "Other" */}
        {form.occasion === occasionOtherValue && (
          <div ref={registerField('occasionOther')}>
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
          </div>
        )}

        {/* Row 3: Budget / Suppliers checklist (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('budget')}>
            <FormSelect
              label='How much is your budget?'
              name='budget'
              required
              value={form.budget}
              onChange={handleChange}
              placeholder='Select Budget'
              options={budgetOptions}
              error={touched.budget ? errors.budget : undefined}
            />
          </div>

          {/* Suppliers Multi-Select Checklist */}
          <div className='flex flex-col gap-1' ref={registerField('suppliers')}>
            <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
              Which suppliers are you looking for? Tick all that you need.
              <span className='text-red-500 ml-0.5'>*</span>
            </label>
            <div className='grid grid-cols-1 gap-2 pt-2 px-1 max-h-[280px] overflow-y-auto overflow-x-hidden'>
              {suppliersOptions.map((option) => {
                const isOther = option === suppliersOtherValue;
                const isDisabled = isOther && hasOtherSuppliersSelected;
                const isChecked = selectedSuppliers.includes(option);

                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 ${
                      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <button
                      type='button'
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleSuppliersChange(option)}
                      className={`appearance-none flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1 ${
                        isChecked
                          ? 'bg-[#C55F61] border-[#C55F61]'
                          : 'border-[#ACACAC] bg-white'
                      } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                      aria-checked={isChecked}
                      aria-disabled={isDisabled}
                      role='checkbox'
                    >
                      {isChecked && <Check className='w-3 h-3 text-white' />}
                    </button>
                    <span className='text-[14px] text-text-dark font-medium font-satoshi'>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
            {touched.suppliers && errors.suppliers ? (
              <p className='text-[11px] text-red-500 mt-0.5'>
                {errors.suppliers}
              </p>
            ) : null}
          </div>
        </div>

        {/* Conditional Suppliers "Other" */}
        {selectedSuppliers.includes(suppliersOtherValue) && (
          <div ref={registerField('suppliersOther')}>
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

        {/* Specific Suppliers (full-width) */}
        <div ref={registerField('specificSuppliers')}>
          <FormField
            label="Any specific suppliers you want to get major deals from? Let us know and we just might have them!"
            name='specificSuppliers'
            value={form.specificSuppliers}
            onChange={handleChange}
            placeholder="Supplier's name"
          />
        </div>

        {/* Lumi Candles Radio (full-width horizontal row) */}
        <div className='flex flex-col gap-1' ref={registerField('lumiPromos')}>
          <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
            Would you like to receive discounts & promos from Lumi Candles?
            <span className='text-red-500 ml-0.5'>*</span>
          </label>
          <div className='flex flex-row flex-wrap items-center gap-4 pt-2'>
            {lumiOptions.map((option) => (
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
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      form.lumiPromos === option
                        ? 'border-[#C55F61]'
                        : 'border-[#ACACAC]'
                    }`}
                  >
                    {form.lumiPromos === option && (
                      <div className='w-2 h-2 rounded-full bg-[#C55F61]' />
                    )}
                  </div>
                </div>
                <span className='text-[16px] text-text-dark font-medium font-satoshi'>
                  {option}
                </span>
              </label>
            ))}
          </div>
          {touched.lumiPromos && errors.lumiPromos ? (
            <p className='text-[11px] text-red-500 mt-0.5'>
              {errors.lumiPromos}
            </p>
          ) : null}
        </div>

        {/* Discovery Radio Grid (2 columns per Figma) */}
        <div className='flex flex-col gap-1' ref={registerField('discoveryChannel')}>
          <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
            How did you hear about the Toast Wedding Fair?
            <span className='text-red-500 ml-0.5'>*</span>
          </label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-2'>
            {discoveryOptions.map((option) => {
              const isChecked = form.discoveryChannel === option;

              return (
                <label
                  key={option}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <div className='relative'>
                    <input
                      type='radio'
                      name='discoveryChannel'
                      value={option}
                      checked={isChecked}
                      onChange={() =>
                        handleRadioChange('discoveryChannel', option)
                      }
                      className='sr-only'
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked ? 'border-[#C55F61]' : 'border-[#ACACAC]'
                      }`}
                    >
                      {isChecked && (
                        <div className='w-2 h-2 rounded-full bg-[#C55F61]' />
                      )}
                    </div>
                  </div>
                  <span className='text-[14px] text-text-dark font-medium font-satoshi'>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
          {touched.discoveryChannel && errors.discoveryChannel ? (
            <p className='text-[11px] text-red-500 mt-0.5'>
              {errors.discoveryChannel}
            </p>
          ) : null}
        </div>

        {/* Discovery Other (full-width) — only usable when the isOther-flagged option is selected */}
        <div ref={registerField('discoveryOther')}>
          <FormField
            label='Other'
            name='discoveryOther'
            required={isDiscoveryOtherSelected}
            value={form.discoveryOther}
            onChange={handleChange}
            placeholder='Tell us how you find us'
            disabled={!isDiscoveryOtherSelected}
            error={touched.discoveryOther ? errors.discoveryOther : undefined}
          />
        </div>
      </div>
    </section>
  );
}