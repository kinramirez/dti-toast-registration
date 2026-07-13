import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { usePhilippineAddress } from '../hooks/usePhilippineAddress';
import { registerEvent } from '../api/registration';
import { getEventById } from '../api/events';

import { initialForm, registrationSchema } from './EventFormPage.schema';
import { stepTransition, buildPayload } from './EventFormPage.utils';

import RegistrationHero from './sections/RegistrationHero';
import RegistrationSidebar from './sections/RegistrationSidebar';
import TrustFooterStrip from './sections/TrustFooterStrip';
import RegistrationStep1 from './sections/RegistrationStep1';
import RegistrationStep2 from './sections/RegistrationStep2';
import RegistrationSuccess from './sections/RegistrationSuccess';

export default function EventFormPage({ event: propEvent, hideBackLink = false, hideViewEventButton = false }) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // ── GUID Validation ──
  // Only the Toast Wedding Fair is registrable.
  const ALLOWED_GUID = '35e60ba5-5153-468b-853c-e22abc9521a7';

  // If no :id param (old /event/register route), show error.
  if (id === undefined) {
    return (
      <div className="relative z-10 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6 py-16 max-w-md">
          <h2 className="text-2xl font-bold text-[#5D5D5D] mb-3 font-satoshi">
            No Event Specified
          </h2>
          <p className="text-[#737373] text-sm leading-relaxed font-satoshi mb-6">
            Please use a valid registration link to access this page.
          </p>
          <button
            onClick={() => navigate('/event', { replace: true })}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  // If :id does not match the allowed GUID, show error.
  if (id !== ALLOWED_GUID) {
    return (
      <div className="relative z-10 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6 py-16 max-w-md">
          <h2 className="text-2xl font-bold text-[#5D5D5D] mb-3 font-satoshi">
            Invalid Event Link
          </h2>
          <p className="text-[#737373] text-sm leading-relaxed font-satoshi mb-6">
            This registration link is not valid. Please use the correct link
            provided for the event.
          </p>
          <button
            onClick={() => navigate('/event', { replace: true })}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  // Fetch event by ID when location.state is missing (direct URL / bookmark / refresh)
  const [fetchedEvent, setFetchedEvent] = useState(null);

  useEffect(() => {
    if (location.state?.event || !id) return;

    let cancelled = false;
    getEventById(id)
      .then((ev) => {
        if (!cancelled) setFetchedEvent(ev);
      })
      .catch((err) => {
        console.error('Failed to fetch event for registration success:', err);
      });

    return () => { cancelled = true; };
  }, [id, location.state?.event]);

  const event = location.state?.event ?? fetchedEvent ?? propEvent;
  const eventGuId = id ?? event?.guid ?? event?.id ?? event?.eventGuId ?? event?.guId;
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

  // Merged validation errors for all Step 1 fields
  const step1Errors = useMemo(() => {
    const result = registrationSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      age: form.age,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      province: form.province,
      city: form.city,
      barangay: form.barangay,
      company: form.company,
      position: form.position,
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      suppliers: form.suppliers,
      occasionOther: form.occasionOther,
      suppliersOther: form.suppliersOther,
      specificSuppliers: form.specificSuppliers,
      lumiPromos: form.lumiPromos,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther,
    });
    if (result.success) {
      // Consent is validated separately (only on Step 2)
      if (!form.consent) {
        return { consent: 'You must agree to the terms to continue.' };
      }
      return {};
    }
    const nextErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      nextErrors[field] = issue.message;
    }
    // Also check consent when other fields have errors
    if (!form.consent) {
      nextErrors.consent = 'You must agree to the terms to continue.';
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
      form.discoveryOther, form.province, form.city, form.barangay,
      form.occasionOther, form.suppliersOther,
    ];
    return nonEmptyFields.some((v) => v !== '' && v !== 'Male')
      || (Array.isArray(form.suppliers) && form.suppliers.length > 0);
  }, [form]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  // Step 1 → Step 2 (no confirmation modal)
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
      province: true,
      city: true,
      barangay: true,
      role: true,
      eventDate: true,
      occasion: true,
      guests: true,
      budget: true,
      suppliers: true,
      lumiPromos: true,
      discoveryChannel: true,
      ...(form.occasion === 'Other' ? { occasionOther: true } : {}),
      ...(form.suppliers.includes('Other') ? { suppliersOther: true } : {}),
    }));

    const result = registrationSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      age: form.age,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      province: form.province,
      city: form.city,
      barangay: form.barangay,
      company: form.company,
      position: form.position,
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      suppliers: form.suppliers,
      occasionOther: form.occasionOther,
      suppliersOther: form.suppliersOther,
      specificSuppliers: form.specificSuppliers,
      lumiPromos: form.lumiPromos,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther,
    });

    if (result.success) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  }

  function handleEdit(sectionName) {
    setStep(1);
    // After the step transition animation completes, scroll to the section
    setTimeout(() => {
      const el = document.getElementById(sectionName);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350); // Wait for framer-motion animation (300ms) + small buffer
  }

  // Step 2 → Submit
  function handleSubmitStep2(e) {
    e.preventDefault();
    setSubmitError(null);

    // Mark consent as touched
    setTouched((prev) => ({ ...prev, consent: true }));

    // Validate all Step 1 fields
    const result = registrationSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      age: form.age,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      province: form.province,
      city: form.city,
      barangay: form.barangay,
      company: form.company,
      position: form.position,
      role: form.role,
      eventDate: form.eventDate,
      occasion: form.occasion,
      guests: form.guests,
      budget: form.budget,
      suppliers: form.suppliers,
      occasionOther: form.occasionOther,
      suppliersOther: form.suppliersOther,
      specificSuppliers: form.specificSuppliers,
      lumiPromos: form.lumiPromos,
      discoveryChannel: form.discoveryChannel,
      discoveryOther: form.discoveryOther,
    });

    if (!result.success) return;

    // Validate consent separately (only on Step 2)
    if (!form.consent) return;

    submitRegistration();
  }

  async function submitRegistration() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildPayload(form, eventGuId);
      const data = await registerEvent(payload);
      console.log('Registration response:', data);
      setStep(3);
      window.scrollTo(0, 0);
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
    <div className='relative z-10 bg-white'>
      {/* ── Hero Band (Steps 1 & 2 only; Step 3 has its own hero) ── */}
      {(step === 1 || step === 2) && <RegistrationHero eventId={eventGuId} hideBackLink={true} />}

      {/* ── Steps 1 & 2: Two-Column Layout ── */}
      {(step === 1 || step === 2) && (
        <>
          <div className='w-full max-w-[1600px] mx-auto px-8 py-12 flex flex-col lg:flex-row gap-8'>
            {/* Left: Form Card */}
            <div className='flex-1 lg:max-w-[977px]'>
              <AnimatePresence mode='wait'>
                {step === 1 && (
                  <motion.div
                    key='step1'
                    {...stepTransition}
                  >
                    <RegistrationStep1
                      form={form}
                      onChange={onChange}
                      errors={step1Errors}
                      touched={touched}
                      onNext={handleNextStep1}
                      regionCode={regionCode}
                      setRegionCode={setRegionCode}
                      cityCode={cityCode}
                      setCityCode={setCityCode}
                      barangayCode={barangayCode}
                      setBarangayCode={setBarangayCode}
                      regionOptions={regionOptions}
                      cityOptions={cityOptions}
                      barangayOptions={barangayOptions}
                      addressError={addressError}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key='step2'
                    {...stepTransition}
                  >
                    <RegistrationStep2
                      form={form}
                      onChange={onChange}
                      errors={step1Errors}
                      touched={touched}
                      onSubmit={handleSubmitStep2}
                      onEdit={handleEdit}
                      isSubmitting={isSubmitting}
                      submitError={submitError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Sidebar */}
            {step === 1 && <RegistrationSidebar />}
            {step === 2 && <RegistrationSidebar showWhyRegister={false} />}
          </div>

          {/* ── Trust Footer Strip ── */}
          <div className='w-full max-w-[1600px] mx-auto px-8 pb-12'>
            <TrustFooterStrip />
          </div>

          {/* ── Site Footer (registration page only) ── */}
          <footer
            className='w-full flex items-center justify-center font-satoshi'
            style={{ backgroundColor: '#F1F1F1', height: '43px' }}
          >
            <span className='text-[12px] text-neutral-gray'>
              &copy; 2026 Toast Wedding Fair. All rights reserved
            </span>
          </footer>
        </>
      )}

      {/* ── Step 3: Full-width Success Page (no two-column wrapper) ── */}
      {step === 3 && (
        <AnimatePresence mode='wait'>
          <motion.div key='step3' {...stepTransition}>
            <RegistrationSuccess
              userEmail={form.email}
              event={event}
              onBackToHome={handleBackToHome}
              hideViewEventButton={true}
              hideContactLink={true}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Loading Overlay ── */}
      {isSubmitting && (
        <div className='fixed inset-0 z-50 bg-black/70'>
          <div className='flex h-full w-full items-center justify-center px-6'>
            <div className='flex flex-col items-center justify-center'>
              <div className='mt-6 flex items-center justify-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-[#C55F61] animate-bounce [animation-delay:-0.2s]' />
                <span className='h-2 w-2 rounded-full bg-[#C55F61] animate-bounce [animation-delay:-0.1s]' />
                <span className='h-2 w-2 rounded-full bg-[#C55F61] animate-bounce' />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
