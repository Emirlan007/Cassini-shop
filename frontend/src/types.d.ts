export interface User {
  id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
  googleId?: string;
  avatar?: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}

export interface LoginMutation {
  email: string;
  password: string;
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

export interface Product {
  _id: string;
  name: string;
  description?: string;
  sizes?: string;
  category?: string[];
  images?: string[];
  video?: string;
  price: number;
}

export interface ProductInput {
  name: string;
  description?: string;
  sizes?: string;
  category?: string[];
  images?: File[];
  video?: string;
  price: number;
}

export interface Banner {
    _id: string;
    title: string;
    description?: string;
    image: string;
    link?: string;
    isActive: boolean;
}

export interface BannerFormData {
    title: string;
    description?: string;
    link?: string;
    isActive: boolean;
    image: File | null;
}