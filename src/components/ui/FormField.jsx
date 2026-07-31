import { cn } from '@/lib/utils/utils';

/**
 * Renders a red asterisk only when required={true}.
 */
export function RequiredMark() {
  return <span className='text-red-500 ml-0.5'>*</span>;
}

/**
 * FormField — Extracted and enhanced text input component.
 *
 * Supports:
 * - `icon` prop (ReactNode) rendered inside the input on the right side
 * - `labelIcon` prop (ReactNode) rendered next to the label text
 * - `error`, `hint`, `required`, `disabled`, and all standard input props
 * - `id` (optional) applied to the outer wrapper div, used as a scroll
 *   target when jumping to the first invalid field on submit
 *
 * Styling matches the Step 1 design spec:
 * - Input: bg-[#F1F1F1], border-none, rounded-lg, px-5 py-4
 * - Label: text-[#1877F2], mb-2 block, text-base font-medium
 * - Placeholder: text-[#808080]
 * - Focus: focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1
 * - Error: ring-2 ring-red-100 focus:ring-red-200 + red error text
 * - Disabled: disabled:cursor-not-allowed disabled:opacity-60
 */
export default function FormField({
  id,
  label,
  required,
  hint,
  icon,
  labelIcon,
  error,
  className,
  ...props
}) {
  return (
    <div id={id} className='flex flex-col gap-1 scroll-mt-24'>
      <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
        {label}
        {labelIcon && (
          <span className='inline-flex items-center ml-1.5'>{labelIcon}</span>
        )}
        {required && <RequiredMark />}
      </label>
      <div className='relative'>
        <input
          className={cn(
            'w-full bg-white border border-[#ACACAC] rounded-[6px] px-[17px] h-[52px] text-sm text-slate-800 outline-none transition-all',
            'placeholder:text-[#ACACAC]',
            'focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[#F1F1F1]',
            error
              ? 'ring-2 ring-red-100 focus:ring-red-200'
              : '',
            icon ? 'pr-12' : '',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-required={required}
          {...props}
        />
        {icon && (
          <div className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#606060]'>
            {icon}
          </div>
        )}
      </div>
      {hint && !error ? (
        <p className='text-[11px] text-slate-400 mt-0.5'>{hint}</p>
      ) : null}
      {error ? (
        <p className='text-[11px] text-red-500 mt-0.5'>{error}</p>
      ) : null}
    </div>
  );
}