import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  mobile: 900,
};

export enum MediaSize {
  Mobile = 'mobile',
  Normal = 'normal',
}

/**
 * useMediaSize
 * Returns MediaSize.Mobile if the screen is <= BREAKPOINTS.mobile, otherwise MediaSize.Normal.
 */
export function useMediaSize(): MediaSize {
  const getSize = () =>
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`).matches
      ? MediaSize.Mobile
      : MediaSize.Normal;

  const [size, setSize] = useState<MediaSize>(getSize);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`);
    const listener = () => setSize(media.matches ? MediaSize.Mobile : MediaSize.Normal);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  return size;
}