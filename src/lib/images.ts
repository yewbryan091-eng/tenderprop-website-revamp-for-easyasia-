/* Real asset pack (public/assets/**) — filenames and folder structure kept
   exactly as delivered so the EasyAsia backend can map against them. */
export const PROJECT_IMG = (file: string) => `/assets/project/${file}`;
export const SINARAN_PHOTOS = [1, 2, 3, 4, 5, 6, 7].map(
  (n) => `/assets/project/sinaran/photo-${n}.jpg`,
);
export const AGENT_PHOTO = "/assets/agent/stephen-yew.jpg";
export const LOGO = "/assets/layout/tenderprop-logo.png";
export const SLIDESHOW = "/assets/slideshow/TP_tenderprop.jpg";