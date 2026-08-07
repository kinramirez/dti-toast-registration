import { formatDate } from '@/lib/utils/eventUtils';

export const stepTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// Payload builder — isolates API shape from UI state
//
// `source` (3rd arg) is the ?source= URL param read in EventFormPage
// (e.g. 'ads' | 'organic' | 'bnb'), used for attribution. It falls back
// to form.source — the legacy hardcoded default ('DTI Social Media') —
// when no ?source= param is present on the link, so existing behavior
// is preserved for links that don't carry the new param.
export function buildPayload(form, eventGuId, source) {
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
    company: form.company.trim(),
    position: form.position.trim(),
    myRoleInOccasion: form.role,
    eventDate: form.eventDate,
    occasionPlanningFor: form.occasion,
    occasionOther: form.occasionOther?.trim() || null,
    numberOfGuests: form.guests,
    budget: form.budget,
    suppliersLookingFor: (form.suppliers || []).join(', '),
    suppliersOther: form.suppliersOther?.trim() || null,
    specificSuppliers: form.specificSuppliers?.trim() || null,
    discoveryOther: form.discoveryOther.trim() || null,
    province: form.province,
    city: form.city,
    locationOther: '',
    consent: form.consent,
    address: form.address || fullName,
    region: form.region,
    barangay: form.barangay || '',
    contactNumber: form.phone,
    purpose: form.purpose,
    source: source ?? form.source,
    visitorFrequency: form.visitorFrequency,
    agreedToTerms: 'Yes, I agree.',
    howHeardAboutEvent: form.discoveryChannel,
    firstTimeToJoin: 'Yes',
  };
}

export { formatDate };