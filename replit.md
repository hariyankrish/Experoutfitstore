# EXPEROUTFIT - Custom Streetwear Platform

## Overview

EXPEROUTFIT is a full-stack e-commerce platform specializing in custom streetwear design and sales. The application enables users to create personalized clothing designs using an intuitive design studio, browse and purchase products, and interact with AI-powered customer support. The platform integrates modern web technologies with external services for payments, image processing, and communication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Management**: npm with workspace configuration

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state, React Context for cart state
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors and CSS variables
- **TypeScript**: Strict type checking with path aliases for clean imports

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging, error handling, and authentication
- **Database Layer**: Drizzle ORM with connection pooling via @neondatabase/serverless
- **Authentication**: Passport.js with OpenID Connect strategy for Replit Auth
- **Session Management**: Express sessions stored in PostgreSQL
- **File Uploads**: Multer for handling image uploads

### Data Storage Solutions
- **Primary Database**: PostgreSQL with the following key tables:
  - Users (Replit Auth integration)
  - Products and Categories
  - Custom Designs
  - Orders and Order Items
  - Reviews and Chat Conversations
  - Sessions (for authentication)
- **Schema Management**: Drizzle migrations with TypeScript schema definitions
- **Connection**: Neon serverless PostgreSQL with WebSocket support

### Authentication and Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role-Based Access**: User roles (customer, admin) with middleware protection
- **Security**: HTTPS cookies, CSRF protection, secure session configuration

## Data Flow

1. **User Authentication**: Users authenticate via Replit OAuth, sessions stored in database
2. **Product Browsing**: Client fetches products/categories via React Query, cached responses
3. **Custom Design**: Design studio saves designs to database, integrates with image processing
4. **Shopping Cart**: Client-side cart state persisted to localStorage, synced on checkout
5. **Order Processing**: Orders created in database, integrated with payment and notification systems
6. **AI Chat**: Real-time chat with OpenAI integration for customer support

## External Dependencies

### Core Services
- **OpenAI**: GPT-4 integration for AI chatbot and product recommendations
- **Remove.bg**: Background removal service for design assets
- **WhatsApp Business API**: Customer communication and order notifications
- **Stripe**: Payment processing (configured but implementation varies)

### Development Tools
- **Vite**: Build tool with hot module replacement and optimized bundling
- **ESBuild**: Server-side bundling for production builds
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type checking and compilation

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express API proxy
- **Environment Variables**: DATABASE_URL, API keys for external services
- **Development Scripts**: `npm run dev` starts both client and server

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Asset Handling**: Static file serving for built client assets
- **Environment**: Production mode with optimized builds

### Database Management
- **Migrations**: Drizzle Kit handles schema changes
- **Connection Pooling**: Neon serverless with automatic scaling
- **Backup Strategy**: Relies on Neon's built-in backup systems

### Monitoring and Logging
- **Request Logging**: Custom Express middleware logs API requests
- **Error Handling**: Centralized error handling with proper status codes
- **Performance**: React Query caching reduces server load

### Security Considerations
- **Authentication**: Secure session management with PostgreSQL storage
- **API Protection**: Middleware validates authentication for protected routes
- **Input Validation**: Zod schemas validate request data
- **File Upload Security**: Multer with size limits and type restrictions

The architecture prioritizes developer experience with TypeScript throughout, modern React patterns, and a clean separation of concerns between client and server code. The system is designed to scale with additional external integrations and supports both custom design workflows and traditional e-commerce functionality.