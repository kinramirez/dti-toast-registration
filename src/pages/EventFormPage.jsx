import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { usePhilippineAddress } from '../hooks/usePhilippineAddress';
import { registerEvent } from '../api/registration';

import RegistrationStep1 from './sections/RegistrationStep1';
import RegistrationStep2 from './sections/RegistrationStep2';
import RegistrationStep3 from './sections/RegistrationStep3';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const initialForm = {
  // Step 1 — Basic Information
  firstName: '',
  lastName: '',
  age: '',
  gender: 'Male',

  // Step 1 — Contact Information
  email: '',
  phone: '',

  // Step 1 — Job Information
  company: '',
  position: '',

  // Step 2 — Purpose of Visit
  role: '',
  eventDate: '',
  occasion: '',
  guests: '',
  budget: '',
  // suppliers: omitted — Field 6 hidden until product/API finalizes
  specificSuppliers: '',
  lumiPromos: '',
  discoveryChannel: '',
  discoveryOther: '',
  province: '',
  city: '',
  locationOther: '',
  consent: false,

  // Legacy fields (retained from original form, unused by new steps)
  fullName: '',
  address: '',
  region: '',
  barangay: '',
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

// Step 1 validation schema
const step1Schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  age: z.string().min(1, 'Please select your age range.'),
  gender: z.enum(['Male', 'Female']),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .regex(
      /^9\d{9}$/,
      'Please enter a valid 10-digit number starting with 9 (e.g., 9123456789).',
    ),
  company: z.string().optional(),
  position: z.string().optional(),
});

// Step 2 validation schema
const step2Schema = z.object({
  role: z.string().min(1, 'Please select your role.'),
  eventDate: z.string().min(1, 'Please select your event date.'),
  occasion: z.string().min(1, 'Please select the occasion.'),
  guests: z.string().min(1, 'Please select expected guests.'),
  budget: z.string().min(1, 'Please select your budget range.'),
  specificSuppliers: z.string().optional(),
  lumiPromos: z.string().optional(),
  discoveryChannel: z
    .string()
    .min(1, 'Please select how you heard about the event.'),
  discoveryOther: z.string().optional(),
  province: z.string().min(1, 'Please select your province.'),
  city: z.string().min(1, 'Please select your city.'),
  locationOther: z
    .string()
    .trim()
    .min(1, 'Please specify your province/city.'),
  consent: z.literal(true, {
    errorMap: () => ({
      message: 'You must agree to receive updates and communications.',
    }),
  }),
});

const stepTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export default function EventFormPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const eventGuId = event?.guid ?? event?.id ?? event?.eventGuId ?? event?.guId;
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

  // Step 1 validation errors
  const step1Errors = useMemo(() => {
    const result = step1Schema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      age: form.age,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      company: form.company,
      position: form.position,
    });
    if (result.success) return {};
    const nextErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      nextErrors[field] = issue.message;
    }
    return nextErrors;
  }, [form]);

  // Step 2 validation errors
  const step2Errors = useMemo(() => {
    const result = step2Schema.safeParse({
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      specificSuppliers: form.specificSuppliers,
      lumiPromos: form.lumiPromos,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther,
      province: form.province,
      city: form.city,
      locationOther: form.locationOther,
      consent: form.consent,
    });
    if (result.success) return {};
    const nextErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      nextErrors[field] = issue.message;
    }
    return nextErrors;
  }, [form]);

  // Check if form has any data (for beforeunload warning)
  const hasData = useMemo(() => {
    const nonEmptyFields = [
      form.firstName, form.lastName, form.age,
      form.email, form.phone, form.company, form.position,
      form.role, form.eventDate, form.occasion, form.guests, form.budget,
      form.specificSuppliers, form.lumiPromos, form.discoveryChannel,
      form.discoveryOther, form.province, form.locationOther,
    ];
    return nonEmptyFields.some((v) => v !== '' && v !== 'Male');
  }, [form]);

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

  // Step 1 → Confirmation Modal
  function handleNextStep1() {
    // Mark all Step 1 fields as touched
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      age: true,
      gender: true,
      email: true,
      phone: true,
    }));

    const result = step1Schema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      age: form.age,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      company: form.company,
      position: form.position,
    });

    if (result.success) {
      setShowConfirmModal(true);
    }
  }

  function handleCancelModal() {
    setShowConfirmModal(false);
  }

  function handleContinueModal() {
    setShowConfirmModal(false);
    setStep(2);
  }

  function handleBack() {
    setStep((prev) => Math.max(1, prev - 1));
  }

  // Step 2 → Submit
  function handleSubmitStep2(e) {
    e.preventDefault();
    setSubmitError(null);

    // Mark all Step 2 fields as touched
    setTouched((prev) => ({
      ...prev,
      role: true,
      eventDate: true,
      occasion: true,
      guests: true,
      budget: true,
      discoveryChannel: true,
      province: true,
      city: true,
      locationOther: true,
      consent: true,
    }));

    const result = step2Schema.safeParse({
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      specificSuppliers: form.specificSuppliers,
      lumiPromos: form.lumiPromos,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther,
      province: form.province,
      city: form.city,
      locationOther: form.locationOther,
      consent: form.consent,
    });

    if (!result.success) return;

    // Build payload and submit
    submitRegistration();
  }

  // Payload builder — isolates API shape from UI state
  function buildPayload() {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const cleanedNumber = form.phone.replace(/[\s()-]/g, '');
    const isMobile = mobilePattern.test(cleanedNumber);

    return {
      eventGuId,
      // Step 1 fields
      fullName,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      age: form.age,
      gender: form.gender,
      email: form.email.trim(),
      phone1: isMobile ? cleanedNumber : null,
      phone2: null,
      landline1: !isMobile ? cleanedNumber : null,
      landline2: null,
      company: form.company.trim() || null,
      position: form.position.trim() || null,
      // Step 2 fields
      // TODO: confirm payload keys with Backend
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      specificSuppliers: form.specificSuppliers.trim() || null,
      lumiPromos: form.lumiPromos || null,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther.trim() || null,
      province: form.province,
      city: form.city,
      locationOther: form.locationOther.trim(),
      consent: form.consent,
      // Legacy fields (for backward compatibility)
      address: form.address || fullName,
      region: form.region || form.province,
      barangay: form.barangay || '',
      contactNumber: form.phone,
      purpose: form.purpose,
      source: form.source,
      visitorFrequency: form.visitorFrequency,
      agreedToTerms: form.consent,
      purposeOfVisit: form.role,
      howHeardAboutEvent: form.discoveryChannel,
      firstTimeToJoin: 'Yes',
    };
  }

  async function submitRegistration() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildPayload();
      const data = await registerEvent(payload);
      console.log('Registration response:', data);
      setStep(3);
    } catch (error) {
      console.error(error);
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // beforeunload warning when form has data
  useEffect(() => {
    if (!hasData || step === 3) return;

    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasData, step]);

  // Scroll to top on step transition (via onAnimationComplete)
  function handleStep1ExitComplete() {
    window.scrollTo(0, 0);
  }

  function handleStep2ExitComplete() {
    window.scrollTo(0, 0);
  }

  function handleBackToHome() {
    setForm(initialForm);
    setIsSubmitting(false);
    setStep(1);
    setTouched({});
    setSubmitError(null);
    setRegionCode('');
    setCityCode('');
    setBarangayCode('');
    navigate('/event', { replace: true });
  }

  return (
    <div className='relative z-10'>
      <AnimatePresence mode='wait'>
        {step === 1 && (
          <motion.div
            key='step1'
            {...stepTransition}
            onAnimationComplete={handleStep1ExitComplete}
          >
            <RegistrationStep1
              form={form}
              onChange={onChange}
              errors={step1Errors}
              touched={touched}
              onNext={handleNextStep1}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key='step2'
            {...stepTransition}
            onAnimationComplete={handleStep2ExitComplete}
          >
            <RegistrationStep2
              form={form}
              onChange={onChange}
              errors={step2Errors}
              touched={touched}
              onSubmit={handleSubmitStep2}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              regionCode={regionCode}
              setRegionCode={setRegionCode}
              cityCode={cityCode}
              setCityCode={setCityCode}
              regionOptions={regionOptions}
              cityOptions={cityOptions}
              addressError={addressError}
              submitError={submitError}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key='step3' {...stepTransition}>
            <RegistrationStep3 onBackToHome={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onCancel={handleCancelModal}
        onContinue={handleContinueModal}
        title='Next Step?'
        body='Save and continue to Purpose of Visit. Help us prep the best suppliers for you.'
        cancelLabel='Cancel'
        continueLabel='Continue'
        icon={<ArrowRight className='w-5 h-5' />}
      />

      {isSubmitting && (
        <div className='fixed inset-0 z-50 bg-black/70'>
          <div className='flex h-full w-full items-center justify-center px-6'>
            <div className='flex flex-col items-center justify-center'>
              <div className='mt-6 flex items-center justify-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.2s]' />
                <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.1s]' />
                <span className='h-2 w-2 rounded-full bg-brand-blue animate-bounce' />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
