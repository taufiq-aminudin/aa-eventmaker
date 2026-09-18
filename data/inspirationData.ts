// data/inspirationData.ts
export interface InspirationItem {
  id: string;
  title: string;
  category: 'Dresses' | 'Flowers' | 'Rings' | 'Invitations' | 'Cakes';
  description: string;
  imageUrl: string;
}

export const INSPIRATION_GALLERY: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Minimalist Outdoor Sunset",
    category: "Dresses",
    description: "Inspirasi gaun pengantin simpel dengan konsep alam terbuka",
    imageUrl: "/images/gallery/sunset-wedding.jpg",
  },
  {
    id: "insp-2",
    title: "Pernikahan Adat Sunda Modern",
    category: "Dresses",
    description: "Siger Sunda klasik berpadu dengan aksen busana modern",
    imageUrl: "/images/gallery/sunda-traditional.jpg",
  },
  {
    id: "insp-3",
    title: "Rustic Greenery Arch",
    category: "Flowers",
    description: "Dekorasi pelaminan dedaunan eucalyptus dan mawar putih",
    imageUrl: "/images/gallery/rustic-arch.jpg",
  },
  {
    id: "insp-4",
    title: "Gold & Diamond Solitaire",
    category: "Rings",
    description: "Pilihan cincin tunangan elegan dan minimalis",
    imageUrl: "/images/gallery/wedding-rings.jpg",
  },
];
