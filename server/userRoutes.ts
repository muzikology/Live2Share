import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, type AuthRequest } from "./auth";

const router = Router();

// Validation schema for profile update
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  university: z.string().optional(),
  studyField: z.string().optional(),
  yearOfStudy: z.number().optional(),
  lifestyle: z.array(z.string()).optional(),
  preferences: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  sleepSchedule: z.string().optional(),
  cleanlinessLevel: z.number().min(1).max(10).optional(),
  noiseLevel: z.number().min(1).max(10).optional(),
  guestPolicy: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// GET /api/users/:id - Get public user profile
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return public profile (without sensitive data)
    const { 
      password, 
      verificationDocuments,
      emergencyContactName,
      emergencyContactPhone,
      ...publicProfile 
    } = user;
    
    res.json(publicProfile);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

// PUT /api/users/me - Update current user profile
router.put("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const updates = updateProfileSchema.parse(req.body);
    
    const [updatedUser] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, req.userId!))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// POST /api/users/me/verification-documents
router.post("/me/verification-documents", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { documents } = z.object({
      documents: z.array(z.string().url())
    }).parse(req.body);

    // In production, you'd upload these to S3/Cloudinary
    // For now, we'll just store the URLs
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingDocs = user.verificationDocuments || [];
    const updatedDocs = [...existingDocs, ...documents];

    await db.update(users)
      .set({ 
        verificationDocuments: updatedDocs,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.userId!));

    res.json({ 
      message: "Documents uploaded successfully",
      documents: updatedDocs
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Upload documents error:", error);
    res.status(500).json({ message: "Failed to upload documents" });
  }
});

// GET /api/users/search - Search for users (roommates)
router.get("/search", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { 
      university,
      studyField,
      gender,
      lifestyle,
      minCleanliness,
      maxNoise
    } = req.query;

    // Build query - this is simplified; in production you'd use proper filtering
    let query = db.select().from(users).where(eq(users.userType, "tenant"));
    
    // Note: For complex filtering, you'd need to use Drizzle's filtering capabilities
    // This is a placeholder showing the concept
    
    const results = await query;
    
    // Filter out password and sensitive data
    const publicResults = results.map(user => {
      const { 
        password, 
        verificationDocuments,
        emergencyContactName,
        emergencyContactPhone,
        ...publicProfile 
      } = user;
      return publicProfile;
    });

    res.json(publicResults);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

export default router;
