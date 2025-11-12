import { sql } from "drizzle-orm";
import { pgTable, serial, varchar, text, decimal, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Brand table
export const brands = pgTable("brands", {
  brandId: serial("brand_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  discounts: decimal("discounts", { precision: 5, scale: 2 }).default("0.00"),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// Supplier table
export const suppliers = pgTable("suppliers", {
  supplierId: serial("supplier_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 100 }).unique(),
  contactPhone: varchar("contact_phone", { length: 20 }),
});

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  productSuppliers: many(productSuppliers),
}));

// Product table
export const products = pgTable("products", {
  productId: serial("product_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  brandId: integer("brand_id").references(() => brands.brandId),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.brandId],
  }),
  productSuppliers: many(productSuppliers),
  orderDetails: many(orderDetails),
}));

// Product_Supplier junction table
export const productSuppliers = pgTable("product_suppliers", {
  productId: integer("product_id").notNull().references(() => products.productId),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.supplierId),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.supplierId] }),
}));

export const productSuppliersRelations = relations(productSuppliers, ({ one }) => ({
  product: one(products, {
    fields: [productSuppliers.productId],
    references: [products.productId],
  }),
  supplier: one(suppliers, {
    fields: [productSuppliers.supplierId],
    references: [suppliers.supplierId],
  }),
}));

// Customer table
export const customers = pgTable("customers", {
  customerId: serial("customer_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  middleName: varchar("middle_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

// Employee table
export const employees = pgTable("employees", {
  employeeId: serial("employee_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  designation: varchar("designation", { length: 100 }),
  hireDate: timestamp("hire_date", { mode: "date" }),
});

// Orders table
export const orders = pgTable("orders", {
  orderId: serial("order_id").primaryKey(),
  orderDate: timestamp("order_date", { mode: "string" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  customerId: integer("customer_id").references(() => customers.customerId),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.customerId],
  }),
  orderDetails: many(orderDetails),
  payments: many(payments),
}));

// Order_Details table
export const orderDetails = pgTable("order_details", {
  orderDetailId: serial("order_detail_id").primaryKey(),
  orderId: integer("order_id").references(() => orders.orderId),
  productId: integer("product_id").references(() => products.productId),
  quantity: integer("quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
});

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, {
    fields: [orderDetails.orderId],
    references: [orders.orderId],
  }),
  product: one(products, {
    fields: [orderDetails.productId],
    references: [products.productId],
  }),
}));

// Payment table
export const payments = pgTable("payments", {
  transactionId: serial("transaction_id").primaryKey(),
  orderId: integer("order_id").references(() => orders.orderId),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMode: varchar("payment_mode", { length: 50 }),
  status: varchar("status", { length: 50 }),
  paymentTimestamp: timestamp("payment_timestamp", { mode: "string" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.orderId],
  }),
}));

// Insert schemas
export const insertBrandSchema = createInsertSchema(brands).omit({
  brandId: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  supplierId: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  productId: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  customerId: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  employeeId: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  orderId: true,
  orderDate: true,
  totalAmount: true,
});

export const insertOrderDetailSchema = createInsertSchema(orderDetails).omit({
  orderDetailId: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  transactionId: true,
  paymentTimestamp: true,
});

// Types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderDetail = typeof orderDetails.$inferSelect;
export type InsertOrderDetail = z.infer<typeof insertOrderDetailSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
