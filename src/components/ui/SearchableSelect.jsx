import { useRef, useState } from 'react';
import { RequiredMark } from './FormField';

/**
 * SearchableSelect — Extracted searchable select component.
 *
 * Functionally identical to the original implementation in EventFormPage.jsx.
 * Styling updated to match design spec tokens (bg-[#F1F1F1], rounded-lg, px-5 py-4).
 *
 * Used for cascading address dropdowns (Region → City → Barangay).
 * Not used by Step 1, but extracted for future steps.
 *
 * `onBlur` (optional) fires whenever the dropdown actually closes — either
 * because an option was selected, or because focus moved elsewhere without
 * a selection — so callers can mark the field touched for validation.
 *
 * `id` (optional) is applied to the outer wrapper div, used as a scroll
 * target when jumping to the first invalid field on submit.
 */
export default function SearchableSelect({
  id,
  label,
  required,
  options,
  placeholder,
  error,
  value,
  onChange,
  onBlur,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  function handleSelect(optValue) {
    onChange(optValue);
    setQuery('');
    setOpen(false);
    onBlur?.();
  }

  function handleBlur(e) {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setOpen(false);
      setQuery('');
      onBlur?.();
    }
  }

  return (
    <div
      id={id}
      className='flex flex-col gap-1 scroll-mt-24'
      ref={containerRef}
      onBlur={handleBlur}
    >
      <label className='text-[#121212] mb-2 block text-[14px] font-medium font-satoshi'>
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
          className={`w-full bg-white border border-[#ACACAC] rounded-[6px] pl-[17px] pr-10 h-[52px] text-sm outline-none transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus:ring-2 focus:ring-[#C55F61] focus:ring-offset-1 ${
            !selectedLabel && !open ? 'text-[#ACACAC]' : 'text-slate-800'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#606060] ${
            disabled ? 'opacity-60' : ''
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
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSelect(o.value)
                  }
                  className={`px-4 py-2 cursor-pointer hover:bg-rose-50 ${
                    o.value === value
                      ? 'bg-rose-100 text-[#C55F61] font-medium'
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
      {error ? (
        <p className='text-[11px] text-red-500 mt-0.5'>{error}</p>
      ) : null}
    </div>
  );
}