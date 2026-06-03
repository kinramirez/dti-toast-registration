import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { usePhilippineAddress } from '../hooks/usePhilippineAddress';
import { registerEvent } from '../api/registration';

import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/600.css';

const initialForm = {
  fullName: '',
  address: '',
  region: '',
  city: '',
  barangay: '',
  email: '',
  contactNumber: '',
  purpose: 'General Shopper',
  source: 'DTI Social Media',
  visitorFrequency: 'First-time Visitor',
  agreed: false,
};

const mobilePattern = /^(?:09\d{9}|\+639\d{9})$/;
const landlinePattern = /^(?:0|\+63)\d{2,3}\d{7,8}$/;

function isPhContactNumber(value) {
  const normalized = value.replace(/[\s()-]/g, '');
  return mobilePattern.test(normalized) || landlinePattern.test(normalized);
}

const eventFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .regex(
      /^[\p{L}][\p{L}\s.''-]{1,58}[\p{L}.']$/u,
      'Please enter your full name.',
    ),
  address: z.string().trim().min(1, 'Please enter your full address.'),
  region: z.string(),
  city: z.string(),
  barangay: z.string(),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required.')
    .refine(isPhContactNumber, {
      message: 'Please enter a valid contact number.',
    }),
  purpose: z.enum(['General Shopper', 'Exhibitor', 'Media']),
  source: z.enum(['DTI Social Media', 'Word of Mouth', 'Email']),
  visitorFrequency: z.enum(['First-time Visitor', 'Repeat Visitor']),
  agreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms.' }),
  }),
});

function isFieldRequired(fieldName) {
  const shape =
    typeof eventFormSchema._def.shape === 'function'
      ? eventFormSchema._def.shape()
      : eventFormSchema._def.shape;
  const field = shape?.[fieldName];
  if (!field) return false;
  return (
    field._def.typeName !== 'ZodOptional' &&
    field._def.typeName !== 'ZodDefault'
  );
}

