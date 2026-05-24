export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  createdAt?: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  _id?: string; // MongoDB support
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  specs?: ProductSpec[];
}

export interface OrderItem {
  id: string; // Map to item id
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  _id?: string; // MongoDB support
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
