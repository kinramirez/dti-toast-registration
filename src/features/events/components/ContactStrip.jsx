import React from 'react';
import { Headset, Phone, Mail, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactStrip = ({ hideContactLink = false }) => {
  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left: Help */}
        <div className="flex items-start gap-3 shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(197, 95, 97, 0.1)',
              boxShadow: '0px 4px 9px rgba(197, 95, 97, 0.2)',
            }}
          >
            <Headset className="w-5 h-5 text-[#C55F61]" />
          </div>
          <div>
            <p className="font-satoshi font-bold text-[32px] leading-[43px] text-[#121212]">
              Need help?
            </p>
            <p className="font-satoshi font-medium text-xs leading-4 text-[#606060] mt-1">
              For inquiries, please contact
            </p>
          </div>
        </div>

        {/* Right: Phone, Email, Social grouped */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-10">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
            >
              <Phone className="w-5 h-5 text-[#C55F61]" />
            </div>
            <div>
              <p className="font-satoshi font-bold text-sm leading-[19px] text-[#121212]">
                277455415
              </p>
              <p className="font-satoshi font-medium text-xs leading-4 text-[#606060] mt-1">
                Mon - Fri | 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
            >
              <Mail className="w-5 h-5 text-[#C55F61]" />
            </div>
            <div>
              <p className="font-satoshi font-bold text-sm leading-[19px] text-[#121212]">
                toast@aftcorpph.com
              </p>
              <p className="font-satoshi font-medium text-xs leading-4 text-[#606060] mt-1">
                We will reply as soon as possible
              </p>
            </div>
          </div>

          {/* Social / Message */}
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
            >
              <Facebook className="w-5 h-5 text-[#C55F61]" />
            </div>
            <div>
              <p className="font-satoshi font-bold text-sm leading-[19px] text-[#121212]">
                toastweddingfair
              </p>
              {!hideContactLink && (
              <Link
                to="/contact"
                className="font-satoshi font-bold text-sm leading-[19px] text-[#808080] hover:text-[#C55F61] transition-colors mt-1 inline-block"
              >
                Send us a message
              </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactStrip;
