import { formatDate } from '@/lib/utils/eventUtils';

export const stepTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// Payload builder — isolates API shape from UI state
export function buildPayload(form, eventGuId) {
  const fullName = `${form.firstName} ${form.lastName}`.trim();

  return {
    eventGuid: eventGuId,
    fullName,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    age: form.age,
    gender: form.gender,
    email: form.email.trim(),
    mobileNumber: form.phone,
    company: form.company.trim() || null,
    position: form.position.trim() || null,
    myRoleInOccasion: form.role,
    eventDate: form.eventDate,
    occasionPlanningFor: form.occasion,
    occasionOther: form.occasionOther?.trim() || null,
    numberOfGuests: form.guests,
    budget: form.budget,
    suppliersLookingFor: (form.suppliers || []).join(', '),
    suppliersOther: form.suppliersOther?.trim() || null,
    specificSuppliers: form.specificSuppliers?.trim() || null,
    promoPreference: form.lumiPromos || null,
    discoveryOther: form.discoveryOther.trim() || null,
    province: form.province,
    city: form.city,
    locationOther: '',
    consent: form.consent,
    address: form.address || fullName,
    region: form.region || form.province,
    barangay: form.barangay || '',
    contactNumber: form.phone,
    purpose: form.purpose,
    source: form.source,
    visitorFrequency: form.visitorFrequency,
    agreedToTerms: 'Yes, I agree.',
    howHeardAboutEvent: form.discoveryChannel,
    firstTimeToJoin: 'Yes',
  };
}

export { formatDate };