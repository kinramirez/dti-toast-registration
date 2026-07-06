import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageModal from '@/components/ui/ImageModal';
import maps_placeholder from '@/assets/maps-placeholder.png';
import wtc_placeholder from '@/assets/wtc_placeholder.png';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=World+Trade+Center+Metro+Manila+Gil+Puyat+Ave+Pasay+City';

const VenueSection = ({ event }) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const venueName = event?.location || 'World Trade Center Metro Manila';
  const venuePhoto = event?.image || wtc_placeholder;

  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Map Image */}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          aria-label={`Map showing ${venueName}`}
        >
          <div className="w-full h-[250px] bg-[#F1F1F1] rounded-lg flex items-center justify-center">
            <img
              src={maps_placeholder}
              alt={`Map showing ${venueName}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </a>

        {/* Text Block */}
        <div className="flex flex-col justify-center">
          <h2 className="font-satoshi font-bold text-2xl leading-8 text-[#121212] mb-3">
            The Venue
          </h2>
          <h3 className="font-cormorant font-bold text-[32px] leading-[39px] text-[#121212] mb-3">
            {venueName}
          </h3>
          <p className="font-satoshi font-medium text-sm leading-[19px] text-[#606060] mb-6">
            Gil Puyat Ave. cor. Diosdado Macapagal Blvd., Pasay City, Metro
            Manila
          </p>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#C55F61] text-[#C55F61] font-satoshi font-bold text-sm transition-all duration-200 hover:bg-[#C55F61] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] w-fit"
          >
            Get Direction
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Venue Photo */}
        <div
          onClick={() => setIsPhotoOpen(true)}
          className="rounded-lg overflow-hidden cursor-pointer group"
        >
          <img
            src={venuePhoto}
            alt={`${venueName} venue`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = wtc_placeholder;
            }}
            className="w-full h-[250px] object-cover rounded-lg group-hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {isPhotoOpen && (
        <ImageModal
          src={venuePhoto}
          alt={`${venueName} venue`}
          onClose={() => setIsPhotoOpen(false)}
        />
      )}
    </section>
  );
};

export default VenueSection;
