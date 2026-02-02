import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { accommodations, favorites, users } from "@shared/schema";
import { eq, and, gte, lte, sql, or } from "drizzle-orm";
import { authenticateToken, requireLandlord, optionalAuth, type AuthRequest } from "./auth";

const router = Router();

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/accommodations/search - Advanced search with filters
router.get("/search", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      city,
      province,
      area,
      accommodationType,
      minRent,
      maxRent,
      minRooms,
      maxRooms,
      furnished,
      petsAllowed,
      wifi,
      parking,
      latitude,
      longitude,
      radius, // in km
      university,
      genderPreference,
      sortBy = "relevance", // relevance, price_asc, price_desc, distance, newest
    } = req.query;

    // Build query conditions
    const conditions: any[] = [eq(accommodations.isActive, true)];

    if (city) conditions.push(eq(accommodations.city, city as string));
    if (province) conditions.push(eq(accommodations.province, province as string));
    if (area) conditions.push(eq(accommodations.area, area as string));
    if (accommodationType) conditions.push(eq(accommodations.accommodationType, accommodationType as string));
    if (minRent) conditions.push(gte(accommodations.monthlyRent, minRent as string));
    if (maxRent) conditions.push(lte(accommodations.monthlyRent, maxRent as string));
    if (minRooms) conditions.push(gte(accommodations.availableRooms, parseInt(minRooms as string)));
    if (furnished !== undefined) conditions.push(eq(accommodations.furnished, furnished === "true"));
    if (petsAllowed !== undefined) conditions.push(eq(accommodations.petsAllowed, petsAllowed === "true"));
    if (wifi !== undefined) conditions.push(eq(accommodations.hasWifi, wifi === "true"));
    if (parking !== undefined) conditions.push(eq(accommodations.hasParking, parking === "true"));
    if (genderPreference) conditions.push(or(
      eq(accommodations.genderPreference, genderPreference as string),
      eq(accommodations.genderPreference, "any")
    ));

    // Execute query
    let results = await db.query.accommodations.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        landlord: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            isVerified: true,
          }
        }
      }
    });

    // Filter by geolocation if provided
    if (latitude && longitude && radius) {
      const userLat = parseFloat(latitude as string);
      const userLon = parseFloat(longitude as string);
      const maxRadius = parseFloat(radius as string);

      results = results.filter(acc => {
        if (!acc.latitude || !acc.longitude) return false;
        const distance = calculateDistance(
          userLat, 
          userLon, 
          parseFloat(acc.latitude as any), 
          parseFloat(acc.longitude as any)
        );
        return distance <= maxRadius;
      });
    }

    // Filter by university proximity if provided
    if (university) {
      results = results.filter(acc => 
        acc.nearbyUniversities?.includes(university as string)
      );
    }

    // Calculate distances for sorting
    const enrichedResults = results.map(acc => {
      let distance = null;
      if (latitude && longitude && acc.latitude && acc.longitude) {
        distance = calculateDistance(
          parseFloat(latitude as string),
          parseFloat(longitude as string),
          parseFloat(acc.latitude as any),
          parseFloat(acc.longitude as any)
        );
      }

      return {
        ...acc,
        distance: distance ? Math.round(distance * 10) / 10 : null, // Round to 1 decimal
      };
    });

    // Sort results
    let sortedResults = enrichedResults;
    switch (sortBy) {
      case "price_asc":
        sortedResults.sort((a, b) => parseFloat(a.monthlyRent) - parseFloat(b.monthlyRent));
        break;
      case "price_desc":
        sortedResults.sort((a, b) => parseFloat(b.monthlyRent) - parseFloat(a.monthlyRent));
        break;
      case "distance":
        sortedResults.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
        break;
      case "newest":
        sortedResults.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default: // relevance
        // Sort by combination of factors
        sortedResults.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          // Favor properties with images
          scoreA += (a.images?.length || 0) * 10;
          scoreB += (b.images?.length || 0) * 10;
          
          // Favor verified landlords
          if (a.landlord?.isVerified) scoreA += 50;
          if (b.landlord?.isVerified) scoreB += 50;
          
          // Favor closer properties
          if (a.distance !== null) scoreA += (100 - a.distance);
          if (b.distance !== null) scoreB += (100 - b.distance);
          
          return scoreB - scoreA;
        });
    }

    // Add favorite status if user is authenticated
    if (req.userId) {
      const userFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, req.userId),
      });
      const favoriteIds = new Set(userFavorites.map(f => f.accommodationId));
      
      sortedResults = sortedResults.map(acc => ({
        ...acc,
        isFavorite: favoriteIds.has(acc.id),
      }));
    }

    res.json({
      total: sortedResults.length,
      results: sortedResults,
    });
  } catch (error) {
    console.error("Search accommodations error:", error);
    res.status(500).json({ message: "Failed to search accommodations" });
  }
});

