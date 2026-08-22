import { useEffect } from 'react';
import { User } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { REGIONS_WITHOUT_PROVINCES } from '@/hooks/usePhilippineAddress';

/**
 * BasicInfoSection — Basic Information form sub-section.
 *
 * Design spec §2.5:
 * - Section header: User icon badge + "Basic Information" + subtitle
 * - Fields: firstName, lastName, age, gender, email, phone (+63 prefix), region, province, city, barangay
 * - Layout: 2-col → 2-col → full → full → 2-col → 2-col → full
 *
 * Address flow supports two paths after Region is picked:
 *   1. Pick Province → City list narrows to that province
 *   2. Skip Province, pick City directly → City list spans the whole
 *      region; Province is then auto-derived from the chosen city
 *      (handled inside usePhilippineAddress's setCityCode) and its
 *      display name is synced into form.province via the effect below.
 *
 * Whole address block (Region/Province, City/Barangay — Rows 5 & 6) is
 * hidden entirely when `isAddressRequired` is false — some events don't
 * need attendees' address at all. The corresponding validation is
 * already skipped in EventFormPage.schema.js's
 * buildRegistrationSchema(isAddressRequired), so this is purely a
 * display concern here.
 *
 * Within the address block, Province is further hidden (replaced with
 * an explanatory note) for regions with no province layer at all (e.g.
 * NCR, per REGIONS_WITHOUT_PROVINCES — computed dynamically off the
 * actual PSGC data in usePhilippineAddress, not hardcoded here) — a
 * visible dropdown with nothing to pick would be confusing. Province is
 * NOT marked `required` on its field for the same reason: its real
 * requiredness (skipped entirely for these regions) is enforced in
 * buildRegistrationSchema's superRefine, not here.
 *
 * Age and gender options both come from `formOptions.getGroupValues(...)`
 * (shared useFormOptions() hook fetched once at EventFormPage level)
 * instead of hardcoded arrays.
 *
 * Props:
 * @param {object} form - All form field values
 * @param {boolean} isAddressRequired - Whether this event needs an
 *   address collected. Defaults to true. When false, the entire
 *   Region/Province/City/Barangay block (Rows 5 & 6) is not rendered.
 * @param {function} onChange - Generic field change handler
 * @param {object} errors - Validation errors
 * @param {object} touched - Per-field touched state
 * @param {function} registerField - name => refCallback, provided by
 *   RegistrationStep1 so this section's fields participate in the
 *   whole-form "scroll to first invalid field" behavior.
 * @param {string} regionCode - Current region code for cascading
 * @param {function} setRegionCode - Region change handler
 * @param {string} provinceCode - Current province code (user-picked OR auto-derived from City)
 * @param {function} setProvinceCode - Province change handler
 * @param {string} cityCode - Current city code
 * @param {function} setCityCode - City change handler (also derives province internally)
 * @param {string} barangayCode - Current barangay code
 * @param {function} setBarangayCode - Barangay change handler
 * @param {array} regionOptions - Region list
 * @param {array} provinceOptions - Province list (depends on regionCode)
 * @param {array} cityOptions - City list (depends on provinceCode if set, otherwise spans the whole region)
 * @param {array} barangayOptions - Barangay list (depends on cityCode)
 * @param {string|null} addressError - Address loading error
 * @param {object} formOptions - Shared useFormOptions() return value
 *   ({ optionGroups, loading, error, getGroupValues, getOtherValue })
 */
