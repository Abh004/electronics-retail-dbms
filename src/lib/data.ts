import type { Product, Customer, Employee, Order } from './types';

export const products: Product[] = [
  { id: 'PROD001', name: 'QuantumCore Laptop', price: 1299.99, stock: 50, brand: 'Innovatech' },
  { id: 'PROD002', name: 'CyberSync Smartphone', price: 899.99, stock: 150, brand: 'Connecta' },
  { id: 'PROD003', name: 'AeroGlide Drone', price: 499.50, stock: 30, brand: 'SkyHigh' },
  { id: 'PROD004', name: 'EchoBeats Headphones', price: 199.00, stock: 200, brand: 'AudioPhonic' },
  { id: 'PROD005', name: 'NovaGlow Smart Lamp', price: 79.99, stock: 300, brand: 'Lumina' },
  { id: 'PROD006', name: 'FlexiFit Smartwatch', price: 249.99, stock: 120, brand: 'Innovatech' },
];

export const customers: Customer[] = [
  { id: 'CUST001', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '555-0101', avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'CUST002', name: 'Bob Williams', email: 'bob.w@example.com', phone: '555-0102', avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'CUST003', name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '5_55-0103', avatarUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: 'CUST004', name: 'Diana Miller', email: 'diana.m@example.com', phone: '555-0104', avatarUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: 'CUST005', name: 'Ethan Davis', email: 'ethan.d@example.com', phone: '555-0105', avatarUrl: 'https://picsum.photos/seed/5/40/40' },
];

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Michael Scott', email: 'm.scott@electropo.s', designation: 'Manager', hireDate: '2020-01-15', avatarUrl: 'https://picsum.photos/seed/6/40/40' },
  { id: 'EMP002', name: 'Jessica Pearson', email: 'j.pearson@electropo.s', designation: 'Sales Director', hireDate: '2019-03-20', avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'EMP003', name: 'David Lee', email: 'd.lee@electropo.s', designation: 'Technician', hireDate: '2021-07-01', avatarUrl: 'https://picsum_photos/seed/2/40/40' },
  { id: 'EMP004', name: 'Sarah Chen', email: 's.chen@electropo.s', designation: 'Sales Associate', hireDate: '2022-11-10', avatarUrl: 'https://picsum.photos/seed/4/40/40' },
];

export const orders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Johnson', customerEmail: 'alice.j@example.com', date: '2023-10-01', total: 1299.99, status: 'Paid' },
  { id: 'ORD002', customerName: 'Bob Williams', customerEmail: 'bob.w@example.com', date: '2023-10-02', total: 899.99, status: 'Pending' },
  { id: 'ORD003', customerName: 'Charlie Brown', customerEmail: 'charlie.b@example.com', date: '2023-10-02', total: 199.00, status: 'Paid' },
  { id: 'ORD004', customerName: 'Alice Johnson', customerEmail: 'alice.j@example.com', date: '2023-10-03', total: 249.99, status: 'Paid' },
  { id: 'ORD005', customerName: 'Diana Miller', customerEmail: 'diana.m@example.com', date: '2023-10-04', total: 79.99, status: 'Cancelled' },
];
