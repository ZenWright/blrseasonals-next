export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  inventory: number;
  images: string[];
  category: string;
  featured: boolean;
  seasonal_collections: string[];
};