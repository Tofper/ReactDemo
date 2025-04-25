import React, { createContext, useContext } from 'react';
import { useMediaSize, MediaSize } from '../hooks/useMediaQuery';

const MediaContext = createContext<MediaSize>(MediaSize.Normal);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mediaSize = useMediaSize();

  const mediaClass =
    mediaSize === MediaSize.Mobile
      ? 'media-mobile'
      : mediaSize === MediaSize.Normal
      ? 'media-normal'
      : '';

  return (
    <MediaContext.Provider value={mediaSize}>
      <div className={mediaClass}>
        {children}
      </div>
    </MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);
export { MediaSize };