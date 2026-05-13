import productSofa from '@/assets/product-sofa.jpg';
import productChair from '@/assets/product-chair.jpg';
import productTable from '@/assets/product-table.jpg';
import productLamp from '@/assets/product-lamp.jpg';
import productVase from '@/assets/product-vase.jpg';
import productShelf from '@/assets/product-shelf.jpg';
import productDiningChair from '@/assets/product-diningchair.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  vendorId?: string;
  description: string;
  inStock: boolean;
  vendor?: string;
  discount?: number;
  vendorEmail?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Mond Sectional Sofa',
    price: 4299,
    originalPrice: 5199,
    image: productSofa,
    category: 'Seating',
    rating: 4.9,
    reviews: 124,
    badge: 'Best Seller',
    vendorId: 'Nordic Living',
    description: 'A masterpiece of Scandinavian craftsmanship. The Mond sectional features premium Italian leather and a solid walnut frame.',
    inStock: true,
  },
  {
    id: '2',
    name: 'Luna Lounge Chair',
    price: 1890,
    image: productChair,
    category: 'Seating',
    rating: 4.8,
    reviews: 89,
    badge: 'New',
    vendorId: 'Atelier Moderne',
    description: 'Designed for those who appreciate the art of sitting. Hand-finished with premium materials.',
    inStock: true,
  },
  {
    id: '3',
    name: 'Aria Coffee Table',
    price: 2150,
    originalPrice: 2600,
    image: productTable,
    category: 'Tables',
    rating: 4.7,
    reviews: 67,
    vendorId: 'Stone & Wood Co.',
    description: 'Sculptural marble top meets artisan-crafted base. A statement piece for any living space.',
    inStock: true,
  },
  {
    id: '4',
    name: 'Zenith Floor Lamp',
    price: 890,
    image: productLamp,
    category: 'Lighting',
    rating: 4.6,
    reviews: 45,
    badge: 'Trending',
    vendorId: 'Lumière Studio',
    description: 'Minimalist elegance meets warm ambient lighting. Adjustable height with a linen shade.',
    inStock: true,
  },
  {
    id: '5',
    name: 'Erosion Ceramic Vase',
    price: 340,
    image: productVase,
    category: 'Decor',
    rating: 4.9,
    reviews: 156,
    badge: 'Best Seller',
    vendorId: 'Artisan Collective',
    description: 'Each piece is unique, with natural mineral patterns that form during the firing process.',
    inStock: true,
  },
  {
    id: '6',
    name: 'Modular Display Shelf',
    price: 3200,
    originalPrice: 3800,
    image: productShelf,
    category: 'Storage',
    rating: 4.8,
    reviews: 78,
    vendorId: 'Nordic Living',
    description: 'Blackened steel frame with adjustable shelving. Industrial meets refined.',
    inStock: true,
  },
  {
    id: '7',
    name: 'Curve Dining Chair',
    price: 680,
    image: productDiningChair,
    category: 'Seating',
    rating: 4.7,
    reviews: 92,
    badge: 'New',
    vendorId: 'Atelier Moderne',
    description: 'Ergonomic comfort meets sculptural beauty. Stackable design for versatile living.',
    inStock: true,
  },
  {
    id: '8',
    name: 'Mond Sofa — Ivory',
    price: 4599,
    image: productSofa,
    category: 'Seating',
    rating: 4.9,
    reviews: 44,
    badge: 'Limited',
    vendorId: 'Nordic Living',
    description: 'The iconic Mond in a limited ivory colorway. Premium bouclé fabric with brass accents.',
    inStock: true,
  },
];

export const categories = [
  { name: 'Seating', slug: 'seating' },
  { name: 'Tables', slug: 'tables' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Storage', slug: 'storage' },
  { name: 'Decor', slug: 'decor' },
  { name: 'Bedroom', slug: 'bedroom' },
];

export const vendors = [
  'Nordic Living',
  'Atelier Moderne',
  'Stone & Wood Co.',
  'Lumière Studio',
  'Artisan Collective',
];
