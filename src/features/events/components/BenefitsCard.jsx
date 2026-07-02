import React from 'react';
import { Ticket, Gift, Trophy, Lightbulb } from 'lucide-react';

const benefitItems = [
  {
    icon: Ticket,
    label: 'FREE ADMISSION',
    description: 'Open to all couples and their families',
  },
  {
    icon: Gift,
    label: 'EXCLUSIVE DEALS',
    description: 'Enjoy special promos only at the event',
  },
  {
    icon: Trophy,
    label: 'RAFFLE PRIZES',
    description: 'Amazing prizes await you',
  },
  {
    icon: Lightbulb,
    label: 'EXPERT ADVICE',
    description: 'Get tips from wedding experts',
  },
];

const BenefitsCard = () => {
  return (
    <div
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-8"
      style={{
        boxShadow: '0px 6px 4px rgba(18, 18, 18, 0.15)',
      }}
    >
      <div className="flex flex-col gap-6">
        {benefitItems.map((item) => (
          <div key={item.label} className="flex flex-row items-center gap-3">
            <item.icon
              className="w-14 h-14 text-[#AF5456] shrink-0 mt-0.5 border rounded-full p-2"
              aria-hidden="true"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF5456] font-satoshi">
                {item.label}
              </span>
              <p className="text-sm text-[#121212] font-satoshi leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsCard;
