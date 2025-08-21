# StudentShare - Student Accommodation Platform

## Overview

StudentShare is a specialized platform for South African students seeking shared accommodation outside university residences. The platform connects students looking for flatmates, enables rent cost sharing, and provides landlords with comprehensive tenant information for communes, houses, and flats in surrounding suburbs and townships. Built with modern web technologies for seamless roommate matching and accommodation management.

## System Architecture

### Full-Stack Architecture
The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Configured for Replit with autoscale deployment

### Technology Stack

**Frontend Technologies:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query for server state management
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling
- React Hook Form with Zod validation

**Backend Technologies:**
- Express.js with TypeScript
- Drizzle ORM for database operations
- Neon Database (PostgreSQL) for cloud database
- Zod for schema validation
- ESBuild for production builds

## Key Components

### Database Schema
The application uses core entities for student accommodation sharing:

1. **Users Table**: Student and landlord profiles
   - Fields: id, username, password, email, firstName, lastName, phone, university, studyField, yearOfStudy
   - Student lifestyle preferences, bio, profile images for compatibility matching
   - Handles both students seeking accommodation and property landlords

2. **Accommodations Table**: Student housing listings
   - Fields: title, description, address, area, city, province, monthlyRent, accommodationType
   - Room details: totalRooms, availableRooms, bathrooms
   - Features: hasWifi, hasParking, petsAllowed, images, amenities
   - Student-specific: nearbyUniversities, transportLinks, houseRules
   - Supports accommodation types: house, apartment, commune, backyard_room

3. **Roommates Table**: Current accommodation occupants
   - Links students to their current accommodation with rent share details
   - Tracks move-in dates and monthly payment amounts

4. **Applications Table**: Student accommodation applications
   - Links students to accommodations they're interested in
   - Captures application messages, preferred move-in dates, budget ranges
   - Application status tracking: pending, approved, rejected

### Frontend Architecture

**Component Structure:**
- **Pages**: Home, Accommodations listing, Accommodation details, List accommodation form
- **UI Components**: Reusable shadcn/ui components for consistent design
- **Feature Components**: Accommodation cards, search filters, application forms, rent split calculator
- **Student Components**: Roommate profiles, compatibility matching, cost sharing tools
- **Layout Components**: Header navigation with student-focused branding, responsive design

**State Management:**
- TanStack Query for server state caching and synchronization
- Local state with React hooks for UI interactions
- Form state managed with React Hook Form

**Routing Strategy:**
- Client-side routing with Wouter
- Dynamic routes for property details
- Query parameter handling for search filters

### Backend Architecture

**API Design:**
- RESTful API endpoints following standard conventions
- Property CRUD operations with filtering capabilities
- Inquiry submission and retrieval
- Error handling middleware with structured responses

**Data Layer:**
- Drizzle ORM for type-safe database operations
- PostgreSQL for relational data storage
- Migration system for schema management
- In-memory storage fallback for development

## Data Flow

### Accommodation Search Flow
1. Student enters search criteria (location, university, accommodation type, budget)
2. Frontend sends filtered GET request to `/api/accommodations`
3. Backend applies student-specific filters and queries database
4. Results cached by TanStack Query for performance
5. Accommodation cards with roommate count and rent split information

### Accommodation Listing Flow
1. Landlord fills out accommodation listing form with student-specific details
2. Form validation includes South African provinces, universities, and accommodation types
3. POST request to `/api/accommodations` endpoint
4. Server validates and stores accommodation data with student amenities
5. Success confirmation and cache invalidation

### Student Application Process
1. Student submits application with move-in date and budget preferences
2. Application linked to specific accommodation with personal message
3. Landlord can view applications with student profile information
4. Application status tracking and communication system

## External Dependencies

### Database Integration
- **Neon Database**: Cloud PostgreSQL provider
- **Drizzle Kit**: Database migrations and schema management
- Connection string via `DATABASE_URL` environment variable

### UI Framework
- **shadcn/ui**: Component library providing consistent design system
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds client, ESBuild bundles server
- **Port Configuration**: Server runs on port 5000, proxied to port 80

### Environment Setup
- Database provisioning through Replit's PostgreSQL module
- Environment variables managed through Replit secrets
- Automatic dependency installation and build process

### Build Process
1. Frontend assets built with Vite to `dist/public`
2. Server code bundled with ESBuild to `dist/index.js`
3. Static file serving in production mode
4. Development mode uses Vite middleware for HMR

## Recent Changes
- August 21, 2025: Transformed from property marketplace to specialized student accommodation platform
- Converted all property entities to accommodation entities in database schema and backend routes
- Built student-focused frontend with accommodation search, roommate profiles, and rent calculators
- Updated branding to "StudentShare" targeting South African university students
- Created new accommodation listing, search, and application functionality

## Changelog
- June 24, 2025: Initial property marketplace setup
- August 21, 2025: Complete transformation to student accommodation sharing platform

## User Preferences

Preferred communication style: Simple, everyday language.