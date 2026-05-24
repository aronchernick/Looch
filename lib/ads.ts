export interface AdImage {
  src: string;
  alt: string;
}

export interface AdConfig {
  id: string;
  advertiserName: string;
  tagline: string;
  ctaLabel: string;
  url: string;
  images: AdImage[];
  /** 'light' = white text on dark overlay; 'dark' = dark text on light overlay */
  theme: "light" | "dark";
}

export const ADS: AdConfig[] = [
  {
    id: "hakhel-lodge-v1",
    advertiserName: "Hakhel Lodge",
    tagline: "Kosher family retreat · Vermont mountains",
    ctaLabel: "Book Now",
    url: "https://hakhellodge.com",
    theme: "light",
    images: [
      { src: "https://hakhellodge.com/wp-content/uploads/2023/02/Two-Beds.jpg", alt: "Hakhel Lodge rooms" },
      { src: "https://hakhellodge.com/wp-content/uploads/2023/02/Kitchen-Counters.jpg", alt: "Kosher kitchen" },
      { src: "https://hakhellodge.com/wp-content/uploads/2023/02/Shabbos.jpg", alt: "Shabbos at Hakhel" },
      { src: "https://hakhellodge.com/wp-content/uploads/2023/02/the-shul.jpg", alt: "The Shul at Hakhel" },
    ],
  },
  {
    id: "mushkreations-v1",
    advertiserName: "Mushkreations",
    tagline: "Custom handwritten signs & gifts",
    ctaLabel: "Shop Now",
    url: "https://www.mushkreations.com",
    theme: "light",
    images: [
      {
        src: "https://static.wixstatic.com/media/3ef431_9435fc74d9d54eb3b07c065eb547c6cb~mv2.jpg/v1/fill/w_828,h_1090,al_c,q_85,enc_avif,quality_auto/3ef431_9435fc74d9d54eb3b07c065eb547c6cb~mv2.jpg",
        alt: "Mushkreations custom signs",
      },
    ],
  },
];
