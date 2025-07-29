import {
  users,
  categories,
  products,
  customDesigns,
  orders,
  orderItems,
  reviews,
  chatConversations,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CustomDesign,
  type InsertCustomDesign,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
  type ChatConversation,
  type InsertChatConversation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Product operations
  getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Custom design operations
  getCustomDesigns(userId?: string): Promise<CustomDesign[]>;
  getCustomDesign(id: string): Promise<CustomDesign | undefined>;
  createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign>;
  updateCustomDesign(id: string, design: Partial<InsertCustomDesign>): Promise<CustomDesign>;
  deleteCustomDesign(id: string): Promise<void>;

  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Review operations
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Chat operations
  getChatConversation(sessionId: string, userId?: string): Promise<ChatConversation | undefined>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  updateChatConversation(id: string, conversation: Partial<InsertChatConversation>): Promise<ChatConversation>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string }): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));

    if (filters?.categoryId) {
      query = query.where(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.featured) {
      query = query.where(eq(products.isFeatured, true));
    }

    if (filters?.search) {
      query = query.where(
        sql`${products.name} ILIKE ${`%${filters.search}%`} OR ${products.description} ILIKE ${`%${filters.search}%`}`
      );
    }

    return query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Custom design operations
  async getCustomDesigns(userId?: string): Promise<CustomDesign[]> {
    let query = db.select().from(customDesigns);
    
    if (userId) {
      query = query.where(eq(customDesigns.userId, userId));
    } else {
      query = query.where(eq(customDesigns.isPublic, true));
    }

    return query.orderBy(desc(customDesigns.createdAt));
  }

  async getCustomDesign(id: string): Promise<CustomDesign | undefined> {
    const [design] = await db.select().from(customDesigns).where(eq(customDesigns.id, id));
    return design;
  }

  async createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign> {
    const [newDesign] = await db.insert(customDesigns).values(design).returning();
    return newDesign;
  }

  async updateCustomDesign(id: string, design: Partial<InsertCustomDesign>): Promise<CustomDesign> {
    const [updated] = await db
      .update(customDesigns)
      .set({ ...design, updatedAt: new Date() })
      .where(eq(customDesigns.id, id))
      .returning();
    return updated;
  }

  async deleteCustomDesign(id: string): Promise<void> {
    await db.delete(customDesigns).where(eq(customDesigns.id, id));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }

    return query.orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const [updated] = await db
      .update(orders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  // Review operations
  async getProductReviews(productId: string): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // Chat operations
  async getChatConversation(sessionId: string, userId?: string): Promise<ChatConversation | undefined> {
    let query = db.select().from(chatConversations).where(eq(chatConversations.sessionId, sessionId));
    
    if (userId) {
      query = query.where(eq(chatConversations.userId, userId));
    }

    const [conversation] = await query;
    return conversation;
  }

  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [newConversation] = await db.insert(chatConversations).values(conversation).returning();
    return newConversation;
  }

  async updateChatConversation(id: string, conversation: Partial<InsertChatConversation>): Promise<ChatConversation> {
    const [updated] = await db
      .update(chatConversations)
      .set({ ...conversation, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
