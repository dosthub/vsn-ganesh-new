import type { GalleryPhoto } from "@/types/community";
// Photo capture years are unconfirmed; do not infer them from WhatsApp filenames.
export const gallery: GalleryPhoto[] = [
  {
    id: "community-group",
    year: null,
    category: "Community Moments",
    image: "/images/ganesh/community-group.jpeg",
    caption: "Together for Bappa",
    alt: "Community members gathered in front of the Ganesh idol outdoors",
    width: 1200,
    height: 1600,
  },
  {
    id: "ganesh-celebration",
    year: null,
    category: "Ganesh Idol",
    image: "/images/ganesh/ganesh-celebration.jpeg",
    caption: "An evening of devotion",
    alt: "Community members beside a decorated Ganesh idol in the festival pandal",
    width: 1600,
    height: 900,
  },
  {
    id: "community-carrom",
    year: null,
    category: "Community Moments",
    image: "/images/ganesh/community-carrom.jpeg",
    caption: "A little friendly competition",
    alt: "Friends playing carrom together in the decorated celebration pandal",
    width: 720,
    height: 1280,
  },
];