// GET /api/accommodations/:id - Get single accommodation with details
router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
      with: {
        landlord: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true,
            bio: true,
            isVerified: true,
            createdAt: true,
          }
        }
      }
    });

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    // Increment view count
    await db.update(accommodations)
      .set({ viewCount: sql`${accommodations.viewCount} + 1` })
      .where(eq(accommodations.id, id));

    // Check if favorited by current user
    let isFavorite = false;
    if (req.userId) {
      const favorite = await db.query.favorites.findFirst({
        where: and(
          eq(favorites.userId, req.userId),
          eq(favorites.accommodationId, id)
        ),
      });
      isFavorite = !!favorite;
    }

    res.json({
      ...accommodation,
      isFavorite,
    });
  } catch (error) {
    console.error("Get accommodation error:", error);
    res.status(500).json({ message: "Failed to get accommodation" });
  }
});

// POST /api/accommodations - Create new accommodation (landlords only)
router.post("/", authenticateToken, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const accommodationData = z.object({
      title: z.string().min(10).max(200),
      description: z.string().min(50),
      address: z.string(),
      area: z.string(),
      city: z.string(),
      province: z.string(),
      postalCode: z.string(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      monthlyRent: z.number().positive(),
      deposit: z.number().optional(),
      utilitiesIncluded: z.boolean().optional(),
      utilitiesCost: z.number().optional(),
      accommodationType: z.string(),
      totalRooms: z.number().int().positive(),
      availableRooms: z.number().int().positive(),
      bathrooms: z.number().int().positive(),
      furnished: z.boolean().optional(),
      hasWifi: z.boolean().optional(),
      hasParking: z.boolean().optional(),
      petsAllowed: z.boolean().optional(),
      hasLaundry: z.boolean().optional(),
      hasKitchen: z.boolean().optional(),
      hasSecurity: z.boolean().optional(),
      images: z.array(z.string().url()).optional(),
      amenities: z.array(z.string()).optional(),
      nearbyUniversities: z.array(z.string()).optional(),
      transportLinks: z.array(z.string()).optional(),
      houseRules: z.array(z.string()).optional(),
      minimumStayMonths: z.number().int().optional(),
      genderPreference: z.string().optional(),
      isShared: z.boolean().optional(),
      rentSplitEnabled: z.boolean().optional(),
      rentPerPerson: z.number().optional(),
    }).parse(req.body);

    const [newAccommodation] = await db.insert(accommodations).values({
      ...accommodationData,
      landlordId: req.userId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(newAccommodation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Create accommodation error:", error);
    res.status(500).json({ message: "Failed to create accommodation" });
  }
});

// PUT /api/accommodations/:id - Update accommodation
router.put("/:id", authenticateToken, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Verify ownership
    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
    });

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (accommodation.landlordId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this accommodation" });
    }

    const [updated] = await db.update(accommodations)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(accommodations.id, id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Update accommodation error:", error);
    res.status(500).json({ message: "Failed to update accommodation" });
  }
});

// DELETE /api/accommodations/:id - Delete (deactivate) accommodation
router.delete("/:id", authenticateToken, requireLandlord, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Verify ownership
    const accommodation = await db.query.accommodations.findFirst({
      where: eq(accommodations.id, id),
    });

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (accommodation.landlordId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this accommodation" });
    }

    // Soft delete
    await db.update(accommodations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(accommodations.id, id));

    res.json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    console.error("Delete accommodation error:", error);
    res.status(500).json({ message: "Failed to delete accommodation" });
  }
});

// POST /api/accommodations/:id/favorite - Toggle favorite
router.post("/:id/favorite", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const accommodationId = parseInt(req.params.id);
    
    // Check if already favorited
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, req.userId!),
        eq(favorites.accommodationId, accommodationId)
      ),
    });

    if (existing) {
      // Remove favorite
      await db.delete(favorites).where(
        and(
          eq(favorites.userId, req.userId!),
          eq(favorites.accommodationId, accommodationId)
        )
      );
      res.json({ isFavorite: false, message: "Removed from favorites" });
    } else {
      // Add favorite
      await db.insert(favorites).values({
        userId: req.userId!,
        accommodationId,
        createdAt: new Date(),
      });
      res.json({ isFavorite: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ message: "Failed to update favorite" });
  }
});

// GET /api/accommodations/user/favorites - Get user's favorites
router.get("/user/favorites", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, req.userId!),
      with: {
        accommodation: {
          with: {
            landlord: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                isVerified: true,
              }
            }
          }
        }
      }
    });

    const results = userFavorites.map(f => ({
      ...f.accommodation,
      isFavorite: true,
    }));

    res.json(results);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: "Failed to get favorites" });
  }
});

export default router;
