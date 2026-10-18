// Archivo Variable (weight + width axes), the site's typeface. Rendering waits until it has loaded.
import { cancelRender, continueRender, delayRender } from 'remotion';
import archivo from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2';

export const FONT = 'Archivo';

const handle = delayRender('Loading Archivo');
new FontFace(FONT, `url(${archivo}) format('woff2')`, { weight: '100 900', stretch: '62% 125%' })
  .load()
  .then((face) => {
    document.fonts.add(face);
    continueRender(handle);
  })
  .catch((err) => cancelRender(err));
