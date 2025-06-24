import { users, properties, inquiries, type User, type InsertUser, type Property, type InsertProperty, type Inquiry, type InsertInquiry } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: {
    city?: string;
    state?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;

  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesForProperty(propertyId: number): Promise<Inquiry[]>;
  getInquiriesForOwner(ownerId: number): Promise<Inquiry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private inquiries: Map<number, Inquiry>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentInquiryId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.inquiries = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentInquiryId = 1;

    // Add sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample users
    const sampleUsers = [
      {
        username: "sarah.johnson",
        password: "password123",
        email: "sarah@propertyhub.com",
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "(555) 123-4567",
        createdAt: new Date(),
      },
      {
        username: "michael.chen",
        password: "password123",
        email: "michael@propertyhub.com",
        firstName: "Michael",
        lastName: "Chen",
        phone: "(555) 987-6543",
        createdAt: new Date(),
      },
    ];

    for (const userData of sampleUsers) {
      await this.createUser(userData);
    }

    // Create sample properties
    const sampleProperties = [
      {
        title: "Modern Family Home",
        description: "Beautiful 4-bedroom home with modern amenities and spacious backyard. Perfect for families looking for comfort and style.",
        address: "123 Oak Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        price: "1250000",
        propertyType: "house",
        listingType: "sale",
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 2400,
        yearBuilt: 2018,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        ],
        amenities: ["Swimming Pool", "Garage", "Garden", "Modern Kitchen"],
        ownerId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Downtown Luxury Apartment",
        description: "Stunning 2-bedroom apartment in the heart of downtown with city views and premium finishes.",
        address: "456 Broadway",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        price: "4500",
        propertyType: "apartment",
        listingType: "rent",
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        yearBuilt: 2020,
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        ],
        amenities: ["City Views", "Fitness Center", "Concierge", "Rooftop Terrace"],
        ownerId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Premium Office Space",
        description: "Professional office space in prime location, perfect for growing businesses.",
        address: "789 Business Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        price: "12000",
        propertyType: "commercial",
        listingType: "lease",
        bedrooms: null,
        bathrooms: 2,
        squareFootage: 3500,
        yearBuilt: 2019,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Parking", "Conference Rooms", "High Speed Internet", "Reception Area"],
        ownerId: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Charming Suburban Home",
        description: "Lovely 3-bedroom home in quiet neighborhood with great schools nearby.",
        address: "321 Maple Drive",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        price: "675000",
        propertyType: "house",
        listingType: "sale",
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1800,
        yearBuilt: 2015,
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Backyard", "Garage", "Fireplace", "Walk-in Closets"],
        ownerId: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Luxury Condo",
        description: "Elegant 2-bedroom condo with ocean views and resort-style amenities.",
        address: "654 Ocean Boulevard",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        price: "3200",
        propertyType: "condo",
        listingType: "rent",
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1100,
        yearBuilt: 2021,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Ocean View", "Pool", "Gym", "Balcony"],
        ownerId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Historic Victorian",
        description: "Beautifully restored Victorian home with original charm and modern updates.",
        address: "987 Heritage Lane",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        price: "950000",
        propertyType: "house",
        listingType: "sale",
        bedrooms: 5,
        bathrooms: 3,
        squareFootage: 2800,
        yearBuilt: 1895,
        images: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Historical Character", "Hardwood Floors", "Bay Windows", "Garden"],
        ownerId: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const propertyData of sampleProperties) {
      await this.createProperty(propertyData);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: {
    city?: string;
    state?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values()).filter(p => p.isActive);

    if (filters) {
      if (filters.city) {
        properties = properties.filter(p => 
          p.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.state) {
        properties = properties.filter(p => 
          p.state.toLowerCase() === filters.state!.toLowerCase()
        );
      }
      if (filters.propertyType) {
        properties = properties.filter(p => p.propertyType === filters.propertyType);
      }
      if (filters.listingType) {
        properties = properties.filter(p => p.listingType === filters.listingType);
      }
      if (filters.minPrice) {
        properties = properties.filter(p => parseFloat(p.price) >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        properties = properties.filter(p => parseFloat(p.price) <= filters.maxPrice!);
      }
      if (filters.bedrooms) {
        properties = properties.filter(p => p.bedrooms === filters.bedrooms);
      }
      if (filters.bathrooms) {
        properties = properties.filter(p => p.bathrooms === filters.bathrooms);
      }
    }

    return properties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const now = new Date();
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: now, 
      updatedAt: now,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      squareFootage: insertProperty.squareFootage || null,
      yearBuilt: insertProperty.yearBuilt || null,
      images: insertProperty.images || [],
      amenities: insertProperty.amenities || [],
      isActive: insertProperty.isActive !== undefined ? insertProperty.isActive : true
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updatedProperty: Property = {
      ...property,
      ...updates,
      updatedAt: new Date(),
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return Array.from(this.properties.values())
      .filter(p => p.ownerId === ownerId && p.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Inquiry operations
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date(),
      phone: insertInquiry.phone || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiriesForProperty(propertyId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values())
      .filter(i => i.propertyId === propertyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInquiriesForOwner(ownerId: number): Promise<Inquiry[]> {
    const ownerProperties = await this.getPropertiesByOwner(ownerId);
    const propertyIds = ownerProperties.map(p => p.id);
    
    return Array.from(this.inquiries.values())
      .filter(i => propertyIds.includes(i.propertyId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
