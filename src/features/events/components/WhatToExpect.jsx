import React from 'react';
import {
  Handbag,
  ToolCase,
  Handshake,
  Soup,
  BanknoteArrowUp,
  Ellipsis,
} from 'lucide-react';

const EXPECT_ITEMS = [
  {
    icon: Handbag,
    title: 'Fashion Shows',
    description:
      'Be inspired by the latest bridal collections from top designers.',
  },
  {
    icon: ToolCase,
    title: 'Exclusive Deals',
    description:
      'Access special promos and discounts only available at the event.',
  },
  {
    icon: Handshake,
    title: 'Meet the Experts',
    description:
      'Connect with industry professionals and get personalized advice.',
  },
  {
    icon: Soup,
    title: 'Food Tastings',
    description: 'Sample delicious menus from the best caterers.',
  },
  {
    icon: BanknoteArrowUp,
    title: 'Raffle Prizes',
    description:
      'Join for free and get a chance to win amazing prizes.',
  },
  {
    icon: Ellipsis,
    title: 'Many More',
    description:
      'Additional expectations or outcomes you hope to gain.',
  },
];

const WhatToExpect = () => {
  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <h2 className="font-satoshi font-bold text-2xl leading-8 text-[#121212] text-left mb-12">
        What to Expect
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-center">
        {EXPECT_ITEMS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            {/* Icon circle */}
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(197, 95, 97, 0.1)' }}
            >
              <item.icon className="w-6 h-6 text-[#C55F61]" aria-hidden="true" />
            </div>

            <h3 className="font-cormorant font-bold text-xl leading-6 text-[#C55F61] mb-2">
              {item.title}
            </h3>
            <p className="font-satoshi font-medium text-sm leading-[19px] text-[#808080]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatToExpect;