export default function BasicInfoSection({
  form,
  isAddressRequired = true,
  onChange,
  errors,
  touched,
  registerField,
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
  const ageOptions = formOptions?.getGroupValues('age') ?? [];
  const genderOptions = formOptions?.getGroupValues('gender') ?? [];

  // Whether the currently selected region has no province layer at all
  // (e.g. NCR). Derived from form.region (the region NAME, kept in sync
  // via the useEffect below) against the set computed in
  // usePhilippineAddress from the actual PSGC data — not hardcoded here.
  const regionHasNoProvinces = Boolean(
    form.region && REGIONS_WITHOUT_PROVINCES.has(form.region),
  );

  function handleChange(e) {
    onChange(e);
  }

  function handleGenderChange(gender) {
    onChange({ target: { name: 'gender', value: gender } });
  }

  // Transform hook options to { value, label } format for SearchableSelect
  const regionSelectOptions = regionOptions.map((r) => ({
    value: r.region_code,
    label: r.region_name,
  }));

  const provinceSelectOptions = provinceOptions.map((p) => ({
    value: p.province_code,
    label: p.province_name,
  }));

  const citySelectOptions = cityOptions.map((c) => ({
    value: c.city_code,
    label: c.city_name,
  }));

  const barangaySelectOptions = barangayOptions.map((b) => ({
    value: b.brgy_code,
    label: b.brgy_name,
  }));

  function handleRegionChange(nextCode) {
    setRegionCode(nextCode);
    const selected = regionOptions.find((r) => r.region_code === nextCode);
    onChange({
      target: { name: 'region', value: selected?.region_name ?? '' },
    });
    // Reset province, city, and barangay when region changes
    setProvinceCode('');
    setCityCode('');
    onChange({ target: { name: 'province', value: '' } });
    onChange({ target: { name: 'city', value: '' } });
    onChange({ target: { name: 'barangay', value: '' } });
  }

  function handleProvinceChange(nextCode) {
    setProvinceCode(nextCode);
    // Reset city and barangay when province changes
    setCityCode('');
    onChange({ target: { name: 'city', value: '' } });
    onChange({ target: { name: 'barangay', value: '' } });
    // form.province text is synced by the effect below once provinceOptions
    // reflects this new code — no need to set it here directly.
  }

  function handleCityChange(nextCode) {
    setCityCode(nextCode);
    const selected = cityOptions.find((c) => c.city_code === nextCode);
    onChange({
      target: { name: 'city', value: selected?.city_name ?? '' },
    });
    // Reset barangay when city changes
    onChange({ target: { name: 'barangay', value: '' } });
    // form.province text is synced by the effect below — setCityCode
    // (from usePhilippineAddress) derives provinceCode internally when
    // the user skips straight to City.
  }

  function handleBarangayChange(nextCode) {
    setBarangayCode(nextCode);
    const selected = barangayOptions.find((b) => b.brgy_code === nextCode);
    onChange({
      target: { name: 'barangay', value: selected?.brgy_name ?? '' },
    });
  }

  // Keeps form.province's display text in sync with provinceCode no
  // matter how provinceCode was set — explicitly via the Province
  // dropdown, or auto-derived from picking a City directly. Skipped
  // entirely when the address block isn't rendered — nothing to sync.
  useEffect(() => {
    if (!isAddressRequired) return;
    if (!provinceCode) {
      if (form.province) {
        onChange({ target: { name: 'province', value: '' } });
      }
      return;
    }
    const selected = provinceOptions.find(
      (p) => p.province_code === provinceCode,
    );
    if (selected && selected.province_name !== form.province) {
      onChange({ target: { name: 'province', value: selected.province_name } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceCode, provinceOptions, isAddressRequired]);

  return (
    <section id='basicInfo' className='mb-[34px]'>
      {/* Section header block */}
      <div className='flex items-center gap-6 mb-8'>
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
          <p className='font-satoshi text-[12px] text-neutral-gray'>
            Please provide your personal details.
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className='flex flex-col gap-8'>
        {/* Row 1: First Name / Last Name (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('firstName')}>
            <FormField
              label='First Name (as shown on valid ID)'
              name='firstName'
              required
              value={form.firstName}
              onChange={handleChange}
              placeholder='Enter Firstname'
              error={touched.firstName ? errors.firstName : undefined}
            />
          </div>
          <div ref={registerField('lastName')}>
            <FormField
              label='Last Name (as shown on valid ID)'
              name='lastName'
              required
              value={form.lastName}
              onChange={handleChange}
              placeholder='Enter Lastname'
              error={touched.lastName ? errors.lastName : undefined}
            />
          </div>
        </div>

        {/* Row 2: Age / Gender (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('age')}>
            <FormSelect
              label='Age'
              name='age'
              required
              value={form.age}
              onChange={handleChange}
              placeholder='Select your age'
              options={ageOptions}
              error={touched.age ? errors.age : undefined}
            />
          </div>
          {/* Gender Radio Buttons */}
          <div className='flex flex-col gap-1' ref={registerField('gender')}>
            <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
              Gender<span className='text-red-500 ml-0.5'>*</span>
            </label>
            <div className='flex items-center gap-6 pt-2'>
              {genderOptions.map((gender) => (
                <label
                  key={gender}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <div className='relative'>
                    <input
                      type='radio'
                      name='gender'
                      value={gender}
                      checked={form.gender === gender}
                      onChange={() => handleGenderChange(gender)}
                      className='sr-only'
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        form.gender === gender
                          ? 'border-[#C55F61]'
                          : 'border-[#ACACAC]'
                      }`}
                    >
                      {form.gender === gender && (
                        <div className='w-2 h-2 rounded-full bg-[#C55F61]' />
                      )}
                    </div>
                  </div>
                  <span className='text-[16px] text-text-dark font-medium font-satoshi'>
                    {gender}
                  </span>
                </label>
              ))}
            </div>
            {touched.gender && errors.gender ? (
              <p className='text-[11px] text-red-500 mt-0.5'>
                {errors.gender}
              </p>
            ) : null}
          </div>
        </div>

        {/* Row 3: Email Address (full-width) */}
        <div ref={registerField('email')}>
          <FormField
            label='Email Address'
            name='email'
            type='email'
            required
            value={form.email}
            onChange={handleChange}
            placeholder='Enter Email Address'
            error={touched.email ? errors.email : undefined}
          />
        </div>

        {/* Row 4: Mobile Number (full-width) with +63 prefix */}
        <div className='flex flex-col gap-1' ref={registerField('phone')}>
          <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
            Mobile Number<span className='text-red-500 ml-0.5'>*</span>
          </label>
          <div className='flex items-stretch'>
            {/* +63 static prefix */}
            <span className='inline-flex items-center px-[17px] bg-white border border-[#ACACAC] border-r-0 rounded-l-[6px] text-[14px] text-neutral-gray font-satoshi'>
              +63
            </span>
            <input
              type='tel'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              placeholder='Enter mobile number'
              className={`flex-1 bg-white border border-[#ACACAC] rounded-r-[6px] px-[17px] h-[52px] text-sm text-slate-800 outline-none transition-all placeholder:text-[#ACACAC] font-satoshi focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1 ${
                touched.phone && errors.phone
                  ? 'ring-2 ring-red-100 focus:ring-red-200'
                  : ''
              }`}
              aria-invalid={Boolean(touched.phone && errors.phone)}
              aria-required
              aria-describedby='phone-helper'
            />
          </div>
          <p
            id='phone-helper'
            className='text-[11px] text-neutral-gray mt-1 font-satoshi'
          >
            Use format 9xxxxxxxxx. no 0 at the start, no space, no dash nor
            slash.
          </p>
          {touched.phone && errors.phone ? (
            <p className='text-[11px] text-red-500 mt-0.5'>
              {errors.phone}
            </p>
          ) : null}
        </div>

        {/* Rows 5 & 6: Region / Province / City / Barangay — only for
            events that require an address at all. */}
        {isAddressRequired && (
          <>
            {/* Row 5: Region / Province (2-col) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div ref={registerField('region')}>
                <SearchableSelect
                  label='Region'
                  required
                  value={regionCode}
                  onChange={handleRegionChange}
                  options={regionSelectOptions}
                  placeholder='Select your region'
                  error={
                    touched.region && (errors.region || addressError)
                      ? errors.region || addressError
                      : undefined
                  }
                />
              </div>
              <div ref={registerField('province')}>
                {regionCode && regionHasNoProvinces ? (
                  <div className='flex flex-col gap-1'>
                    <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
                      Province
                    </label>
                    <p className='text-[13px] text-neutral-gray font-satoshi leading-snug'>
                      This region doesn't have provinces — you can proceed
                      to select your City below.
                    </p>
                  </div>
                ) : (
                  <>
                    <SearchableSelect
                      label='Province'
                      value={provinceCode}
                      onChange={handleProvinceChange}
                      options={provinceSelectOptions}
                      placeholder='Select your province'
                      disabled={!regionCode}
                      error={
                        touched.province && errors.province
                          ? errors.province
                          : undefined
                      }
                    />
                    <p className='text-[11px] text-neutral-gray mt-1 font-satoshi'>
                      Not sure? You can skip this and pick your City below instead.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Row 6: City / Barangay (2-col) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div ref={registerField('city')}>
                <SearchableSelect
                  label='City'
                  required
                  value={cityCode}
                  onChange={handleCityChange}
                  options={citySelectOptions}
                  placeholder='Select your city'
                  disabled={!regionCode}
                  error={
                    touched.city && errors.city ? errors.city : undefined
                  }
                />
                <p className='text-[11px] text-neutral-gray mt-1 font-satoshi'>
                  Selecting a city will auto-fill your province above.
                </p>
              </div>
              <div ref={registerField('barangay')}>
                <SearchableSelect
                  label='Barangay'
                  required
                  value={barangayCode}
                  onChange={handleBarangayChange}
                  options={barangaySelectOptions}
                  placeholder='Select your barangay'
                  disabled={!cityCode}
                  error={
                    touched.barangay && errors.barangay ? errors.barangay : undefined
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}