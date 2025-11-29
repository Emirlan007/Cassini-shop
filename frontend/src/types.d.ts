export interface User {
  id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  avatar?: string;
}

export interface AdminUser {
  _id: string;
  displayName: string;
  phoneNumber: string;
  role: string;
  avatar?: string;
}

export interface RegisterMutation {
  displayName: string;
  phoneNumber: string;
}

export interface LoginMutation {
  displayName: string;
  phoneNumber: string;
}

export interface IGlobalError {
  error: string;
}

export interface IValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
    message: string;
    name: string;
    _message: string;
  };
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
}


interface UpdateCategoryPayload {
  _id: string;
  title: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  size: string[];
  colors: string[];
  category: ICategory;
  images?: string[];
  video?: string;
  price: number;
  imagesByColor?: Record<string, string[]>;
  discount?: number;
  discountUntil?: string;
  finalPrice?: number;
}

export interface ProductInput {
  name: string;
  description?: string;
  size: string[];
  colors: string[];
  category: string;
  images: File[] | null;
  video: File | null;
  price: number;
}

export interface ProductDiscountInput {
  discount: number;
  discountUntil?: string | null;
}

export interface Banner {
  _id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
}

export interface BannerInput {
    title: string;
    description: string;
    link: string;
    image: File | null;
}

export interface BannerFormData {
    title: string;
    description?: string;
    link?: string;
    image: File | null;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export interface OrderItem extends  CartItem{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
    image: string;
}

export interface Order {
    _id: string;
    user: AdminUser | null;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'processing' | 'completed';
    paymentMethod: 'cash' | 'qrCode';
}

export interface OrderItemDto {
    product: string;
    title: string;
    image: string;
    selectedColor: string;
    selectedSize: string;
    price: number;
    quantity: number;
}

export interface OrderMutation {
    items: OrderItemDto[];
    totalPrice: number;
    status?: 'pending' | 'processing' | 'completed';
    paymentMethod: 'cash' | 'qrCode';
    userComment?: string;
}

export interface OrderItemAdmin {
  _id: string;
  user: User;
  createdAt: string;
  items: CartItem[];
  totalPrice: number;
}
