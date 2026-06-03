import { Link, NavLink } from 'react-router-dom';
import dtiLogo from '@/assets/dti_wedding_fair_logo_colored.svg';

function navItemClassName({ isActive }) {
  return [
    'text-sm transition-colors',
    isActive ? 'text-brand-blue' : 'text-white hover:text-brand-blue',
  ].join(' ');
}

export default function Header() {
  return (
    <header className='bg-[#212121] text-white w-full' aria-label='Site header'>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header Wrapper */}
        <div className='flex flex-col justify-between py-6 sm:py-8 lg:py-12 gap-8'>
          {/* Top Row */}
          <div className='flex flex-col md:flex-row items-center md:items-center justify-between gap-6'>
            {/* Logo */}
            <Link to='/' aria-label='DTI Wedding Fair' className='shrink-0'>
              <img
                src={dtiLogo}
                alt='DTI Wedding Fair'
                className='h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain'
              />
            </Link>

            {/* Navigation */}
            <nav
              aria-label='Primary'
              className='flex flex-wrap justify-center md:justify-center gap-x-6 gap-y-2 text-sm md:text-base'
            >
              <NavLink to='/' className={navItemClassName}>
                Events
              </NavLink>
            </nav>

            {/* Contact Button */}
            <div className='w-full md:w-auto flex justify-center md:justify-end'>
              <Link
                to='/contact'
                className='bg-brand-blue hover:bg-blue-600 transition-colors text-white 
                       px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-semibold
                       whitespace-nowrap shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue'
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Heading Section */}
          <div className='text-center md:text-left'>
            <h1
              className='font-bold uppercase tracking-tight leading-[1] 
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
            >
              DTI <br className='md:hidden' />
              EVENT HUB
            </h1>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30' />
    </header>
  );
}
