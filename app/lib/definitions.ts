export type User = {
  id: number; // SERIAL
  name: string;
  email: string;
  password: string; // This will be a hashed password.
  phone_number?: string | null;
  role: 'buyer' | 'seller';
};

export type Address = {
  id: number; // SERIAL
  user_id: number; // Foreign Key to users(id)
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export type Product = {
  id: number; // SERIAL
  seller_id: number; // Foreign Key to users(id)
  name: string;
  description?: string | null;
  price: number; // DECIMAL(10, 2)
  quantity: number; // INT
  isActive: boolean;
  category: string;
};

export type ProductImage = {
  id: number; // SERIAL
  product_id: number; // Foreign Key to products(id)
  image_url: string;
  alt_text?: string | null;
  is_primary?: boolean | null;
};

export type Order = {
  id: number; // SERIAL
  client_id: number; // Foreign Key to users(id)
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address_id?: number | null; // Foreign Key to addresses(id)
  total_amount?: number | null; // DECIMAL(10, 2)
};

export type OrderItem = {
  id: number; // SERIAL
  order_id: number; // Foreign Key to orders(id)
  product_id: number; // Foreign Key to products(id)
  quantity: number; // INT
  price_at_purchase: number; // DECIMAL(10, 2)
};

export type Revenue = {
  month: string;
  revenue: number;
};