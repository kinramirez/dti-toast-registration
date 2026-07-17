import React from 'react';
import {
  Handbag,
  ToolCase,
  Handshake,
  Soup,
  BanknoteArrowUp,
  Ellipsis,
} from 'lucide-react';

/**
 * Maps a title string to a Lucide icon based on keyword matching.
 * Case-insensitive substring match. Falls back to Ellipsis.
 */
const getIconForTitle = (title) => {
  if (!title) return Ellipsis;
  const t = title.toLowerCase();

  if (
    t.includes('fashion') ||
    t.includes('show') ||
    t.includes('collection') ||
    t.includes('bridal') ||
    t.includes('wedding') ||
    t.includes('gown') ||
    t.includes('dress') ||
    t.includes('style')
  )
    return Handbag;

  if (
    t.includes('deal') ||
    t.includes('discount') ||
    t.includes('promo') ||
    t.includes('offer') ||
    t.includes('package') ||
    t.includes('exclusive') ||
    t.includes('sale') ||
    t.includes('price')
  )
    return ToolCase;

  if (
    t.includes('expert') ||
    t.includes('meet') ||
    t.includes('connect') ||
    t.includes('network') ||
    t.includes('professional') ||
    t.includes('advice') ||
    t.includes('consult') ||
    t.includes('talk') ||
    t.includes('speaker') ||
    t.includes('mentor')
  )
    return Handshake;

  if (
    t.includes('food') ||
    t.includes('tasting') ||
    t.includes('cater') ||
    t.includes('menu') ||
    t.includes('cuisine') ||
    t.includes('sample') ||
    t.includes('dish') ||
    t.includes('chef') ||
    t.includes('bake') ||
    t.includes('cook')
  )
    return Soup;

  if (
    t.includes('raffle') ||
    t.includes('prize') ||
    t.includes('win') ||
    t.includes('giveaway') ||
    t.includes('contest') ||
    t.includes('draw') ||
    t.includes('lucky')
  )
    return BanknoteArrowUp;

  return Ellipsis;
};

const WhatToExpect = ({ event }) => {
  const items = event?.whatToExpect;

  // Hide the section entirely when there are no items
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <h2 className="font-satoshi font-bold text-2xl leading-8 text-[#121212] text-center mb-12">
        What to Expect
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {items.map((item, idx) => {
          const Icon = getIconForTitle(item.title);
          return (
            <div key={idx} className="flex flex-col items-center text-center w-[160px] max-sm:w-[140px]">
              {/* Icon circle */}
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
              >
                <Icon className="w-6 h-6 text-[#C55F61]" aria-hidden="true" />
              </div>

              <h3 className="font-cormorant font-bold text-xl leading-6 text-[#C55F61] mb-2">
                {item.title}
              </h3>
              <p className="font-satoshi font-medium text-sm leading-[19px] text-[#808080]">
                {item.description || ''}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatToExpect;
