export interface User {
  _id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  avatar?: string | null;
  token: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  avatar?: File | null;
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
