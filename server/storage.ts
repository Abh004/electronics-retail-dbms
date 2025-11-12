import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import {
  brands,
  suppliers,
  products,
  customers,
  employees,
  orders,
  orderDetails,
  payments,
  type Brand,
  type InsertBrand,
  type Supplier,
  type InsertSupplier,
  type Product,
  type InsertProduct,
  type Customer,
  type InsertCustomer,
  type Employee,
  type InsertEmployee,
  type Order,
  type InsertOrder,
  type OrderDetail,
  type InsertOrderDetail,
  type Payment,
  type InsertPayment,
} from "@shared/schema";

export interface IStorage {
  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: InsertBrand): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<void>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: InsertSupplier): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<void>;

  // Products
  getProducts(): Promise<any[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: InsertCustomer): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<void>;

  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: InsertEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<void>;

  // Orders
  getOrders(): Promise<any[]>;
  getOrder(id: number): Promise<any>;
  createOrder(customerId: number, cartItems: { productId: number; quantity: number }[]): Promise<{ orderId: number }>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: string;
  }>;

  // Functions
  getCustomerTotalSpent(customerId: number): Promise<string>;
  getOrderBalance(orderId: number): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  // Brands
  async getBrands(): Promise<Brand[]> {
    return db.select().from(brands);
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.brandId, id));
    return brand || undefined;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  async updateBrand(id: number, brand: InsertBrand): Promise<Brand | undefined> {
    const [updated] = await db.update(brands).set(brand).where(eq(brands.brandId, id)).returning();
    return updated || undefined;
  }

  async deleteBrand(id: number): Promise<void> {
    await db.delete(brands).where(eq(brands.brandId, id));
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers);
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.supplierId, id));
    return supplier || undefined;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: InsertSupplier): Promise<Supplier | undefined> {
    const [updated] = await db.update(suppliers).set(supplier).where(eq(suppliers.supplierId, id)).returning();
    return updated || undefined;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.supplierId, id));
  }

  // Products
  async getProducts(): Promise<any[]> {
    const result = await db
      .select({
        productId: products.productId,
        name: products.name,
        price: products.price,
        stock: products.stock,
        brandId: products.brandId,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.brandId));
    return result;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.productId, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(product).where(eq(products.productId, id)).returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.productId, id));
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers);
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.customerId, id));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: InsertCustomer): Promise<Customer | undefined> {
    const [updated] = await db.update(customers).set(customer).where(eq(customers.customerId, id)).returning();
    return updated || undefined;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.customerId, id));
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employeeId, id));
    return employee || undefined;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, employee: InsertEmployee): Promise<Employee | undefined> {
    const [updated] = await db.update(employees).set(employee).where(eq(employees.employeeId, id)).returning();
    return updated || undefined;
  }

  async deleteEmployee(id: number): Promise<void> {
    await db.delete(employees).where(eq(employees.employeeId, id));
  }

  // Orders
  async getOrders(): Promise<any[]> {
    const result = await db
      .select({
        orderId: orders.orderId,
        orderDate: orders.orderDate,
        totalAmount: orders.totalAmount,
        customerId: orders.customerId,
        customerName: sql<string>`${customers.firstName} || ' ' || ${customers.lastName}`,
        customerEmail: customers.email,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.customerId));
    return result;
  }

  async getOrder(id: number): Promise<any> {
    const [order] = await db
      .select({
        orderId: orders.orderId,
        orderDate: orders.orderDate,
        totalAmount: orders.totalAmount,
        customerId: orders.customerId,
        customerName: sql<string>`${customers.firstName} || ' ' || ${customers.lastName}`,
        customerEmail: customers.email,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.customerId))
      .where(eq(orders.orderId, id));

    if (!order) return undefined;

    const details = await db
      .select({
        orderDetailId: orderDetails.orderDetailId,
        productId: orderDetails.productId,
        productName: products.name,
        quantity: orderDetails.quantity,
        pricePerUnit: orderDetails.pricePerUnit,
      })
      .from(orderDetails)
      .leftJoin(products, eq(orderDetails.productId, products.productId))
      .where(eq(orderDetails.orderId, id));

    const paymentRecords = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, id));

    return {
      ...order,
      orderDetails: details,
      payments: paymentRecords,
    };
  }

  async createOrder(customerId: number, cartItems: { productId: number; quantity: number }[]): Promise<{ orderId: number }> {
    return await db.transaction(async (tx) => {
      // Create order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId,
          totalAmount: "0.00",
        })
        .returning();

      let totalAmount = 0;

      // Process each cart item
      for (const item of cartItems) {
        // Get product with row lock
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.productId, item.productId))
          .for("update");

        if (!product) {
          throw new Error(`Product ${item.productId} does not exist`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Update stock
        await tx
          .update(products)
          .set({ stock: product.stock - item.quantity })
          .where(eq(products.productId, item.productId));

        // Insert order detail
        await tx.insert(orderDetails).values({
          orderId: order.orderId,
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: product.price,
        });

        totalAmount += Number(product.price) * item.quantity;
      }

      // Update order total
      await tx
        .update(orders)
        .set({ totalAmount: totalAmount.toFixed(2) })
        .where(eq(orders.orderId, order.orderId));

      return { orderId: order.orderId };
    });
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    return await db.transaction(async (tx) => {
      // Get order total
      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.orderId, payment.orderId!));

      if (!order) {
        throw new Error("Order not found");
      }

      // Get total payments
      const paymentsResult = await tx
        .select({ total: sql<string>`COALESCE(SUM(${payments.amount}), 0)` })
        .from(payments)
        .where(eq(payments.orderId, payment.orderId!));

      const totalPaid = Number(paymentsResult[0]?.total || 0);
      const balance = Number(order.totalAmount) - totalPaid;

      if (Number(payment.amount) > balance) {
        throw new Error("Payment exceeds remaining balance");
      }

      const [newPayment] = await tx.insert(payments).values(payment).returning();
      return newPayment;
    });
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: string;
  }> {
    const [productCount] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(products);

    const [customerCount] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(customers);

    const [orderCount] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders);

    const [revenue] = await db
      .select({ total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders);

    return {
      totalProducts: productCount.count,
      totalCustomers: customerCount.count,
      totalOrders: orderCount.count,
      totalRevenue: revenue.total,
    };
  }

  // Functions
  async getCustomerTotalSpent(customerId: number): Promise<string> {
    const [result] = await db
      .select({ total: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(eq(orders.customerId, customerId));

    return result.total;
  }

  async getOrderBalance(orderId: number): Promise<string> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, orderId));

    if (!order) {
      return "0.00";
    }

    const [paymentsResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(${payments.amount}), 0)` })
      .from(payments)
      .where(eq(payments.orderId, orderId));

    const totalPaid = Number(paymentsResult.total || 0);
    const balance = Number(order.totalAmount) - totalPaid;

    return balance.toFixed(2);
  }
}

export const storage = new DatabaseStorage();
