import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { reviews, userReviews } from "@shared/schema";
import { eq, and, desc, avg, count, sql } from "drizzle-orm";
import { authenticateToken, requireTenant, type AuthRequest } from "./auth";

const router = Router();

// POST /api/reviews/accommodations/:id - Review an accommodation
router.post("/accommodations/:id", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const accommodationId = parseInt(req.params.id);
    
    const reviewData = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().min(10).max(1000),
      cleanliness: z.number().min(1).max(5).optional(),
      communication: z.number().min(1).max(5).optional(),
      accuracy: z.number().min(1).max(5).optional(),
      location: z.number().min(1).max(5).optional(),
      valueForMoney: z.number().min(1).max(5).optional(),
    }).parse(req.body);

    // Check if user already reviewed this accommodation
    const existing = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.accommodationId, accommodationId),
        eq(reviews.reviewerId, req.userId!)
      ),
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this accommodation" });
    }

    const [review] = await db.insert(reviews).values({
      accommodationId,
      reviewerId: req.userId!,
      rating: reviewData.rating,
      comment: reviewData.comment,
      cleanliness: reviewData.cleanliness || null,
      communication: reviewData.communication || null,
      accuracy: reviewData.accuracy || null,
      location: reviewData.location || null,
      valueForMoney: reviewData.valueForMoney || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Create accommodation review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
});

// GET /api/reviews/accommodations/:id - Get reviews for an accommodation
router.get("/accommodations/:id", async (req, res) => {
  try {
    const accommodationId = parseInt(req.params.id);
    
    const accommodationReviews = await db.query.reviews.findMany({
      where: eq(reviews.accommodationId, accommodationId),
      with: {
        reviewer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            isVerified: true,
          }
        }
      },
      orderBy: [desc(reviews.createdAt)],
    });

    // Calculate average ratings
    const result = await db
      .select({
        avgRating: avg(reviews.rating),
        totalReviews: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.accommodationId, accommodationId));

    res.json({
      reviews: accommodationReviews,
      summary: {
        averageRating: result[0].avgRating ? parseFloat(result[0].avgRating) : 0,
        totalReviews: result[0].totalReviews,
      },
    });
  } catch (error) {
    console.error("Get accommodation reviews error:", error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
});

// POST /api/reviews/users/:id - Review a roommate/user
router.post("/users/:id", authenticateToken, requireTenant, async (req: AuthRequest, res) => {
  try {
    const reviewedUserId = parseInt(req.params.id);
    
    if (reviewedUserId === req.userId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const reviewData = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string().min(10).max(1000),
      cleanliness: z.number().min(1).max(5).optional(),
      communication: z.number().min(1).max(5).optional(),
      respectfulness: z.number().min(1).max(5).optional(),
      reliability: z.number().min(1).max(5).optional(),
    }).parse(req.body);

    // Check if user already reviewed this person
    const existing = await db.query.userReviews.findFirst({
      where: and(
        eq(userReviews.reviewedUserId, reviewedUserId),
        eq(userReviews.reviewerId, req.userId!)
      ),
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this user" });
    }

    const [review] = await db.insert(userReviews).values({
      reviewedUserId,
      reviewerId: req.userId!,
      rating: reviewData.rating,
      comment: reviewData.comment,
      cleanliness: reviewData.cleanliness || null,
      communication: reviewData.communication || null,
      respectfulness: reviewData.respectfulness || null,
      reliability: reviewData.reliability || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Create user review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
});

// GET /api/reviews/users/:id - Get reviews for a user
router.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const userReviewsList = await db.query.userReviews.findMany({
      where: eq(userReviews.reviewedUserId, userId),
      with: {
        reviewer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            isVerified: true,
          }
        }
      },
      orderBy: [desc(userReviews.createdAt)],
    });

    // Calculate average ratings
    const result = await db
      .select({
        avgRating: avg(userReviews.rating),
        totalReviews: count(userReviews.id),
      })
      .from(userReviews)
      .where(eq(userReviews.reviewedUserId, userId));

    res.json({
      reviews: userReviewsList,
      summary: {
        averageRating: result[0].avgRating ? parseFloat(result[0].avgRating) : 0,
        totalReviews: result[0].totalReviews,
      },
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
});

// PUT /api/reviews/accommodations/:reviewId - Update accommodation review
router.put("/accommodations/:reviewId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewerId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const updateData = z.object({
      rating: z.number().min(1).max(5).optional(),
      comment: z.string().min(10).max(1000).optional(),
      cleanliness: z.number().min(1).max(5).optional(),
      communication: z.number().min(1).max(5).optional(),
      accuracy: z.number().min(1).max(5).optional(),
      location: z.number().min(1).max(5).optional(),
      valueForMoney: z.number().min(1).max(5).optional(),
    }).parse(req.body);

    const [updated] = await db.update(reviews)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(reviews.id, reviewId))
      .returning();

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Update review error:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

// DELETE /api/reviews/accommodations/:reviewId - Delete accommodation review
router.delete("/accommodations/:reviewId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewerId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

export default router;
