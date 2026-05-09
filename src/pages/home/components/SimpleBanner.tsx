import { useState, useEffect, useCallback } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function SimpleBanner() {
  const { config } = useSiteConfigContext();
  const { simpleBanner } = config;
  const images = simpleBanner?.images ?? [];
  const [current, setCurrent] = useState(0);

  // Hooks must be before any conditional return
  const autoPlay = simpleBanner?.autoPlay !== false;
  const interval = simpleBanner?.interval ?? 4000;

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, images.length, interval]);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  if (!images.length) return null;

  const wrapper = (
    <div className="relative w-full overflow-hidden bg-gray-100">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            <img
              src={img}
              alt={`${simpleBanner?.alt ?? ''} ${idx + 1}`}
              className="w-full h-auto object-cover object-top md:object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === current
                  ? 'bg-white scale-110 shadow'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (simpleBanner.link) {
    return (
      <a href={simpleBanner.link} className="block w-full">
        {wrapper}
      </a>
    );
  }

  return wrapper;
}