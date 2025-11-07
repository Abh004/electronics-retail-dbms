export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  designation: string;
  hireDate: string;
  avatarUrl: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Cancelled';
};
