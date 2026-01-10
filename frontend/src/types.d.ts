export interface User {
  _id: string;
  email: string;
  name: string;
  token: string;
  role: string;
  avatar?: string;
  city?: string;
  address?: string;
  phoneNumber: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  phoneNumber: string;
  role: string;
  avatar?: string;
  city: string;
  address: string;
}

export interface RegisterMutation {
  name: string;
  phoneNumber: string;
  city?: string;
  address?: string;
}

export interface LoginMutation {
  name: string;
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
  title: TranslatedField;
  slug: string;
}

interface UpdateCategoryPayload {
  _id: string;
  title: string;
  slug: string;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  size: string[];
  colors: string[];
  category: ICategory;
  images?: string[];
  video?: string;
  price: number;
  imagesByColor?: Record<string, number[]>;
  discount?: number;
  discountUntil?: string;
  finalPrice?: number;
  isNew: boolean;
  isPopular: boolean;
  inStock?: boolean;
  material?: string;
}

export type TranslatedField = {
  ru: string;
  en: string;
  kg: string;
};

export interface ProductInput {
  name: TranslatedField;
  description: TranslatedField;
  size: string[];
  colors: string[];
  category: string;
  images: File[];
  video: File | null;
  price: number;
  inStock: boolean;
  material: TranslatedField;
  isPopular?: boolean;
  imagesByColor?: Record<string, number[]>;
}

export interface ProductDiscountInput {
  discount: number;
  discountUntil?: string | null;
}

export interface FilterParams {
  categoryId?: string;
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  inStock?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface FilteredProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  appliedFilters: FilterParams;
}

export interface FilterState {
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  material?: string;
  inStock?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface AvailableOptions {
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  materials: string[];
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
  _id?: string;
  product: string;
  title: string;
  price: number;
  finalPrice: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt: string;
}

export interface OrderItem extends CartItem {
  product: string;
  title: string;
  price: number;
  finalPrice: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export enum OrderStatus {
  AwaitingPayment = "awaiting_payment",
  Paid = "paid",
  Canceled = "canceled",
}

export enum DeliveryStatus {
  Warehouse = "warehouse",
  OnTheWay = "on_the_way",
  Delivered = "delivered",
}

export interface Order {
  _id: string;
  user: AdminUser | null;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  paymentMethod: "cash" | "qrCode";
  userComment: string;
  adminComments: string[];
  isArchived: boolean;
}

export interface OrderItemDto {
  _id?: string;
  product: string;
  title: string;
  image: string;
  selectedColor: string;
  selectedSize: string;
  price: number;
  finalPrice: number;
  quantity: number;
}

export interface OrderMutation {
  items: OrderItemDto[];
  totalPrice: number;
  paymentMethod: "cash" | "qrCode";
  userComment?: string;
  user?: {
    id: string;
    name: string | undefined;
    phoneNumber: string;
    city?: string | undefined;
    address?: string | undefined;
  };
}

export interface OrderItemAdmin {
  _id: string;
  user: User;
  createdAt: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  items: CartItem[];
  totalPrice: number;
  userComment: string;
  adminComments: string[];
  isArchived: boolean;
}

export interface PopularProducts {
  items: Product[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
}

export interface AddToWishlistPayload {
  productId: string;
}

export interface OrderAnalyticsItem {
  date: string;
  ordersCreated: number;
  ordersCanceled: number;
  ordersPaid: number;
  revenue: number;
}

export interface OrderAnalyticsResponse {
  items: OrderAnalyticsItem[];
  totals: {
    ordersCreated: number;
    ordersCanceled: number;
    ordersPaid: number;
    revenue: number;
  };
}

export interface SearchKeywordStat {
  keyword: string;
  count: number;
}

export interface PopularSearchKeywordsResponse {
  items: SearchKeywordStat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderHistoryItem {
  product: string;
  title: string;
  image: string;
  selectedColor: string;
  selectedSize: string;
  price: number;
  finalPrice: number;
  quantity: number;
}

export interface OrderHistory {
  _id: string;
  user: string;
  order: string;
  items: OrderHistoryItem[];
  totalPrice: number;
  paymentMethod: "cash" | "qrCode";
  completedAt: string;
}

export interface OrderHistoryStats {
  totalOrders: number;
  totalSpent: number;
  productsPurchased: number;
  averageOrderValue: number;
}
