import { User } from 'lucide-react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';

const AGE_OPTIONS = [
  '20 and below',
  '21-25',
  '26-30',
  '31-35',
  '36-40',
  '41-45',
  '46-50',
  '51 and above',
];

/**
 * BasicInfoSection — Basic Information form sub-section.
 *
 * Design spec §2.5:
 * - Section header: User icon badge + "Basic Information" + subtitle
 * - Fields: firstName, lastName, age, gender, email, phone (+63 prefix), region, city, barangay
 * - Layout: 2-col → 2-col → full → full → 2-col → full
 *
 * Props:
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
 * @param {object} errors - Validation errors
 * @param {object} touched - Per-field touched state
 * @param {function} registerField - name => refCallback, provided by
 *   RegistrationStep1 so this section's fields participate in the
 *   whole-form "scroll to first invalid field" behavior.
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
export default function BasicInfoSection({
  form,
  onChange,
  errors,
  touched,
  registerField,
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
  function handleChange(e) {
    onChange(e);
  }

  function handleGenderChange(gender) {
    onChange({ target: { name: 'gender', value: gender } });
  }

  // Transform hook options to { value, label } format for SearchableSelect
  const provinceOptions = regionOptions.map((r) => ({
    value: r.region_code,
    label: r.region_name,
  }));

  const citySelectOptions = cityOptions.map((c) => ({
    value: c.city_code,
    label: c.city_name,
  }));

  const barangaySelectOptions = barangayOptions.map((b) => ({
    value: b.brgy_code,
    label: b.brgy_name,
  }));

  function handleProvinceChange(nextCode) {
    setRegionCode(nextCode);
    const selected = regionOptions.find((r) => r.region_code === nextCode);
    onChange({
      target: { name: 'province', value: selected?.region_name ?? '' },
    });
    // Reset city and barangay when province changes
    onChange({ target: { name: 'city', value: '' } });
    onChange({ target: { name: 'barangay', value: '' } });
  }

  function handleCityChange(nextCode) {
    setCityCode(nextCode);
    const selected = cityOptions.find((c) => c.city_code === nextCode);
    onChange({
      target: { name: 'city', value: selected?.city_name ?? '' },
    });
    // Reset barangay when city changes
    onChange({ target: { name: 'barangay', value: '' } });
  }

  function handleBarangayChange(nextCode) {
    setBarangayCode(nextCode);
    const selected = barangayOptions.find((b) => b.brgy_code === nextCode);
    onChange({
      target: { name: 'barangay', value: selected?.brgy_name ?? '' },
    });
  }

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
              options={AGE_OPTIONS}
              error={touched.age ? errors.age : undefined}
            />
          </div>
          {/* Gender Radio Buttons */}
          <div className='flex flex-col gap-1' ref={registerField('gender')}>
            <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
              Gender<span className='text-red-500 ml-0.5'>*</span>
            </label>
            <div className='flex items-center gap-6 pt-2'>
              {['Male', 'Female'].map((gender) => (
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

        {/* Row 5: Region / City (2-col) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div ref={registerField('province')}>
            <SearchableSelect
              label='Region'
              required
              value={regionCode}
              onChange={handleProvinceChange}
              options={provinceOptions}
              placeholder='Select your region'
              error={
                touched.province && (errors.province || addressError)
                  ? errors.province || addressError
                  : undefined
              }
            />
          </div>
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
          </div>
        </div>

        {/* Row 6: Barangay (full-width) */}
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
    </section>
  );
}