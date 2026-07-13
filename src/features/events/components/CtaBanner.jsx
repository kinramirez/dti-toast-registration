import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaBanner = ({ event }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (event) {
      navigate(`/event/register/${event.guid || event.id}`, { state: { event } });
    }
  };

  return (
    <section
      className="w-full py-6"
      style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}
    >
      <div className="max-w-container mx-auto px-8 max-sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-4">
          <Heart
            className="w-8 h-8 text-[#C55F61] shrink-0"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-cormorant font-bold text-[32px] leading-[39px] text-[#121212]">
              Join thousands of couples on their journey to forever.
            </h2>
            <p className="font-satoshi font-medium text-xs leading-4 text-[#606060] mt-1">
              Register now and make the most of your Toast experience!
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <button
          onClick={handleRegister}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-bold text-base leading-[22px] transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
          style={{
            background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.boxShadow =
              '0px 4px 12px rgba(197, 95, 97, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Register Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default CtaBanner;
