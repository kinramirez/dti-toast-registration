import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageModal from '@/components/ui/ImageModal';
import maps_placeholder from '@/assets/maps-placeholder.png';
import wtc_placeholder from '@/assets/wtc_placeholder.png';

const FALLBACK_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=World+Trade+Center+Metro+Manila+Gil+Puyat+Ave+Pasay+City';

const getGoogleMapsUrl = (event) => {
  const lat = event?.latitude;
  const lng = event?.longitude;
  // Guard against near-zero (Null Island) coordinates from fallback values
  if (
    lat != null &&
    lng != null &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    !(Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01)
  ) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  const query = event?.location || 'World Trade Center Metro Manila';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const VenueSection = ({ event }) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const venueName = event?.location;
  const venuePhotos = event?.venuePhoto || [];
  const venueThumbnail = venuePhotos[0] || event?.image || wtc_placeholder;
  const hasMultiplePhotos = venuePhotos.length > 1;
  const mapsUrl = getGoogleMapsUrl(event);

  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Map Image */}
        <a
          href={mapsUrl}
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
            {event?.venueAddress}
          </p>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#C55F61] text-[#C55F61] font-satoshi font-bold text-sm transition-all duration-200 hover:bg-[#C55F61] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] w-fit"
          >
            Get Direction
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Venue Photo */}
        <button
          onClick={() => setIsPhotoOpen(true)}
          aria-label="View venue photos"
          className="rounded-lg overflow-hidden cursor-pointer group relative w-full appearance-none border-none bg-none p-0 focus-visible:ring-2 focus-visible:ring-[#C55F61] focus-visible:ring-offset-2"
        >
          <img
            src={venueThumbnail}
            alt={`${venueName} venue`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = wtc_placeholder;
            }}
            className="w-full h-[250px] object-cover rounded-lg group-hover:scale-105 transition duration-500"
          />
          {/* Hover overlay — only when multiple photos exist */}
          {hasMultiplePhotos && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <span className="text-white font-satoshi font-bold text-sm">
                See more
              </span>
            </div>
          )}
        </button>
      </div>

      {isPhotoOpen && (
        <ImageModal
          src={venueThumbnail}
          images={venuePhotos.slice(0, 4)}
          alt={`${venueName} venue`}
          onClose={() => setIsPhotoOpen(false)}
        />
      )}
    </section>
  );
};

export default VenueSection;
