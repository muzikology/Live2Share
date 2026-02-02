import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { users, roommateRequests, type User } from "@shared/schema";
import { eq, and, or, ne } from "drizzle-orm";
import { authenticateToken, requireTenant, type AuthRequest } from "./auth";
import { calculateCompatibility, getCompatibilityBreakdown } from "./compatibility";

const router = Router();

// GET /api/roommates/potential - Find potential roommates
router.get("/potential", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get filters from query
    const {
      university,
      studyField,
      gender,
      minCompatibility = 50,
    } = req.query;

    // Find other tenants
    let query = db.select().from(users)
      .where(
        and(
          eq(users.userType, "tenant"),
          ne(users.id, req.userId!)
        )
      );

    const potentialRoommates = await query;

    // Calculate compatibility for each potential roommate
    const matches = potentialRoommates.map(user => {
      const compatibility = calculateCompatibility(currentUser, user);
      
      // Remove sensitive data
      const { 
        password, 
        verificationDocuments,
        emergencyContactName,
        emergencyContactPhone,
        ...publicProfile 
      } = user;

      return {
        user: publicProfile,
        compatibilityScore: compatibility,
      };
    });

    // Filter by minimum compatibility and sort
    const filteredMatches = matches
      .filter(m => m.compatibilityScore >= parseInt(minCompatibility as string))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(filteredMatches);
  } catch (error) {
    console.error("Find potential roommates error:", error);
    res.status(500).json({ message: "Failed to find potential roommates" });
  }
});

// GET /api/roommates/compatibility/:userId - Get detailed compatibility with a specific user
router.get("/compatibility/:userId", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const targetUserId = parseInt(req.params.userId);
    
    const [currentUser, targetUser] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, req.userId!) }),
      db.query.users.findFirst({ where: eq(users.id, targetUserId) }),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const breakdown = getCompatibilityBreakdown(currentUser, targetUser);
    
    res.json({
      score: breakdown.score,
      factors: breakdown.factors,
      recommendations: generateRecommendations(breakdown.factors),
    });
  } catch (error) {
    console.error("Get compatibility error:", error);
    res.status(500).json({ message: "Failed to calculate compatibility" });
  }
});

// POST /api/roommates/request - Send a roommate request
router.post("/request", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const { targetUserId, message } = z.object({
      targetUserId: z.number(),
      message: z.string().optional(),
    }).parse(req.body);

    // Check if target user exists and is a tenant
    const targetUser = await db.query.users.findFirst({
      where: and(
        eq(users.id, targetUserId),
        eq(users.userType, "tenant")
      ),
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found or not a tenant" });
    }

    // Check if request already exists
    const existingRequest = await db.query.roommateRequests.findFirst({
      where: and(
        eq(roommateRequests.requesterId, req.userId!),
        eq(roommateRequests.targetUserId, targetUserId)
      ),
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Calculate compatibility
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });
    
    const compatibilityScore = calculateCompatibility(currentUser!, targetUser);

    // Create request
    const [request] = await db.insert(roommateRequests).values({
      requesterId: req.userId!,
      targetUserId,
      compatibilityScore,
      message: message || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Send roommate request error:", error);
    res.status(500).json({ message: "Failed to send request" });
  }
});

// GET /api/roommates/requests/sent - Get sent requests
router.get("/requests/sent", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const requests = await db.query.roommateRequests.findMany({
      where: eq(roommateRequests.requesterId, req.userId!),
      with: {
        targetUser: true,
      },
    });

    res.json(requests);
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({ message: "Failed to get requests" });
  }
});

// GET /api/roommates/requests/received - Get received requests
router.get("/requests/received", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const requests = await db.query.roommateRequests.findMany({
      where: eq(roommateRequests.targetUserId, req.userId!),
      with: {
        requester: true,
      },
    });

    res.json(requests);
  } catch (error) {
    console.error("Get received requests error:", error);
    res.status(500).json({ message: "Failed to get requests" });
  }
});

// PUT /api/roommates/requests/:id - Update request status (accept/reject)
router.put("/requests/:id", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { status } = z.object({
      status: z.enum(["accepted", "rejected"]),
    }).parse(req.body);

    // Verify this is the target user
    const request = await db.query.roommateRequests.findFirst({
      where: eq(roommateRequests.id, requestId),
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.targetUserId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    // Update request
    const [updatedRequest] = await db.update(roommateRequests)
      .set({ 
        status,
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(roommateRequests.id, requestId))
      .returning();

    res.json(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Update request error:", error);
    res.status(500).json({ message: "Failed to update request" });
  }
});

function generateRecommendations(factors: any): string[] {
  const recommendations: string[] = [];

  if (factors.lifestyle < 50) {
    recommendations.push("Consider discussing daily routines and lifestyle expectations");
  }
  if (factors.cleanliness < 50) {
    recommendations.push("Establish clear cleaning schedules and responsibilities");
  }
  if (factors.schedule < 50) {
    recommendations.push("Discuss sleep schedules and quiet hours");
  }
  if (factors.preferences < 50) {
    recommendations.push("Talk about important preferences like smoking, pets, and guests");
  }

  if (recommendations.length === 0) {
    recommendations.push("Great match! You seem very compatible");
  }

  return recommendations;
}

export default router;
