import { Mail, Info } from 'lucide-react';
import { useState } from 'react';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import StepIndicator from '@/components/ui/StepIndicator';

import toastLogo from '@/assets/toast.png';
import toastBg from '@/assets/toast-bg.png';

const STEPS = [
  { number: 1, label: 'Registration' },
  { number: 2, label: 'Purpose of Visit' },
];

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

export default function RegistrationStep1({
  form,
  onChange,
  errors,
  touched,
  onNext,
}) {
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);

  function handleChange(e) {
    onChange(e);
  }

  function handleGenderChange(gender) {
    onChange({ target: { name: 'gender', value: gender } });
  }

  function handleNext(e) {
    e.preventDefault();
    onNext();
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
          <StepIndicator currentStep={1} steps={STEPS} />
        </div>

        {/* ── Disclaimers (Standard Tags) ── */}
        <div className='mb-16 space-y-1 justify-items-center text-center'>
          <p className='text-[16px] italic text-gray-700 mb-16'>
            Free entrance for those who register now until February 25, 2026! Submission of this form confirms that you agree to receive updates about Toast Wedding Fair! If you receive the form auto reply, it means we have received your form and you are guaranteed FREE ENTRY! Valid ID should be presented on the day. Name should match valid ID.
          </p>
          <p className='text-[16px] italic text-[#ED1C24]'>
            1 Registration = 1 Person = 1 Full Day Entry.
          </p>
          <p className='text-[16px] italic text-[#ED1C24]'>
            Only 1 full day entry is free so no need to register the same person twice.
          </p>
        </div>

        <form onSubmit={handleNext}>
          {/* ── Basic Information ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Basic Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <FormField
                label='First Name (as shown on valid ID)'
                name='firstName'
                required
                value={form.firstName}
                onChange={handleChange}
                placeholder='Juan'
                error={touched.firstName ? errors.firstName : undefined}
              />
              <FormField
                label='Last Name (as shown on valid ID)'
                name='lastName'
                required
                value={form.lastName}
                onChange={handleChange}
                placeholder='Dela Cruz'
                error={touched.lastName ? errors.lastName : undefined}
              />
              <FormSelect
                label='Age'
                name='age'
                required
                value={form.age}
                onChange={handleChange}
                placeholder='Select age range'
                options={AGE_OPTIONS}
                error={touched.age ? errors.age : undefined}
              />
              {/* Gender Radio Buttons */}
              <div className='flex flex-col gap-1'>
                <label className='text-[#1877F2] mb-2 block text-base font-medium'>
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
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            form.gender === gender
                              ? 'border-[#1877F2]'
                              : 'border-[#DADADA]'
                          }`}
                        >
                          {form.gender === gender && (
                            <div className='w-2.5 h-2.5 rounded-full bg-[#1877F2]' />
                          )}
                        </div>
                      </div>
                      <span className='text-[16px] text-slate-700 font-medium'>
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
          </div>

          {/* ── Contact Information ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Contact Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <FormField
                label='Email'
                name='email'
                type='email'
                required
                value={form.email}
                onChange={handleChange}
                placeholder='ex. juandelacruz@gmail.com'
                icon={<Mail className='w-5 h-5' />}
                error={touched.email ? errors.email : undefined}
              />
              
              {/* ── Phone Field ── */}
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-[#1877F2] text-base font-medium'>
                    Phone<span className='text-red-500 ml-0.5'>*</span>
                  </label>
                  
                  <div 
                    className='relative flex items-center'
                    onMouseEnter={() => setShowPhoneTooltip(true)}
                    onMouseLeave={() => setShowPhoneTooltip(false)}
                  >
                    <button
                      type='button'
                      onClick={() => setShowPhoneTooltip(!showPhoneTooltip)}
                      onBlur={() => setShowPhoneTooltip(false)}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold transition-colors cursor-pointer ${showPhoneTooltip ? 'bg-[#808080]' : 'bg-[#DADADA] hover:bg-[#808080]'}`}
                      aria-label='Phone number format info'
                    >
                      i
                    </button>
                    
                    {showPhoneTooltip && (
                      <div className='absolute right-0 bottom-full mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10'>
                        <p className='text-[11px] text-red-500 leading-relaxed mb-2'>
                          Number Format
                        </p>
                        <p className='text-[11px] text-slate-600 leading-relaxed'>
                          Use format 9xxxxxxxxx. No 0 at the start, no space, no dash nor slash. We will be only texting winners with the correct format.
                        </p>
                        <div className='absolute right-[6px] top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white' />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className='relative'>
                  <input
                    type='tel'
                    name='phone'
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder='+63'
                    className={`w-full bg-[#F1F1F1] border-none rounded-lg px-5 py-4 text-sm text-slate-800 outline-none transition-all placeholder:text-[#808080] focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1 ${
                      touched.phone && errors.phone
                        ? 'ring-2 ring-red-100 focus:ring-red-200'
                        : ''
                    }`}
                    aria-invalid={Boolean(touched.phone && errors.phone)}
                    aria-required
                  />
                </div>

                {touched.phone && errors.phone ? (
                  <p className='text-[11px] text-red-500 mt-0.5'>
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Job Information ── */}
          <div className='mb-16'>
            <h2 className='text-[#808080] font-bold text-[16px] mb-6'>
              Job Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <FormField
                label='Company'
                name='company'
                value={form.company}
                onChange={handleChange}
                placeholder='Company Name'
              />
              <FormField
                label='Position'
                name='position'
                value={form.position}
                onChange={handleChange}
                placeholder='Job Position'
              />
            </div>
          </div>

          {/* ── Next Step Button ── */}
          <div className='flex justify-center'>
            <button
              type='submit'
              className='w-full max-w-md bg-[#1877F2] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white px-8 py-4 rounded-lg font-bold text-[24px] shadow-lg'
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}