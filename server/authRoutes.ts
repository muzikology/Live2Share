import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "./db";
import { users, type InsertUser } from "@shared/schema";
import { eq, or } from "drizzle-orm";
import { generateToken, authenticateToken, type AuthRequest } from "./auth";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  userType: z.enum(["tenant", "landlord"]),
  university: z.string().optional(),
  studyField: z.string().optional(),
  yearOfStudy: z.number().optional(),
});

const loginSchema = z.object({
  identifier: z.string(), // username or email
  password: z.string(),
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.username, data.username),
        eq(users.email, data.email)
      ),
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === data.username 
          ? "Username already taken" 
          : "Email already registered" 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      ...data,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Generate token
    const token = generateToken(newUser.id, newUser.userType);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = loginSchema.parse(req.body);
    
    // Find user by username or email
    const user = await db.query.users.findFirst({
      where: or(
        eq(users.username, identifier),
        eq(users.email, identifier)
      ),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id, user.userType);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", authenticateToken, async (req: AuthRequest, res) => {
  try {
    // In production, you'd send an email with a verification code
    // For now, we'll just mark as verified
    await db.update(users)
      .set({ isEmailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, req.userId!));
    
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
