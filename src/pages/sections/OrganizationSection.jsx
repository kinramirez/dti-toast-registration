import { Building2 } from 'lucide-react';

import FormField from '@/components/ui/FormField';

/**
 * OrganizationSection — Organization/Company Information form sub-section.
 *
 * Design spec §2.6:
 * - Section header: Building2 icon badge + "Organization/Company Information" + subtitle
 * - Fields: company, position (2-col), both required
 *
 * Props:
 * @param {object} form - All form field values
 * @param {function} onChange - Generic field change handler
 * @param {function} onFieldTouch - Marks a field as touched on blur
 * @param {object} errors - Validation errors
 * @param {object} touched - Per-field touched state
 */
export default function OrganizationSection({
  form,
  onChange,
  onFieldTouch,
  errors,
  touched,
}) {
  function handleChange(e) {
    onChange(e);
  }

  function handleBlur(name) {
    onFieldTouch?.(name);
  }

  return (
    <section id='organization' className='mb-[34px]'>
      {/* Section header block */}
      <div className='flex items-center gap-6 mb-8'>
        <div
          className='w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0'
          style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
          aria-hidden='true'
        >
          <Building2 className='w-6 h-6' style={{ color: '#C55F61' }} />
        </div>
        <div className='flex flex-col'>
          <h3 className='font-satoshi text-[20px] font-bold text-brand-dark'>
            Organization/Company Information
          </h3>
          <p className='font-satoshi text-[12px] text-neutral-gray'>
            Tell us about your organization or business
          </p>
        </div>
      </div>

      {/* Fields: Company / Job Position (2-col) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div id='field-company'>
          <FormField
            label='Company'
            name='company'
            required
            value={form.company}
            onChange={handleChange}
            onBlur={() => handleBlur('company')}
            placeholder='Enter your company'
            error={touched?.company ? errors?.company : undefined}
          />
        </div>
        <div id='field-position'>
          <FormField
            label='Job Position'
            name='position'
            required
            value={form.position}
            onChange={handleChange}
            onBlur={() => handleBlur('position')}
            placeholder='Enter your job position'
            error={touched?.position ? errors?.position : undefined}
          />
        </div>
      </div>
    </section>
  );
}