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
  role: "admin" | "staff" | "customer" | "user";
  isVerified: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  user: string | { email: string };
  createdAt: string;
  total: number;
  status: string;
}
