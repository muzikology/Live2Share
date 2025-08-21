import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAccommodationSchema, insertApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Accommodation routes
  app.get("/api/accommodations", async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        province: req.query.province as string,
        area: req.query.area as string,
        accommodationType: req.query.accommodationType as string,
        minRent: req.query.minRent ? parseInt(req.query.minRent as string) : undefined,
        maxRent: req.query.maxRent ? parseInt(req.query.maxRent as string) : undefined,
        availableRooms: req.query.availableRooms ? parseInt(req.query.availableRooms as string) : undefined,
        university: req.query.university as string,
      };

      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      );

      const accommodations = await storage.getAccommodations(cleanFilters);
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accommodation = await storage.getAccommodation(id);
      
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      
      res.json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodation" });
    }
  });

  app.get("/api/accommodations/:id/roommates", async (req, res) => {
    try {
      const accommodationId = parseInt(req.params.id);
      const roommates = await storage.getCurrentRoommatesForAccommodation(accommodationId);
      res.json(roommates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roommates" });
    }
  });

  app.post("/api/accommodations", async (req, res) => {
    try {
      const validatedData = insertAccommodationSchema.parse(req.body);
      const accommodation = await storage.createAccommodation(validatedData);
      res.status(201).json(accommodation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid accommodation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create accommodation" });
    }
  });

  app.put("/api/accommodations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAccommodationSchema.partial().parse(req.body);
      const accommodation = await storage.updateAccommodation(id, validatedData);
      
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      
      res.json(accommodation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid accommodation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update accommodation" });
    }
  });

  app.delete("/api/accommodations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAccommodation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      
      res.json({ message: "Accommodation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete accommodation" });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.get("/api/accommodations/:id/applications", async (req, res) => {
    try {
      const accommodationId = parseInt(req.params.id);
      const applications = await storage.getApplicationsForAccommodation(accommodationId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Search suggestions
  app.get("/api/search/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }

      const accommodations = await storage.getAccommodations();
      const suggestions = Array.from(new Set([
        ...accommodations.map(a => a.city),
        ...accommodations.map(a => a.area),
        ...accommodations.map(a => a.province),
        ...accommodations.flatMap(a => a.nearbyUniversities),
        ...accommodations.map(a => `${a.area}, ${a.city}`),
      ]))
        .filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10);

      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}