import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCustomDesignSchema, insertOrderSchema, insertReviewSchema } from "@shared/schema";
import { chatWithAI, generateProductRecommendations, analyzeDesignImage } from "./services/openai";
import { removeBackground, removeBackgroundFromUrl } from "./services/removebg";
import { sendWhatsAppMessage, sendOrderStatusUpdate, formatPhoneNumber } from "./services/whatsapp";
import multer from "multer";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  if (process.env.DISABLE_AUTH === 'true') {
  app.use((_req, _res, next) => next()); // bypass auth
} else {
  await setupAuth(app);
}

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      const products = await storage.getProducts({
        categoryId: category as string,
        featured: featured === 'true',
        search: search as string,
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Custom design routes
  app.get('/api/custom-designs', async (req, res) => {
    try {
      const { userId } = req.query;
      const designs = await storage.getCustomDesigns(userId as string);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching custom designs:", error);
      res.status(500).json({ message: "Failed to fetch custom designs" });
    }
  });

  app.get('/api/custom-designs/:id', async (req, res) => {
    try {
      const design = await storage.getCustomDesign(req.params.id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      console.error("Error fetching custom design:", error);
      res.status(500).json({ message: "Failed to fetch custom design" });
    }
  });

  app.post('/api/custom-designs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCustomDesignSchema.parse({
        ...req.body,
        userId,
      });
      const design = await storage.createCustomDesign(validatedData);
      res.json(design);
    } catch (error) {
      console.error("Error creating custom design:", error);
      res.status(500).json({ message: "Failed to create custom design" });
    }
  });

  app.put('/api/custom-designs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const design = await storage.updateCustomDesign(req.params.id, req.body);
      res.json(design);
    } catch (error) {
      console.error("Error updating custom design:", error);
      res.status(500).json({ message: "Failed to update custom design" });
    }
  });

  // Image processing routes
  app.post('/api/remove-background', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const result = await removeBackground(req.file.buffer);
      res.json(result);
    } catch (error) {
      console.error("Error removing background:", error);
      res.status(500).json({ message: "Failed to remove background" });
    }
  });

  app.post('/api/remove-background-url', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      const result = await removeBackgroundFromUrl(imageUrl);
      res.json(result);
    } catch (error) {
      console.error("Error removing background:", error);
      res.status(500).json({ message: "Failed to remove background" });
    }
  });

  app.post('/api/analyze-design', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeDesignImage(base64Image);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing design:", error);
      res.status(500).json({ message: "Failed to analyze design" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Admin can see all orders, users see only their own
      const orders = await storage.getOrders(user?.role === 'admin' ? undefined : userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if user owns the order or is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (order.userId !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderNumber = `EXP-${Date.now()}-${randomUUID().slice(0, 8)}`;
      
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId,
        orderNumber,
      });

      const order = await storage.createOrder(validatedData);
      
      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            ...item,
            orderId: order.id,
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { status, trackingNumber } = req.body;
      const order = await storage.updateOrder(req.params.id, { 
        status, 
        trackingNumber,
        updatedAt: new Date()
      });

      // Send WhatsApp notification if phone number is available
      if (order.shippingAddress && (order.shippingAddress as any).phone) {
        const phoneNumber = formatPhoneNumber((order.shippingAddress as any).phone);
        await sendOrderStatusUpdate(phoneNumber, order.orderNumber, status);
      }

      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Review routes
  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/products/:productId/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = req.params.productId;
      
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId,
        productId,
      });

      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // AI Chat routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, userId } = req.body;
      
      // Get or create conversation
      let conversation = await storage.getChatConversation(sessionId, userId);
      
      if (!conversation) {
        conversation = await storage.createChatConversation({
          sessionId,
          userId,
          messages: [],
          isActive: true,
        });
      }

      // Add user message
      const updatedMessages = [
        ...(conversation.messages || []),
        { role: 'user', content: message, timestamp: new Date().toISOString() }
      ];

      // Get AI response
      const systemMessage = {
        role: 'system' as const,
        content: `You are a helpful customer service assistant for EXPEROUTFIT, a custom streetwear brand. 
        Help customers with product questions, order tracking, design advice, and general support. 
        Be friendly, knowledgeable about streetwear fashion, and encourage custom design creation.
        Keep responses concise and helpful.`
      };

      const aiMessages = [
        systemMessage,
        ...updatedMessages.slice(-10).map(m => ({ role: m.role as any, content: m.content }))
      ];

      const aiResponse = await chatWithAI(aiMessages);

      // Add AI response
      const finalMessages = [
        ...updatedMessages,
        { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
      ];

      // Update conversation
      await storage.updateChatConversation(conversation.id, {
        messages: finalMessages,
        updatedAt: new Date(),
      });

      res.json({ 
        response: aiResponse,
        conversationId: conversation.id 
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.post('/api/product-recommendations', async (req, res) => {
    try {
      const { query } = req.body;
      const products = await storage.getProducts({ featured: true });
      const recommendations = await generateProductRecommendations(query, products);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // WhatsApp webhook routes
  app.get('/api/whatsapp/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
      const body = req.body;
      
      if (body.object === 'whatsapp_business_account') {
        // Process incoming WhatsApp messages
        body.entry?.forEach((entry: any) => {
          entry.changes?.forEach((change: any) => {
            if (change.field === 'messages') {
              const messages = change.value.messages;
              if (messages) {
                messages.forEach(async (message: any) => {
                  // Handle incoming message - could trigger AI response
                  console.log('Incoming WhatsApp message:', message);
                });
              }
            }
          });
        });
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      res.sendStatus(500);
    }
  });

  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const { to, message } = req.body;
      const result = await sendWhatsAppMessage({ to, message });
      res.json(result);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      res.status(500).json({ message: "Failed to send WhatsApp message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
