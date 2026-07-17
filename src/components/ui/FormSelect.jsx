import { cn } from '@/lib/utils/utils';
import { RequiredMark } from './FormField';

/**
 * FormSelect — Extracted and enhanced select dropdown component.
 *
 * Supports:
 * - `placeholder`, `options` (array of { value, label } or strings), `error`, `required`, `disabled`
 * - Custom SVG chevron positioned right-4
 *
 * Styling matches the Step 1 design spec:
 * - Select: bg-[#F1F1F1], border-none, rounded-lg, pl-5 pr-10 py-4
 * - Label: text-[#1877F2], mb-2 block, text-base font-medium
 * - Placeholder (no value): text-[#808080]
 * - Selected value: text-slate-800
 * - Focus: focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1
 * - Error: ring-2 ring-red-100 focus:ring-red-200 + red error text
 * - Disabled: disabled:cursor-not-allowed disabled:opacity-60
 */
export default function FormSelect({
  label,
  required,
  options,
  placeholder,
  error,
  className,
  ...props
}) {
  const isPlaceholderSelected = props.value === '' || props.value == null;
  const isDisabled = Boolean(props.disabled);

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
        {label}
        {required && <RequiredMark />}
      </label>
      <div className='relative'>
        <select
          className={cn(
            'w-full appearance-none bg-white border border-[#ACACAC] rounded-[6px] pl-[17px] pr-10 h-[52px] text-sm outline-none transition-all',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1',
            '[&_option]:text-[#121212]',
            error
              ? 'ring-2 ring-red-100 focus:ring-red-200'
              : '',
            isPlaceholderSelected ? 'text-[#ACACAC]' : 'text-slate-800',
            className,
          )}
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
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#606060] ${
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
      {error ? (
        <p className='text-[11px] text-red-500 mt-0.5'>{error}</p>
      ) : null}
    </div>
  );
}
