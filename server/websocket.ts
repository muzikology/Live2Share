import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { messages } from "@shared/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface AuthenticatedSocket extends SocketIO.Socket {
  userId?: number;
  userType?: string;
}

export function setupWebSocket(server: HTTPServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: any, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; userType: string };
      socket.userId = decoded.userId;
      socket.userType = decoded.userType;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Track online users
  const onlineUsers = new Map<number, string>(); // userId -> socketId

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);
    
    // Register user as online
    if (socket.userId) {
      onlineUsers.set(socket.userId, socket.id);
      
      // Notify others that user is online
      socket.broadcast.emit("user_online", { userId: socket.userId });
    }

    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    // Handle sending messages
    socket.on("send_message", async (data: {
      receiverId: number;
      content: string;
      accommodationId?: number;
    }) => {
      try {
        // Save message to database
        const [newMessage] = await db.insert(messages).values({
          senderId: socket.userId!,
          receiverId: data.receiverId,
          content: data.content,
          accommodationId: data.accommodationId || null,
          isRead: false,
          createdAt: new Date(),
        }).returning();

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", newMessage);
        }

        // Confirm to sender
        socket.emit("message_sent", newMessage);
      } catch (error) {
        console.error("WebSocket send message error:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing_start", (data: { receiverId: number }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { 
          userId: socket.userId,
          isTyping: true 
        });
      }
    });

    socket.on("typing_stop", (data: { receiverId: number }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { 
          userId: socket.userId,
          isTyping: false 
        });
      }
    });

    // Handle message read receipt
    socket.on("mark_read", async (data: { messageId: number }) => {
      try {
        const [updatedMessage] = await db.update(messages)
          .set({ isRead: true })
          .where(eq(messages.id, data.messageId))
          .returning();

        if (updatedMessage) {
          // Notify sender
          const senderSocketId = onlineUsers.get(updatedMessage.senderId);
          if (senderSocketId) {
            io.to(senderSocketId).emit("message_read", {
              messageId: data.messageId,
              readBy: socket.userId,
            });
          }
        }
      } catch (error) {
        console.error("WebSocket mark read error:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        // Notify others that user is offline
        socket.broadcast.emit("user_offline", { userId: socket.userId });
      }
    });
  });

  return io;
}
