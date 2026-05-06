
export interface Product {
  id: string;
  name: string;
  price: string;
  category: Category;
  image: string;
  storeId: string;
  description: string;
  isNewArrival?: boolean;
}

export interface Store {
  id: string;
  name: string;
  category: Category;
  description: string;
  logo: string;
  location: string; // e.g., "Ground Floor, Shop 12"
  hours: string;
  phone: string;
  rating: number;
  reviews: Review[];
  image: string;
  gallery?: string[];
  isFeatured?: boolean;
}

export type Category = 
  | 'Electronics' 
  | 'Fashion' 
  | 'Household' 
  | 'Groceries' 
  | 'Furniture' 
  | 'Kitchenware' 
  | 'Bags & Luggage'
  | 'Appliances';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  expirationDate: string;
  image: string;
  storeId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  favorites: string[]; // Store IDs
  points: number;
  preferences: Category[];
}
