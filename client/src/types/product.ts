export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  stock: number;
  specs: ProductSpec[];
  createdAt?: string;
};