export default function EventFormPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const eventGuId = event?.guid ?? event?.eventGuId ?? event?.guId;
  const {
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
  } = usePhilippineAddress();

  const errors = useMemo(() => {
    const normalizedForm = {
      ...form,
      fullName: String(form.fullName ?? '').trim(),
      email: String(form.email ?? '').trim(),
      contactNumber: String(form.contactNumber ?? ''),
    };

    const result = eventFormSchema.safeParse(normalizedForm);
    if (result.success) return {};

    const nextErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      nextErrors[field] = issue.message;
    }

    return nextErrors;
  }, [form]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && form.agreed;
  }, [errors, form.agreed]);

  function markTouched(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function onRegionChange(nextCode) {
    setRegionCode(nextCode);
    const selected = regionOptions.find((r) => r.region_code === nextCode);
    setForm((prev) => ({
      ...prev,
      region: selected?.region_name ?? '',
      city: '',
      barangay: '',
    }));
  }

  function onCityChange(nextCode) {
    setCityCode(nextCode);
    const selected = cityOptions.find((c) => c.city_code === nextCode);
    setForm((prev) => ({
      ...prev,
      city: selected?.city_name ?? '',
      barangay: '',
    }));
  }

  function onBarangayChange(nextCode) {
    setBarangayCode(nextCode);
    const selected = barangayOptions.find((b) => b.brgy_code === nextCode);
    setForm((prev) => ({ ...prev, barangay: selected?.brgy_name ?? '' }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setTouched((prev) => ({
        ...prev,
        fullName: true,
        address: true,
        email: true,
        contactNumber: true,
      }));
      return;
    }

    setIsSubmitting(true);

    const cleanedNumber = form.contactNumber.replace(/[\s()-]/g, '');
    const isMobile = mobilePattern.test(cleanedNumber);

    const payload = {
      eventGuId,
      fullName: form.fullName.trim(),
      address: form.address.trim(),
      region: form.region,
      city: form.city,
      barangay: form.barangay,
      email: form.email.trim(),
      phone1: isMobile ? cleanedNumber : null,
      phone2: null,
      landline1: !isMobile ? cleanedNumber : null,
      landline2: null,
      purposeOfVisit: form.purpose,
      howHeardAboutEvent: form.source,
      firstTimeToJoin:
        form.visitorFrequency === 'First-time Visitor' ? 'Yes' : 'No',
      agreedToTerms: form.agreed,
    };

    try {
      const data = await registerEvent(payload);
      console.log('Registration response:', data);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      window.alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='relative z-10 -mt-52 sm:-mt-40 md:-mt-40 pb-20'>
      <section className='min-h-screen py-12 px-4 sm:px-8 font-kanit mt-4'>
        <div className='mx-auto w-full max-w-3xl'>
          <form
            className='rounded-2xl bg-white p-6 sm:p-12 shadow-2xl border border-slate-50'
            onSubmit={onSubmit}
          >
            {/* Event Name Read-only */}
            <div className='mb-8'>
              <label className='text-xl font-medium text-slate-400 uppercase mb-1 block'>
                Event
              </label>
              <div className='w-full bg-[#E8F0FE] border border-blue-200 rounded-md px-4 py-3 text-brand-blue text-sm'>
                {event?.title ?? 'DTI Wedding Fair 2026'}
              </div>
            </div>

            {/* Basic Information */}
            <div className='space-y-2'>
              <h3 className='text-brand-blue text-lg font-semibold border-slate-100 pb-2'>
                Basic Information
              </h3>

              <div className='grid gap-4'>
                <Field
                  label='Name'
                  name='fullName'
                  required={isFieldRequired('fullName')}
                  value={form.fullName}
                  onChange={onChange}
                  onBlur={() => markTouched('fullName')}
                  placeholder='Full name'
                  error={touched.fullName ? errors.fullName : undefined}
                />
                <Field
                  label='Address, St. House Number'
                  name='address'
                  required={isFieldRequired('address')}
                  value={form.address}
                  onChange={onChange}
                  onBlur={() => markTouched('address')}
                  placeholder='Address'
                  error={touched.address ? errors.address : undefined}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <SearchableSelect
                    label='Region'
                    value={regionCode}
                    onChange={onRegionChange}
                    placeholder='Select Region'
                    options={regionOptions.map((r) => ({
                      value: r.region_code,
                      label: r.region_name,
                    }))}
                  />
                  <SearchableSelect
                    label='City'
                    value={cityCode}
                    onChange={onCityChange}
                    disabled={!regionCode}
                    placeholder={regionCode ? 'Select City' : 'City'}
                    options={cityOptions.map((c) => ({
                      value: c.city_code,
                      label: c.province_name
                        ? `${c.city_name} (${c.province_name})`
                        : c.city_name,
                    }))}
                  />
                </div>
                <SearchableSelect
                  label='Barangay'
                  value={barangayCode}
                  onChange={onBarangayChange}
                  disabled={!cityCode}
                  placeholder={cityCode ? 'Select Barangay' : 'Barangay'}
                  options={barangayOptions.map((b) => ({
                    value: b.brgy_code,
                    label: b.brgy_name,
                  }))}
                />

                {addressError ? (
                  <p className='text-[11px] text-red-500'>{addressError}</p>
                ) : null}
              </div>
            </div>

            {/* Contact Information */}
            <div className='mt-10 space-y-2'>
              <h3 className='text-brand-blue text-lg font-semibold border-slate-100 pb-2'>
                Contact Information
              </h3>
              <div className='grid gap-4'>
                <Field
                  label='Email'
                  name='email'
                  type='email'
                  required={isFieldRequired('email')}
                  value={form.email}
                  onChange={onChange}
                  onBlur={() => markTouched('email')}
                  placeholder='Email Address'
                  error={touched.email ? errors.email : undefined}
                />
                <Field
                  label='Contact Number'
                  name='contactNumber'
                  required={isFieldRequired('contactNumber')}
                  value={form.contactNumber}
                  onChange={onChange}
                  onBlur={() => markTouched('contactNumber')}
                  placeholder='09XXXXXXXXX, +639XXXXXXXXX, or 02XXXXXXXX'
                  hint='Accepts mobile (09XX / +639XX) or landline (02X / 0XX / +63X)'
                  error={
                    touched.contactNumber ? errors.contactNumber : undefined
                  }
                />
              </div>
            </div>

            {/* Purpose & Marketing */}
            <div className='mt-10 space-y-2'>
              <h3 className='text-brand-blue text-lg font-semibold border-slate-100 pb-2'>
                Type
              </h3>
              <Select
                label='Purpose of Visit'
                name='purpose'
                value={form.purpose}
                onChange={onChange}
                options={['General Shopper', 'Exhibitor', 'Media']}
              />

              <h3 className='text-brand-blue text-lg font-semibold border-slate-100 pb-2 mt-10'>
                About the Event
              </h3>
              <Select
                label='How did you hear about the event?'
                name='source'
                value={form.source}
                onChange={onChange}
                options={['DTI Social Media', 'Word of Mouth', 'Email']}
              />

              <h3 className='text-brand-blue text-lg font-semibold border-slate-100 pb-2 mt-10'>
                Visitor Frequency
              </h3>
              <Select
                label='First-time to join?'
                name='visitorFrequency'
                value={form.visitorFrequency}
                onChange={onChange}
                options={['First-time Visitor', 'Repeat Visitor']}
              />
            </div>

            {/* Terms */}
            <div className='mt-10 flex items-start gap-3'>
              <input
                type='checkbox'
                name='agreed'
                id='agreed'
                checked={form.agreed}
                onChange={onChange}
                className='mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue'
              />
              <label
                htmlFor='agreed'
                className='text-[11px] text-slate-500 leading-relaxed'
              >
                I have read and agree to the{' '}
                <span className='text-blue-500 cursor-pointer'>
                  Privacy policy
                </span>
                ,{' '}
                <span className='text-blue-500 cursor-pointer'>
                  Terms of Conditions
                </span>
                , and{' '}
                <span className='text-blue-500 cursor-pointer'>
                  community guidelines
                </span>
                .
              </label>
            </div>

            {/* Submit */}
            <div className='mt-12 flex justify-center'>
              <button
                type='submit'
                disabled={!isValid || isSubmitting}
                className='w-full sm:w-2/3 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white py-4 rounded-full font-medium shadow-lg text-sm'
              >
                Register Event
              </button>
            </div>
          </form>
        </div>
      </section>

      {(isSubmitting || submitted) && (
        <div className='fixed inset-0 z-50 bg-black/70'>
          {isSubmitting ? (
            <div className='flex h-full w-full items-center justify-center px-6'>
              <div className='flex flex-col items-center justify-center'>
                <div className='mt-6 flex items-center justify-center gap-2'>
                  <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.2s]' />
                  <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.1s]' />
                  <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce' />
                </div>
              </div>
            </div>
          ) : (
            <div className='relative h-full w-full px-6 py-10'>
              <div className='mx-auto w-full max-w-5xl'>
                <div className='flex min-h-screen items-center justify-center'>
                  <div
                    role='dialog'
                    aria-modal='true'
                    className='w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl font-kanit'
                    style={{
                      fontFamily:
                        'Kanit, system-ui, Segoe UI, Roboto, Arial, sans-serif',
                    }}
                  >
                    <div className='flex justify-center'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue'>
                        <svg
                          width='22'
                          height='22'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                        >
                          <path
                            d='M20 6L9 17l-5-5'
                            stroke='white'
                            strokeWidth='2.8'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                    </div>

                    <h2 className='mt-6 text-center text-[20px] font-semibold text-slate-900'>
                      Registration Successful!
                    </h2>
                    <p className='mt-2 text-center text-sm text-slate-500'>
                      You've successfully registered for{' '}
                      {form.fullName ? form.fullName : 'the event'}.
                      <br />
                      We're excited to have you join us!
                      <br />
                      Check your email for the e-ticket and more details about
                      the event.
                    </p>

                    <div className='mt-6 flex justify-center'>
                      <button
                        type='button'
                        className='w-full max-w-[240px] rounded-full bg-gradient-to-r from-brand-blue to-[#1259B5] py-3 text-sm text-white transition-all hover:opacity-95'
                        onClick={() => {
                          setSubmitted(false);
                          setForm(initialForm);
                          setIsSubmitting(false);
                          setRegionCode('');
                          setCityCode('');
                          setBarangayCode('');
                          navigate('/event');
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Renders a red asterisk only when required={true}
function RequiredMark() {
  return <span className='text-red-500 ml-0.5'>*</span>;
}

function Field({ label, required, hint, ...props }) {
  const { error, className, ...rest } = props;
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-base text-slate-500 font-light'>
        {label}
        {required && <RequiredMark />}
      </label>
      <input
        className={`w-full bg-[#F3F3F3] border-none rounded-md px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
          error
            ? 'ring-2 ring-red-100 focus:ring-red-200'
            : 'focus:ring-blue-100'
        } ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        aria-required={required}
        {...rest}
      />
      {hint && !error ? (
        <p className='text-[11px] text-slate-400'>{hint}</p>
      ) : null}
      {error ? <p className='text-[11px] text-red-500'>{error}</p> : null}
    </div>
  );
}

function Select({ label, required, options, placeholder, error, ...props }) {
  const isPlaceholderSelected = props.value === '' || props.value == null;
  const isDisabled = Boolean(props.disabled);

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-base text-slate-500 font-light'>
        {label}
        {required && <RequiredMark />}
      </label>
      <div className='relative'>
        <select
          className={`w-full appearance-none bg-[#F3F3F3] border-none rounded-md pl-4 pr-10 py-3 text-sm outline-none transition-all disabled:cursor-not-allowed disabled:opacity-60 focus:ring-2 ${
            error
              ? 'ring-2 ring-red-100 focus:ring-red-200'
              : 'focus:ring-blue-100'
          } ${isPlaceholderSelected ? 'text-slate-400' : 'text-slate-800'}`}
          aria-invalid={Boolean(error)}
          aria-required={required}
          {...props}
        >
          {placeholder ? (
            <option value='' disabled>
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        <div
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 ${
            isDisabled ? 'opacity-60' : 'opacity-100'
          }`}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M6 9l6 6 6-6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>
      {error ? <p className='text-[11px] text-red-500'>{error}</p> : null}
    </div>
  );
}

function SearchableSelect({
  label,
  required,
  options,
  placeholder,
  error,
  value,
  onChange,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  function handleSelect(optValue) {
    onChange(optValue);
    setQuery('');
    setOpen(false);
  }

  function handleBlur(e) {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div className='flex flex-col gap-1' ref={containerRef} onBlur={handleBlur}>
      <label className='text-base text-slate-500 font-light'>
        {label}
        {required && <RequiredMark />}
      </label>
      <div className='relative'>
        <input
          type='text'
          readOnly={!open}
          disabled={disabled}
          value={open ? query : selectedLabel}
          placeholder={placeholder ?? `Select ${label}`}
          onClick={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full bg-[#F3F3F3] border-none rounded-md pl-4 pr-10 py-3 text-sm outline-none transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus:ring-2 focus:ring-blue-100 ${
            !selectedLabel && !open ? 'text-slate-400' : 'text-slate-800'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 ${disabled ? 'opacity-60' : ''}`}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M6 9l6 6 6-6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        {open && (
          <ul className='absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-md bg-white shadow-lg border border-slate-100 text-sm'>
            {filtered.length === 0 ? (
              <li className='px-4 py-2 text-slate-400'>No results</li>
            ) : (
              filtered.map((o) => (
                <li
                  key={o.value}
                  tabIndex={0}
                  onMouseDown={() => handleSelect(o.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(o.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    o.value === value
                      ? 'bg-blue-100 text-brand-blue font-medium'
                      : 'text-slate-800'
                  }`}
                >
                  {o.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error ? <p className='text-[11px] text-red-500'>{error}</p> : null}
    </div>
  );
}
