import { Handshake, Check } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';

/**
 * PurposeOfVisitSection — Purpose of Visit form sub-section.
 *
 * Design spec §2.7:
 * - Section header: Handshake icon badge + "Purpose of Visit" + subtitle
 * - Fields: role, eventDate, occasion, guests, budget, suppliers checklist,
 *   specificSuppliers, discoveryChannel (2-col grid), discoveryOther
 *
 * Every field carries `id="field-<schemaKey>"` so EventFormPage can
 * scroll to the first invalid field when "Save & Continue" is clicked.
 *
 * Option lists (role, eventDate, occasion, guests, budget, suppliers,
 * discoveryChannel) are no longer hardcoded here — they come from the
 * `formOptions` prop, sourced from a single GET /form-options request via
 * the useFormOptions hook and shared with BasicInfoSection's age/gender
 * fields. This avoids each field firing its own `?type=` request and
 * keeps the option source-of-truth on the backend.
 *
 * - The conditional "Please specify" field for Occasion is nested directly
 *   under the Occasion select (inside the same grid column) so it always
 *   appears immediately below Occasion, not below the whole 2-col row.
 * - The "Other" text field under the discovery-channel grid is disabled
 *   unless the discovery-channel's `isOther` option is selected; switching
 *   away from it clears whatever was typed there.
 * - "Other" detection for occasion/suppliers/discoveryChannel is driven by
 *   each option's `isOther` flag from the API (via formOptions.getOtherValue),
 *   rather than a hardcoded `'Other'` string literal, so a backend rename
 *   of that option's label/value doesn't silently break the specify-field
 *   logic.
 * - Suppliers checklist container has horizontal padding (px-3) so the
 *   checkbox buttons' focus ring (which sits outside the button via
 *   ring-offset-1) has room to render fully and doesn't get clipped by
 *   the scrollable container's forced overflow-x.
 *
 * Per-field errors show as soon as the field is touched — text/select inputs
 * mark themselves touched onBlur, radio/checkbox groups mark themselves
 * touched as soon as a selection is made, via `onFieldTouch(fieldName)`.
 *
 * Props:
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
 * @param {function} onFieldTouch - Marks a single field as touched (fieldName) => void
 * @param {object} errors - Validation errors
 * @param {object} touched - Per-field touched state
 * @param {object} formOptions - Result of useFormOptions(): { optionGroups, loading, error, getGroupValues, getOtherValue }
 */
