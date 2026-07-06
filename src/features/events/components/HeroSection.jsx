import React from 'react';
import { ArrowRight } from 'lucide-react';
import BenefitsCard from './BenefitsCard';
import hero_bg from '@/assets/hero_bg.png';

const HeroSection = () => {
  const scrollToUpcoming = () => {
    document.getElementById('upcoming-fairs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '631px', background: 'linear-gradient(180deg, #FFF6F3 0%, rgba(255,246,243,0.6) 100%)' }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero_bg})` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-container px-8 max-sm:px-6 h-full flex items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
          {/* Left: Text content */}
          <div className="flex flex-col items-start max-w-[635px]">
            <h1 className="text-[64px] leading-[1.1] font-bold text-[#121212] font-cormorant max-sm:text-[40px]">
              Welcome to Toast
            </h1>
            <span
              className="text-[96px] leading-[1] text-[#C55F61] font-corinthia -mt-2 max-sm:text-[56px]"
            >
              Join the Experience
            </span>
            <p className="text-base text-[#434343] font-satoshi mt-4 max-w-lg leading-relaxed">
              Register today to secure your spot and stay updated with everything you need for an exceptional event experience.
            </p>
            <button
              onClick={scrollToUpcoming}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
              style={{
                background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.boxShadow = '0px 4px 12px rgba(197, 95, 97, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              View Upcoming Fairs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Benefits Card */}
          <div className="shrink-0 max-sm:w-full">
            <BenefitsCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
