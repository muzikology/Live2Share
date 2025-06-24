# PropertyHub - Real Estate Platform

## Overview

PropertyHub is a full-stack real estate platform built with modern web technologies. It provides a comprehensive solution for property listings, search functionality, and inquiry management. The application serves both property seekers and property owners, offering features for browsing, listing, and managing real estate properties.

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
The application uses three main entities:

1. **Users Table**: Stores user authentication and profile information
   - Fields: id, username, password, email, firstName, lastName, phone, createdAt
   - Handles property owners and potential buyers/renters

2. **Properties Table**: Core property listing data
   - Fields: title, description, address, location details, price, property type, listing type
   - Property attributes: bedrooms, bathrooms, square footage, year built
   - Metadata: images array, amenities array, owner reference, active status
   - Supports multiple listing types: sale, rent, lease

3. **Inquiries Table**: Contact/interest tracking
   - Links properties to potential customers
   - Captures inquiry details and contact information
   - Categorizes inquiry types: viewing, purchase, rental, general

### Frontend Architecture

**Component Structure:**
- **Pages**: Home, Properties listing, Property details, List property form
- **UI Components**: Reusable shadcn/ui components for consistent design
- **Feature Components**: Property cards, search filters, contact forms, mortgage calculator
- **Layout Components**: Header navigation, responsive design elements

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

### Property Search Flow
1. User enters search criteria on frontend
2. Frontend sends filtered GET request to `/api/properties`
3. Backend applies filters and queries database
4. Results cached by TanStack Query for performance
5. Property cards rendered with optimized images

### Property Listing Flow
1. Owner fills out property listing form
2. Form validation with Zod schemas
3. POST request to `/api/properties` endpoint
4. Server validates and stores property data
5. Success confirmation and cache invalidation

### Inquiry Process
1. Interested party submits contact form
2. Inquiry linked to specific property
3. Property owner can view inquiries
4. Email notifications (planned feature)

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

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.