export default function PurposeOfVisitSection({
  form,
  onChange,
  onFieldTouch,
  errors,
  touched,
  formOptions,
}) {
  const { getGroupValues, getOtherValue } = formOptions;

  // Plain-string option lists, safe to use before the fetch resolves
  // (getGroupValues falls back to [] while formOptions.optionGroups is null).
  const roleOptions = getGroupValues('role');
  const eventDateOptions = getGroupValues('eventDate');
  const occasionOptions = getGroupValues('occasion');
  const guestsOptions = getGroupValues('guests');
  const budgetOptions = getGroupValues('budget');
  const suppliersOptions = getGroupValues('suppliers');
  const discoveryOptions = getGroupValues('discoveryChannel');

  // The literal value that represents "Other" for each group, resolved
  // from the API's isOther flag instead of hardcoded.
  const occasionOtherValue = getOtherValue('occasion');
  const suppliersOtherValue = getOtherValue('suppliers');
  const discoveryOtherValue = getOtherValue('discoveryChannel');

  function handleChange(e) {
    onChange(e);
  }

  function handleFieldBlur(fieldName) {
    onFieldTouch?.(fieldName);
  }

  function handleRadioChange(name, value) {
    onChange({ target: { name, value } });
    onFieldTouch?.(name);
    // Clear the free-text "Other" value whenever the user picks a
    // discovery channel other than the isOther-flagged one, so stale
    // text can't sneak into the payload while the field is disabled.
    if (name === 'discoveryChannel' && value !== discoveryOtherValue) {
      onChange({ target: { name: 'discoveryOther', value: '' } });
    }
  }

  function handleSuppliersChange(supplier) {
    const current = form.suppliers || [];
    const next = current.includes(supplier)
      ? current.filter((s) => s !== supplier)
      : [...current, supplier];
    onChange({ target: { name: 'suppliers', value: next } });
    onFieldTouch?.('suppliers');
  }

  const isDiscoveryOther = form.discoveryChannel === discoveryOtherValue;

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
          <FormSelect
            id='field-role'
            label='My role in the upcoming occasion'
            name='role'
            required
            value={form.role}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('role')}
            placeholder='Select your role'
            options={roleOptions}
            error={touched.role ? errors.role : undefined}
          />
          <FormSelect
            id='field-eventDate'
            label='When is your event?'
            name='eventDate'
            required
            value={form.eventDate}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('eventDate')}
            placeholder='Select your event date'
            options={eventDateOptions}
            error={touched.eventDate ? errors.eventDate : undefined}
          />
        </div>

        {/* Row 2: Occasion (+ conditional "Please specify") / Guests (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='flex flex-col gap-8'>
            <FormSelect
              id='field-occasion'
              label='What occasion are you planning for?'
              name='occasion'
              required
              value={form.occasion}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('occasion')}
              placeholder='Select occasion'
              options={occasionOptions}
              error={touched.occasion ? errors.occasion : undefined}
            />

            {/* Conditional Occasion "Other" — nested directly under Occasion */}
            {form.occasion === occasionOtherValue && (
              <FormField
                id='field-occasionOther'
                label='Please specify'
                name='occasionOther'
                required
                value={form.occasionOther}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('occasionOther')}
                placeholder='Please specify your occasion'
                error={
                  touched.occasionOther ? errors.occasionOther : undefined
                }
              />
            )}
          </div>

          <FormSelect
            id='field-guests'
            label='How many guests are you expecting?'
            name='guests'
            required
            value={form.guests}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('guests')}
            placeholder='Select number of guests'
            options={guestsOptions}
            error={touched.guests ? errors.guests : undefined}
          />
        </div>

        {/* Row 3: Budget / Suppliers checklist (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <FormSelect
            id='field-budget'
            label='How much is your budget?'
            name='budget'
            required
            value={form.budget}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('budget')}
            placeholder='Select Budget'
            options={budgetOptions}
            error={touched.budget ? errors.budget : undefined}
          />

          {/* Suppliers Multi-Select Checklist */}
          <div id='field-suppliers' className='flex flex-col gap-1 scroll-mt-24'>
            <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
              Which suppliers are you looking for? Tick all that you need.
              <span className='text-red-500 ml-0.5'>*</span>
            </label>
            <div className='grid grid-cols-1 gap-2 py-2 px-3 max-h-[280px] overflow-y-auto'>
              {suppliersOptions.map((option) => (
                <label
                  key={option}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <button
                    type='button'
                    onClick={() => handleSuppliersChange(option)}
                    className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C55F61] ${
                      (form.suppliers || []).includes(option)
                        ? 'bg-[#C55F61] border-[#C55F61]'
                        : 'border-[#ACACAC] bg-white'
                    }`}
                    aria-checked={(form.suppliers || []).includes(option)}
                    role='checkbox'
                  >
                    {(form.suppliers || []).includes(option) && (
                      <Check className='w-3 h-3 text-white' />
                    )}
                  </button>
                  <span className='text-[14px] text-text-dark font-medium font-satoshi'>
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
        </div>

        {/* Conditional Suppliers "Other" */}
        {(form.suppliers || []).includes(suppliersOtherValue) && (
          <FormField
            id='field-suppliersOther'
            label='Please specify'
            name='suppliersOther'
            required
            value={form.suppliersOther}
            onChange={handleChange}
            onBlur={() => handleFieldBlur('suppliersOther')}
            placeholder='Please specify other suppliers'
            error={
              touched.suppliersOther ? errors.suppliersOther : undefined
            }
          />
        )}

        {/* Specific Suppliers (full-width) */}
        <FormField
          label="Any specific suppliers you want to get major deals from? Let us know and we just might have them!"
          name='specificSuppliers'
          value={form.specificSuppliers}
          onChange={handleChange}
          placeholder="Supplier's name"
        />

        {/* Discovery Radio Grid (2 columns per Figma) */}
        <div id='field-discoveryChannel' className='flex flex-col gap-1 scroll-mt-24'>
          <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
            How did you hear about the Toast Wedding Fair?
            <span className='text-red-500 ml-0.5'>*</span>
          </label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-2'>
            {discoveryOptions.map((option) => (
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
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      form.discoveryChannel === option
                        ? 'border-[#C55F61]'
                        : 'border-[#ACACAC]'
                    }`}
                  >
                    {form.discoveryChannel === option && (
                      <div className='w-2 h-2 rounded-full bg-[#C55F61]' />
                    )}
                  </div>
                </div>
                <span className='text-[14px] text-text-dark font-medium font-satoshi'>
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

        {/* Discovery Other (full-width) — only editable when the isOther option is selected above */}
        <FormField
          id='field-discoveryOther'
          label='Other'
          name='discoveryOther'
          required={isDiscoveryOther}
          disabled={!isDiscoveryOther}
          value={form.discoveryOther}
          onChange={handleChange}
          onBlur={() => handleFieldBlur('discoveryOther')}
          placeholder='Tell us how you find us'
          error={touched.discoveryOther ? errors.discoveryOther : undefined}
        />
      </div>
    </section>
  );
}