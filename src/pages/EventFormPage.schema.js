import { z } from 'zod';

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

// Merged validation schema for all Step 1 fields
export const registrationSchema = z.object({
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
  province: z.string().min(1, 'Please select your region.'),
  city: z.string().min(1, 'Please select your city.'),
  barangay: z.string().min(1, 'Please select your barangay.'),

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