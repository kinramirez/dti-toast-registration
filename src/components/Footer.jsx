import dtiLogoWhite from '@/assets/toast_logo_white.png';
import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="white"/>
    <circle cx="12" cy="12" r="5.5" stroke="#C55F61" strokeWidth="2.2"/>
    <circle cx="12" cy="12" r="3" fill="white"/>
    <circle cx="17" cy="7" r="1.2" fill="#C55F61"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="text-white" style={{ backgroundColor: '#C55F61' }} aria-label="Site footer">
      <div className="w-full max-w-container mx-auto px-8 max-sm:px-6 py-12">
        {/* Top row: Logo left | FOLLOW US + social icons right */}
        <div className="flex items-start justify-between gap-8 max-md:flex-col max-md:items-center max-md:text-center">
          {/* Logo */}
          <div className="flex items-start shrink-0">
            <img
              src={dtiLogoWhite}
              alt="Toast Wedding Fair"
              className="w-48 h-auto block max-md:w-40"
            />
          </div>

          {/* FOLLOW US + social icons */}
          <div className="flex flex-col items-end gap-3 max-md:items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FEB5B6] font-satoshi">
              FOLLOW US
            </span>
            <div className="flex items-center gap-4" aria-label="Social links">
              <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row: copyright + legal links */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-white/20 max-md:flex-col max-md:text-center">
          <p className="text-xs text-[#F1F1F1] font-satoshi">
            &copy; 2026 Toast Wedding Fair. All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-[#FEB5B6] hover:text-white transition-colors font-satoshi">
              Privacy Policy
            </Link>
            <span className="text-[#FEB5B6] text-xs">&middot;</span>
            <Link to="/terms" className="text-xs text-[#FEB5B6] hover:text-white transition-colors font-satoshi">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
