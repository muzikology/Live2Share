import { 
  users, 
  accommodations, 
  roommates, 
  applications, 
  rentalAgreements,
  type User, 
  type InsertUser, 
  type Accommodation, 
  type InsertAccommodation, 
  type Roommate,
  type InsertRoommate,
  type Application, 
  type InsertApplication,
  type RentalAgreement,
  type InsertRentalAgreement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Accommodation operations
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  getAccommodations(filters?: {
    city?: string;
    province?: string;
    area?: string;
    accommodationType?: string;
    minRent?: number;
    maxRent?: number;
    availableRooms?: number;
    university?: string;
  }): Promise<Accommodation[]>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  updateAccommodation(id: number, updates: Partial<InsertAccommodation>): Promise<Accommodation | undefined>;
  deleteAccommodation(id: number): Promise<boolean>;
  getAccommodationsByLandlord(landlordId: number): Promise<Accommodation[]>;

  // Roommate operations
  createRoommate(roommate: InsertRoommate): Promise<Roommate>;
  getRoommatesForAccommodation(accommodationId: number): Promise<(Roommate & { user: User })[]>;
  getCurrentRoommatesForAccommodation(accommodationId: number): Promise<(Roommate & { user: User })[]>;

  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsForAccommodation(accommodationId: number): Promise<(Application & { applicant: User })[]>;
  getApplicationsByUser(userId: number): Promise<(Application & { accommodation: Accommodation })[]>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Rental Agreement operations
  createRentalAgreement(agreement: InsertRentalAgreement): Promise<RentalAgreement>;
  getRentalAgreementForAccommodation(accommodationId: number): Promise<RentalAgreement | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accommodations: Map<number, Accommodation>;
  private roommates: Map<number, Roommate>;
  private applications: Map<number, Application>;
  private rentalAgreements: Map<number, RentalAgreement>;
  private currentUserId: number;
  private currentAccommodationId: number;
  private currentRoommateId: number;
  private currentApplicationId: number;
  private currentRentalAgreementId: number;

  constructor() {
    this.users = new Map();
    this.accommodations = new Map();
    this.roommates = new Map();
    this.applications = new Map();
    this.rentalAgreements = new Map();
    this.currentUserId = 1;
    this.currentAccommodationId = 1;
    this.currentRoommateId = 1;
    this.currentApplicationId = 1;
    this.currentRentalAgreementId = 1;

    // Add sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample students and landlords
    const sampleUsers = [
      {
        username: "thabo.mthembu",
        password: "password123",
        email: "thabo@wits.ac.za",
        firstName: "Thabo",
        lastName: "Mthembu",
        phone: "082 123 4567",
        university: "University of the Witwatersrand",
        studyField: "Computer Science",
        yearOfStudy: 2,
        bio: "Quiet second-year CS student looking for shared accommodation near Wits. I enjoy reading and coding in my spare time.",
        lifestyle: ["quiet", "early_riser", "studious"],
        preferences: ["non_smoking", "clean", "no_parties"],
        isVerified: true,
      },
      {
        username: "sarah.landlord",
        password: "password123",
        email: "sarah@accommodationsa.com",
        firstName: "Sarah",
        lastName: "Williams",
        phone: "011 234 5678",
        university: "N/A - Landlord",
        studyField: "N/A",
        yearOfStudy: 0,
        bio: "Property manager specializing in student accommodation.",
        lifestyle: [],
        preferences: [],
        isVerified: true,
      },
      {
        username: "nomsa.dlamini",
        password: "password123",
        email: "nomsa@uct.ac.za",
        firstName: "Nomsa",
        lastName: "Dlamini",
        phone: "021 987 6543",
        university: "University of Cape Town",
        studyField: "Medicine",
        yearOfStudy: 3,
        bio: "Third-year medical student looking for accommodation near UCT. Social and friendly, enjoys studying with others.",
        lifestyle: ["social", "night_owl"],
        preferences: ["pet_friendly", "social_environment"],
        isVerified: true,
      },
      {
        username: "james.vanderwalt",
        password: "password123",
        email: "james@landlordpro.co.za",
        firstName: "James",
        lastName: "van der Walt",
        phone: "031 555 7890",
        university: "N/A - Landlord",
        studyField: "N/A",
        yearOfStudy: 0,
        bio: "Experienced landlord with multiple student properties in Durban.",
        lifestyle: [],
        preferences: [],
        isVerified: true,
      },
    ];

    for (const userData of sampleUsers) {
      await this.createUser(userData);
    }

    // Create sample accommodations
    const sampleAccommodations = [
      {
        title: "Student House near Wits University",
        description: "Spacious 4-bedroom house perfect for students. Walking distance to Wits campus, secure area, and fully furnished common areas. Great for sharing with friends or meeting new people.",
        address: "15 Yale Road",
        area: "Braamfontein",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: "2001",
        monthlyRent: "16000",
        deposit: "16000",
        accommodationType: "house",
        totalRooms: 4,
        availableRooms: 2,
        bathrooms: 2,
        hasWifi: true,
        hasParking: true,
        petsAllowed: false,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        ],
        amenities: ["Furnished", "High-Speed WiFi", "Secure Parking", "Study Area", "Kitchen", "Lounge"],
        nearbyUniversities: ["University of the Witwatersrand", "University of Johannesburg"],
        transportLinks: ["Gautrain Park Station", "Rea Vaya BRT", "Taxi Rank"],
        houseRules: ["No smoking inside", "Quiet hours 22:00-06:00", "Clean common areas", "No overnight guests without notice"],
        landlordId: 2,
        isActive: true,
      },
      {
        title: "Modern Flat in Rosebank - Student Friendly",
        description: "Comfortable 3-bedroom flat in trendy Rosebank. Perfect for serious students who want modern amenities and easy access to universities.",
        address: "88 Oxford Road",
        area: "Rosebank",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: "2196",
        monthlyRent: "18000",
        deposit: "18000",
        accommodationType: "apartment",
        totalRooms: 3,
        availableRooms: 1,
        bathrooms: 2,
        hasWifi: true,
        hasParking: true,
        petsAllowed: false,
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Air Conditioning", "High-Speed WiFi", "Gym Access", "24/7 Security", "Shopping Mall Access"],
        nearbyUniversities: ["University of the Witwatersrand", "UNISA"],
        transportLinks: ["Gautrain Rosebank Station", "Multiple Bus Routes"],
        houseRules: ["No smoking", "No parties", "Visitors register at security", "Keep noise down"],
        landlordId: 2,
        isActive: true,
      },
      {
        title: "UCT Student Commune in Observatory",
        description: "Bohemian-style house perfect for creative students! Share with like-minded individuals in this artistic neighborhood close to UCT.",
        address: "42 Station Road",
        area: "Observatory",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7925",
        monthlyRent: "12000",
        deposit: "12000",
        accommodationType: "commune",
        totalRooms: 5,
        availableRooms: 3,
        bathrooms: 2,
        hasWifi: true,
        hasParking: false,
        petsAllowed: true,
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Garden", "Art Studio", "Communal Kitchen", "WiFi", "Bicycle Storage"],
        nearbyUniversities: ["University of Cape Town", "CPUT"],
        transportLinks: ["Observatory Train Station", "Multiple Bus Routes", "Cycling Distance to UCT"],
        houseRules: ["Respect others", "Contribute to house duties", "Pet owners clean up", "Community meetings monthly"],
        landlordId: 4,
        isActive: true,
      },
      {
        title: "Affordable Backyard Room - UKZN Westville",
        description: "Clean, safe backyard room perfect for budget-conscious students. Includes own entrance, shared kitchen and bathroom facilities.",
        address: "156 Dawncliffe Road",
        area: "Westville",
        city: "Durban",
        province: "KwaZulu-Natal",
        postalCode: "3630",
        monthlyRent: "2500",
        deposit: "2500",
        accommodationType: "backyard_room",
        totalRooms: 1,
        availableRooms: 1,
        bathrooms: 1,
        hasWifi: true,
        hasParking: true,
        petsAllowed: false,
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        amenities: ["Own Entrance", "WiFi", "Parking", "Kitchen Access", "Garden View"],
        nearbyUniversities: ["University of KwaZulu-Natal"],
        transportLinks: ["Bus Route to UKZN", "Taxi Route"],
        houseRules: ["No smoking", "Keep common areas clean", "Quiet after 22:00"],
        landlordId: 4,
        isActive: true,
      },
    ];

    for (const accommodationData of sampleAccommodations) {
      await this.createAccommodation(accommodationData);
    }

    // Create some roommate relationships
    await this.createRoommate({
      accommodationId: 1,
      userId: 1,
      moveInDate: new Date('2024-02-01'),
      monthlyShare: "4000",
      isCurrentResident: true,
    });

    await this.createRoommate({
      accommodationId: 2,
      userId: 3,
      moveInDate: new Date('2024-01-15'),
      monthlyShare: "6000",
      isCurrentResident: true,
    });
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
      phone: insertUser.phone || null,
      profileImage: insertUser.profileImage || null,
      bio: insertUser.bio || null,
      lifestyle: insertUser.lifestyle || [],
      preferences: insertUser.preferences || [],
      isVerified: insertUser.isVerified || false
    };
    this.users.set(id, user);
    return user;
  }

  // Accommodation operations
  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async getAccommodations(filters?: {
    city?: string;
    province?: string;
    area?: string;
    accommodationType?: string;
    minRent?: number;
    maxRent?: number;
    availableRooms?: number;
    university?: string;
  }): Promise<Accommodation[]> {
    let accommodations = Array.from(this.accommodations.values()).filter(a => a.isActive);

    if (filters) {
      if (filters.city) {
        accommodations = accommodations.filter(a => 
          a.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.province) {
        accommodations = accommodations.filter(a => 
          a.province.toLowerCase() === filters.province!.toLowerCase()
        );
      }
      if (filters.area) {
        accommodations = accommodations.filter(a => 
          a.area.toLowerCase().includes(filters.area!.toLowerCase())
        );
      }
      if (filters.accommodationType) {
        accommodations = accommodations.filter(a => a.accommodationType === filters.accommodationType);
      }
      if (filters.minRent) {
        accommodations = accommodations.filter(a => parseFloat(a.monthlyRent) >= filters.minRent!);
      }
      if (filters.maxRent) {
        accommodations = accommodations.filter(a => parseFloat(a.monthlyRent) <= filters.maxRent!);
      }
      if (filters.availableRooms) {
        accommodations = accommodations.filter(a => a.availableRooms >= filters.availableRooms!);
      }
      if (filters.university) {
        accommodations = accommodations.filter(a => 
          a.nearbyUniversities.some(u => 
            u.toLowerCase().includes(filters.university!.toLowerCase())
          )
        );
      }
    }

    return accommodations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentAccommodationId++;
    const now = new Date();
    const accommodation: Accommodation = { 
      ...insertAccommodation, 
      id, 
      createdAt: now, 
      updatedAt: now,
      deposit: insertAccommodation.deposit || null,
      hasWifi: insertAccommodation.hasWifi || false,
      hasParking: insertAccommodation.hasParking || false,
      petsAllowed: insertAccommodation.petsAllowed || false,
      images: insertAccommodation.images || [],
      amenities: insertAccommodation.amenities || [],
      nearbyUniversities: insertAccommodation.nearbyUniversities || [],
      transportLinks: insertAccommodation.transportLinks || [],
      houseRules: insertAccommodation.houseRules || [],
      isActive: insertAccommodation.isActive !== undefined ? insertAccommodation.isActive : true
    };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async updateAccommodation(id: number, updates: Partial<InsertAccommodation>): Promise<Accommodation | undefined> {
    const accommodation = this.accommodations.get(id);
    if (!accommodation) return undefined;

    const updatedAccommodation: Accommodation = {
      ...accommodation,
      ...updates,
      updatedAt: new Date(),
    };
    this.accommodations.set(id, updatedAccommodation);
    return updatedAccommodation;
  }

  async deleteAccommodation(id: number): Promise<boolean> {
    return this.accommodations.delete(id);
  }

  async getAccommodationsByLandlord(landlordId: number): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values())
      .filter(a => a.landlordId === landlordId && a.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Roommate operations
  async createRoommate(insertRoommate: InsertRoommate): Promise<Roommate> {
    const id = this.currentRoommateId++;
    const roommate: Roommate = { 
      ...insertRoommate, 
      id, 
      createdAt: new Date(),
      moveOutDate: insertRoommate.moveOutDate || null,
      isCurrentResident: insertRoommate.isCurrentResident !== undefined ? insertRoommate.isCurrentResident : true
    };
    this.roommates.set(id, roommate);
    return roommate;
  }

  async getRoommatesForAccommodation(accommodationId: number): Promise<(Roommate & { user: User })[]> {
    const roommates = Array.from(this.roommates.values())
      .filter(r => r.accommodationId === accommodationId);
    
    return roommates.map(roommate => ({
      ...roommate,
      user: this.users.get(roommate.userId)!
    })).filter(r => r.user);
  }

  async getCurrentRoommatesForAccommodation(accommodationId: number): Promise<(Roommate & { user: User })[]> {
    const roommates = Array.from(this.roommates.values())
      .filter(r => r.accommodationId === accommodationId && r.isCurrentResident);
    
    return roommates.map(roommate => ({
      ...roommate,
      user: this.users.get(roommate.userId)!
    })).filter(r => r.user);
  }

  // Application operations
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const application: Application = { 
      ...insertApplication, 
      id, 
      createdAt: new Date(),
      status: insertApplication.status || "pending"
    };
    this.applications.set(id, application);
    return application;
  }

  async getApplicationsForAccommodation(accommodationId: number): Promise<(Application & { applicant: User })[]> {
    const applications = Array.from(this.applications.values())
      .filter(a => a.accommodationId === accommodationId);
    
    return applications.map(application => ({
      ...application,
      applicant: this.users.get(application.applicantId)!
    })).filter(a => a.applicant);
  }

  async getApplicationsByUser(userId: number): Promise<(Application & { accommodation: Accommodation })[]> {
    const applications = Array.from(this.applications.values())
      .filter(a => a.applicantId === userId);
    
    return applications.map(application => ({
      ...application,
      accommodation: this.accommodations.get(application.accommodationId)!
    })).filter(a => a.accommodation);
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;

    const updatedApplication: Application = {
      ...application,
      status,
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Rental Agreement operations
  async createRentalAgreement(insertAgreement: InsertRentalAgreement): Promise<RentalAgreement> {
    const id = this.currentRentalAgreementId++;
    const agreement: RentalAgreement = { 
      ...insertAgreement, 
      id, 
      createdAt: new Date(),
      deposit: insertAgreement.deposit || null,
      utilities: insertAgreement.utilities || []
    };
    this.rentalAgreements.set(id, agreement);
    return agreement;
  }

  async getRentalAgreementForAccommodation(accommodationId: number): Promise<RentalAgreement | undefined> {
    return Array.from(this.rentalAgreements.values())
      .find(a => a.accommodationId === accommodationId);
  }
}

export const storage = new MemStorage();
