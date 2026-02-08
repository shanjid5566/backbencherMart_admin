export interface FAQ {
  _id: string;
  productId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}
