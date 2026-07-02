import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';
import Toast from '@/components/ui/Toast';

const emailSchema = z.string().email('Please enter a valid email address');

const NewsletterBand = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Placeholder: always show success toast (resolved item 23)
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setEmail('');
      setToastVisible(true);
    }, 800);
  };

  return (
    <>
      <section className="w-full py-16" style={{ backgroundColor: 'rgba(197, 95, 97, 0.2)' }}>
        <div className="max-w-container mx-auto px-8 max-sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Icon + heading + subtext */}
            <div className="flex items-start gap-4 max-sm:flex-col max-sm:items-center max-sm:text-center">
              <div className="w-12 h-12 rounded-full bg-[#C55F61] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-[32px] font-bold text-[#121212] font-cormorant leading-tight">
                  Be the first to know
                </h2>
                <p className="text-sm text-[#737373] font-satoshi mt-1">
                  Get updates on upcoming wedding fairs, exclusive deals, and weddings tips.
                </p>
              </div>
            </div>

            {/* Right: Email input + button */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:w-72">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address"
                  aria-label="Enter your email address"
                  className={`w-full px-4 py-3 rounded-lg bg-white text-sm text-[#121212] placeholder-[#ACACAC] font-satoshi outline-none border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] ${
                    error ? 'border-[#ED1C24]' : 'border-[#E8E8E8] focus:border-[#C55F61]'
                  }`}
                />
                {error && (
                  <p className="mt-1 text-xs text-[#ED1C24] font-satoshi">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0px 4px 12px rgba(197, 95, 97, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Toast
        message="Thanks for subscribing!"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
};

export default NewsletterBand;
