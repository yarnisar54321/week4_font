export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  description: string;
  summary?: string;
  genre?: Genre;
}

export interface Genre {
  id: number;
  title: string;
}

export interface Beverage {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Order {
  id: number;
  beverageId: number;
  quantity: number;
  orderDate: string;
  note?: string;
}
