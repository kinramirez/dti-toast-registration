import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageModal from '@/components/ui/ImageModal';
import wtc_placeholder from '@/assets/wtc_placeholder.png';

const FALLBACK_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=World+Trade+Center+Metro+Manila+Gil+Puyat+Ave+Pasay+City';

// Filenames stored in venuePhoto are relative — prepend the uploads base path.
// Skip prepending if the value is already a full URL.
const PHOTO_BASE_URL = 'https://api.toastweddingfair.ph/uploads/events/';

const resolvePhotoUrl = (filename) => {
  if (!filename) return null;
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${PHOTO_BASE_URL}${filename}`;
};

// venuePhoto sometimes comes back as an actual array, and sometimes as a
// JSON-stringified array (e.g. "[\"a.jpg\",\"b.jpg\"]") — normalize both.
const parseVenuePhotos = (venuePhoto) => {
  if (Array.isArray(venuePhoto)) return venuePhoto;
  if (typeof venuePhoto === 'string') {
    try {
      const parsed = JSON.parse(venuePhoto);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getCoords = (event) => {
  const lat = event?.latitude != null ? parseFloat(event.latitude) : null;
  const lng = event?.longitude != null ? parseFloat(event.longitude) : null;
  // Guard against near-zero (Null Island) coordinates from fallback values
  if (
    lat != null &&
    lng != null &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    !(Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01)
  ) {
    return { lat, lng };
  }
  return null;
};

const getGoogleMapsUrl = (event, coords) => {
  if (coords) {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  }
  const query = event?.location || 'World Trade Center Metro Manila';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const VenueSection = ({ event }) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const venueName = event?.location;

  const venuePhotos = useMemo(() => {
    return parseVenuePhotos(event?.venuePhoto)
      .map(resolvePhotoUrl)
      .filter(Boolean);
  }, [event]);

  const venueThumbnail = venuePhotos[0] || event?.image || wtc_placeholder;
  const hasMultiplePhotos = venuePhotos.length > 1;

  const coords = useMemo(() => getCoords(event), [event]);
  const mapsUrl = useMemo(() => getGoogleMapsUrl(event, coords), [event, coords]);

  return (
    <section className="max-w-container mx-auto px-8 max-sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Map */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block rounded-lg overflow-hidden cursor-pointer group w-full h-[250px]"
          aria-label={`Map showing ${venueName}`}
        >
          {coords ? (
            <>
              <iframe
                title={`Map showing ${venueName}`}
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`}
                className="w-full h-full border-0 pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-3">
                <span className="bg-white text-[#C55F61] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Open in Google Maps
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-[#F1F1F1] rounded-lg flex items-center justify-center">
              <span className="text-sm text-[#606060] px-4 text-center">
                Map location not available
              </span>
            </div>
          )}
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