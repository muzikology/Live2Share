import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { messages, users } from "@shared/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { authenticateToken, type AuthRequest } from "./auth";

const router = Router();

// GET /api/messages/conversations - Get all conversations for current user
router.get("/conversations", authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get all messages where user is sender or receiver
    const userMessages = await db.query.messages.findMany({
      where: or(
        eq(messages.senderId, req.userId!),
        eq(messages.receiverId, req.userId!)
      ),
      orderBy: [desc(messages.createdAt)],
    });

    // Group by conversation partner
    const conversationsMap = new Map<number, any>();
    
    for (const message of userMessages) {
      const partnerId = message.senderId === req.userId ? message.receiverId : message.senderId;
      
      if (!conversationsMap.has(partnerId)) {
        const partner = await db.query.users.findFirst({
          where: eq(users.id, partnerId),
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          }
        });

        conversationsMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Count unread messages from this partner
      if (message.receiverId === req.userId && !message.isRead) {
        conversationsMap.get(partnerId)!.unreadCount++;
      }
    }

    const conversations = Array.from(conversationsMap.values());
    
    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to get conversations" });
  }
});

// GET /api/messages/conversation/:userId - Get messages with specific user
router.get("/conversation/:userId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    
    const conversationMessages = await db.query.messages.findMany({
      where: or(
        and(
          eq(messages.senderId, req.userId!),
          eq(messages.receiverId, otherUserId)
        ),
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, req.userId!)
        )
      ),
      orderBy: [messages.createdAt],
    });

    // Mark messages as read
    await db.update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.receiverId, req.userId!),
          eq(messages.senderId, otherUserId),
          eq(messages.isRead, false)
        )
      );

    res.json(conversationMessages);
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to get conversation" });
  }
});

// POST /api/messages - Send a message
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const messageData = z.object({
      receiverId: z.number(),
      content: z.string().min(1).max(5000),
      accommodationId: z.number().optional(),
    }).parse(req.body);

    // Verify receiver exists
    const receiver = await db.query.users.findFirst({
      where: eq(users.id, messageData.receiverId),
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const [newMessage] = await db.insert(messages).values({
      senderId: req.userId!,
      receiverId: messageData.receiverId,
      content: messageData.content,
      accommodationId: messageData.accommodationId || null,
      isRead: false,
      createdAt: new Date(),
    }).returning();

    res.status(201).json(newMessage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// PUT /api/messages/:id/read - Mark message as read
router.put("/:id/read", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const messageId = parseInt(req.params.id);
    
    // Verify this is the receiver
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiverId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to mark this message as read" });
    }

    const [updated] = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Mark message read error:", error);
    res.status(500).json({ message: "Failed to mark message as read" });
  }
});

// DELETE /api/messages/:id - Delete a message
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const messageId = parseInt(req.params.id);
    
    // Verify this is the sender
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await db.delete(messages).where(eq(messages.id, messageId));

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

export default router;
