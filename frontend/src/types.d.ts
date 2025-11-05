export interface User {
  id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
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
  images?: string[];
  video?: string;
  price: number;
}

export interface ProductInput {
  name: string;
  description?: string;
  sizes?: string;
  images?: File[];
  video?: string;
  price: number;
}
