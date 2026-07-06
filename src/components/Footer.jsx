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

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
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
              <a href="https://www.facebook.com/toastweddingfair" aria-label="Facebook" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/toastweddingfair?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@toastweddingfair" aria-label="TikTok" className="inline-flex items-center justify-center transition-opacity hover:opacity-80">
                <TikTokIcon />
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
