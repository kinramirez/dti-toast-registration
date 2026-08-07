import { z } from 'zod';
import { REGIONS_WITHOUT_PROVINCES } from '@/hooks/usePhilippineAddress'; // adjust path to your actual hook location

export const initialForm = {
  // Basic Information
  firstName: '',
  lastName: '',
  age: '',
  gender: '',

  // Contact Information
  email: '',
  phone: '',

  // Organization/Company
  company: '',
  position: '',

  // Purpose of Visit
  role: '',
  eventDate: '',
  occasion: '',
  guests: '',
  budget: '',
  suppliers: [],
  occasionOther: '',
  suppliersOther: '',
  specificSuppliers: '',
  discoveryChannel: '',
  discoveryOther: '',
  province: '',
  city: '',
  barangay: '',
  consent: false,

  // Legacy fields (retained for backward compatibility)
  fullName: '',
  address: '',
  region: '',
  contactNumber: '',
  purpose: 'General Shopper',
  source: 'DTI Social Media',
  visitorFrequency: 'First-time Visitor',
  agreed: false,
};

// Builds the Step 1 validation schema. `isAddressRequired` comes from the
// event's `isAddressRequired` flag (EventFormPage reads it off the fetched
// event and passes it in) — when false, region/city/barangay become
// optional and the province superRefine check is skipped entirely, since
// there's no address section rendered at all for that event.
export function buildRegistrationSchema(isAddressRequired = true) {
  return z.object({
    // Basic Information
    firstName: z.string().trim().min(1, 'First name is required.'),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    age: z.string().min(1, 'Please select your age.'),
    gender: z.enum(['Male', 'Female'], {
      errorMap: () => ({ message: 'Please select your gender.' }),
    }),
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

    // Address — region/city/barangay are required only when the event
    // needs an address at all (isAddressRequired). Province is always
    // "optional" at the base schema level; its real requiredness (skipped
    // for regions with no provinces, e.g. NCR) is enforced in superRefine
    // below, and only checked at all when isAddressRequired is true.
    region: isAddressRequired
      ? z.string().min(1, 'Please select your region.')
      : z.string().optional(),
    province: z.string().optional(),
    city: isAddressRequired
      ? z.string().min(1, 'Please select your city.')
      : z.string().optional(),
    barangay: isAddressRequired
      ? z.string().min(1, 'Please select your barangay.')
      : z.string().optional(),

    // Organization/Company
    company: z.string().trim().min(1, 'Company is required.'),
    position: z.string().trim().min(1, 'Job position is required.'),

    // Purpose of Visit
    role: z.string().min(1, 'Please select your role.'),
    eventDate: z.string().min(1, 'Please select your event date.'),
    occasion: z.string().min(1, 'Please select the occasion.'),
    guests: z.string().min(1, 'Please select expected guests.'),
    budget: z.string().min(1, 'Please select your budget range.'),
    suppliers: z.array(z.string()).min(1, 'Please select at least one supplier.'),
    occasionOther: z.string().optional(),
    suppliersOther: z.string().optional(),
    specificSuppliers: z.string().optional(),
    discoveryChannel: z
      .string()
      .min(1, 'Please select how you heard about the event.'),
    discoveryOther: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (isAddressRequired) {
      const regionHasNoProvinces = REGIONS_WITHOUT_PROVINCES.has(data.region);

      if (!regionHasNoProvinces && !data.province?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['province'],
          message: 'Please select your province.',
        });
      }
    }

    if (data.occasion === 'Other' && !data.occasionOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['occasionOther'],
        message: 'Please specify your occasion.',
      });
    }
    if (data.suppliers.includes('Other') && !data.suppliersOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['suppliersOther'],
        message: 'Please specify other suppliers.',
      });
    }
    if (data.discoveryChannel === 'Other' && !data.discoveryOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discoveryOther'],
        message: 'Please specify how you heard about the event.',
      });
    }
  });
}

// Backward-compatible default: address-required schema (previous
// behavior), for any code path not yet updated to call
// buildRegistrationSchema(isAddressRequired) directly.
export const registrationSchema = buildRegistrationSchema(true);