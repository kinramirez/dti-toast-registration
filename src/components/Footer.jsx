import dtiLogo from '@/assets/dti_wedding_fair_logo_colored.svg';
import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#1877F2"/>
    <circle cx="12" cy="12" r="5.5" fill="none" stroke="#121212" strokeWidth="2.2"/>
    <circle cx="12" cy="12" r="3" fill="#1877F2"/>
    <circle cx="17" cy="7" r="1.2" fill="#121212"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer = ({ variant = 'full' }) => {
  const isCompact = variant === 'compact';

  return (
    <footer className="bg-brand-dark text-white" aria-label="Site footer">
      {!isCompact && (
        <div className="w-full max-w-container mx-auto px-12 py-12 flex items-start justify-between gap-12 max-md:flex-col max-md:gap-7 max-sm:px-6">
          <div className="flex items-start justify-start gap-16 max-md:flex-col max-md:gap-5">
            <div className="flex items-start">
              <img src={dtiLogo} alt="DTI Wedding Fair" className="w-60 h-auto block max-md:w-[200px]" />
            </div>

            <nav aria-label="Footer links">
              <h2 className="m-0 text-xs tracking-footer-title text-brand-blue mb-4">LINKS</h2>
              <div className="flex flex-col gap-4">
                <Link to="/" className="text-xs tracking-footer-link uppercase text-white/80 hover:text-white">HOME</Link>
                <Link to="/#about-section" className="text-xs tracking-footer-link uppercase text-white/80 hover:text-white">ABOUT US</Link>
                <Link to="/#what-we-offer" className="text-xs tracking-footer-link uppercase text-white/80 hover:text-white">EVENTS</Link>
                <Link to="/#faqs-section" className="text-xs tracking-footer-link uppercase text-white/80 hover:text-white">FAQs</Link>
                <Link to="/contact" className="text-xs tracking-footer-link uppercase text-white/80 hover:text-white">CONTACT US</Link>
              </div>
            </nav>
          </div>

          <div className="flex items-start justify-end gap-3.5 pt-1" aria-label="Social links">
            <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center"><InstagramIcon /></a>
            <a href="#" aria-label="Twitter" className="inline-flex items-center justify-center"><TwitterIcon /></a>
            <a href="#" aria-label="Youtube" className="inline-flex items-center justify-center"><YoutubeIcon /></a>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;