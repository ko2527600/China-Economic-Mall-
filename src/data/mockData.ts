
import { Store, Category, Promotion, Event, Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Smart 4K LED TV - 55"',
    price: '₵4,500',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&fit=crop',
    storeId: '1',
    description: 'High definition smart TV with built-in streaming apps.',
    isNewArrival: true
  },
  {
    id: 'pr2',
    name: 'Stainless Steel Pot Set',
    price: '₵850',
    category: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1584990344667-51ce3c967523?w=400&fit=crop',
    storeId: '4',
    description: 'Durable 10-piece non-stick cooking set.'
  },
  {
    id: 'pr3',
    name: 'Premium Jasmine Rice (25kg)',
    price: '₵420',
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&fit=crop',
    storeId: '5',
    description: 'Long grain aromatic jasmine rice.'
  },
  {
    id: 'pr4',
    name: 'Leather Travel Bag',
    price: '₵320',
    category: 'Bags & Luggage',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&fit=crop',
    storeId: '2',
    description: 'Stylish and spacious travel bag for short trips.'
  },
  {
    id: 'pr5',
    name: 'Modern Upholstered Sofa',
    price: '₵7,800',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&fit=crop',
    storeId: '2',
    description: 'Comfortable 3-seater sofa for modern living rooms.'
  }
];

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Tech Haven Electronics',
    category: 'Electronics',
    description: 'Latest smartphones, laptops, and accessories at unbeatable prices. Official dealer for top brands.',
    logo: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=600&fit=crop',
    location: 'Ground Floor, Section A',
    hours: '8:00 AM - 9:00 PM',
    phone: '020 123 4567',
    rating: 4.5,
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'John Doe', rating: 5, comment: 'Great quality and genuine products!', date: '2026-04-15' },
      { id: 'r2', userId: 'u2', userName: 'Sarah Mensah', rating: 4, comment: 'Prices are good, but service could be slightly faster.', date: '2026-04-10' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&fit=crop',
      'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Home Comforts',
    category: 'Household',
    description: 'Your one-stop shop for everything your home needs. From cleaning supplies to decor.',
    logo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    location: 'First Floor, Shop 22',
    hours: '7:30 AM - 9:30 PM',
    phone: '020 987 6543',
    rating: 4.2,
    reviews: [],
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Accra Fashion Hub',
    category: 'Fashion',
    description: 'Trendy clothing for men, women, and children. Professional styles and casual wear.',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    location: 'Ground Floor, Shop 05',
    hours: '8:30 AM - 10:00 PM',
    phone: '055 555 1234',
    rating: 4.8,
    gallery: [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=800&fit=crop',
      'https://images.unsplash.com/photo-1470309638588-2992859aa713?w=800&fit=crop'
    ],
    reviews: []
  },
  {
    id: '4',
    name: 'Kitchen King',
    category: 'Kitchenware',
    description: 'Durable and affordable kitchen sets, pots, and pans. Everything for the modern chef.',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?w=800&h=600&fit=crop',
    location: 'Second Floor, Section C',
    hours: '7:30 AM - 9:30 PM',
    phone: '024 111 2222',
    rating: 4.0,
    reviews: []
  },
  {
    id: '5',
    name: 'Mega Groceries',
    category: 'Groceries',
    description: 'Fresh groceries, beverages, and bulk food items. Competitive prices for families and traders.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
    location: 'Basement Level',
    hours: '7:00 AM - 10:30 PM',
    phone: '020 000 9999',
    rating: 4.6,
    reviews: []
  }
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    title: 'Easter Mega Sale',
    description: 'Get up to 40% off on all electronics and household items. Limited time only!',
    expirationDate: '2026-05-30',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    storeId: '1'
  },
  {
    id: 'p2',
    title: 'Buy 1 Get 1 Free',
    description: 'Available on selected fashion brands at Accra Fashion Hub.',
    expirationDate: '2026-05-15',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
    storeId: '3'
  },
  {
    id: 'p3',
    title: 'Weekend Groceries Bash',
    description: 'Save 15% on bulk purchases of rice and oil every Saturday.',
    expirationDate: '2026-06-30',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    storeId: '5'
  }
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Mall Anniversary Celebration',
    description: 'Join us for music, prizes, and special guest appearances to celebrate 5 years of serving Darkuman.',
    date: '2026-06-12',
    location: 'Main Parking Lot',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop'
  }
];
