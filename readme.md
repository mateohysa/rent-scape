# RentScape: Property Rental Platform

## 1. Introduction

### Project Overview
RentScape is a comprehensive property rental platform designed to streamline the rental process for both property managers and tenants. The application provides a unified ecosystem where property managers can list and manage their rental properties, while potential tenants can search, view, apply for, and manage their rental accommodations.

### Scope of the Project
The platform aims to digitize and simplify the entire rental lifecycle, from property listing and searching to application management, lease agreements, and rent payments. The application includes:
- Property listing and search functionality with filtering options
- User authentication and role-based access (tenants and property managers)
- Application submission and management
- Lease agreement handling
- Payment tracking and processing
- Dashboard interfaces for both tenants and property managers

Exclusions:
- Direct financial transaction processing (payment gateways are assumed to be integrated separately)
- Property verification services
- Legal document generation for different jurisdictions

### Technologies and Tools
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL with PostGIS extension for location data
- **ORM**: Prisma
- **Authentication**: AWS Cognito
- **File Storage**: AWS S3
- **Map Integration**: Mapbox
- **UI Components**: Radix UI, Lucide React icons
- **Form Handling**: React Hook Form with Zod validation

## 2. Objectives

### Project Goals
The primary objectives of RentScape are:
1. Simplify property discovery with advanced search and filtering capabilities
2. Streamline the rental application process for tenants
3. Provide property managers with tools to efficiently manage listings and applications
4. Create a transparent lease management system for tracking agreements and payments
5. Implement secure user authentication with role-based access control
6. Offer an intuitive user interface with responsive design for cross-device compatibility
7. Integrate mapping functionality for location-based property discovery

### Target Audience
- **Primary Users**:
  - **Property Managers and Landlords**: Individuals or companies that own or manage rental properties and need a platform to list, manage, and track tenants and payments.
  - **Tenants**: Individuals looking for rental properties, who need to search, apply for, and manage their rental agreements and payments.

- **Secondary Users**:
  - **Property Management Companies**: Organizations managing multiple properties for various owners.
  - **Real Estate Agencies**: Companies that offer rental property management services.

## 3. Requirements

### Functional Requirements

#### User Authentication and Profiles
- User registration and authentication via AWS Cognito
- Role-based access control (tenant or property manager)
- User profile management

#### Property Management (Property Managers)
- Create, edit, and remove property listings with details, amenities, and photos
- Process and respond to tenant applications
- Manage lease agreements and track payments
- View tenant information and communication history

#### Property Search and Application (Tenants)
- Search properties with advanced filtering options (price, location, amenities, etc.)
- Interactive map-based property discovery
- Save favorite properties
- Submit rental applications
- View application status and history

#### Lease and Payment Management
- Generate and store lease agreements
- Track payment history and upcoming payments
- View payment status (paid, pending, overdue)
- Download payment receipts

#### Dashboard and Notifications
- Personalized dashboards for different user roles
- Notification system for application updates, payment reminders, etc.

### Non-Functional Requirements

#### Performance
- Page load times under 2 seconds for main application pages
- Search query response time under 1.5 seconds
- Support for concurrent users without performance degradation

#### Security
- Secure user authentication via AWS Cognito
- Data encryption for sensitive information
- Role-based access control to protect user data
- Secure API endpoints with proper authorization

#### Scalability
- Architecture designed to handle growing user base and property listings
- Database optimized for performance with increasing data volume

#### Usability
- Intuitive, responsive UI that works across desktop and mobile devices
- Clear navigation and user flows
- Consistent design language throughout the application
- Helpful error messages and user guidance

#### Reliability
- System availability of 99.9% uptime
- Regular database backups
- Error logging and monitoring

## 4. Implementation Techniques

### System Architecture
RentScape follows a modern client-server architecture with a clear separation of concerns:

1. **Client-Side (Frontend)**:
   - Next.js framework with App Router for server-side rendering and routing
   - React components for UI building blocks
   - Redux Toolkit for state management
   - RTK Query for data fetching and caching

2. **Server-Side (Backend)**:
   - Express.js REST API with modular routes
   - Controller-Service-Repository pattern for separation of concerns
   - Middleware for authentication, validation, and error handling

3. **Database Layer**:
   - PostgreSQL with PostGIS extension for spatial data
   - Prisma ORM for database operations and schema management

4. **External Services**:
   - AWS Cognito for authentication
   - AWS S3 for file storage
   - Mapbox for interactive maps

### Development Methodology
The project follows an Agile development methodology with:
- Feature-driven development approach
- Iterative implementation and regular reviews
- Continuous integration practices for reliable deployment
- Test-driven development for critical components

### Coding Standards
- TypeScript for type safety across the entire application
- ESLint for code quality and consistency
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Component-based architecture with reusable UI elements
- Separation of concerns with clear module boundaries
- Well-documented code with JSDoc comments for key functions

## 5. Technologies Used

### Programming Languages
- **TypeScript**: Used for both frontend and backend development, providing type safety and improved developer experience
- **JavaScript**: Base language for React and Node.js

### Frameworks and Libraries
#### Frontend
- **Next.js**: React framework for server-side rendering, routing, and API routes
- **React**: Library for building user interfaces
- **Redux Toolkit**: State management solution with simplified Redux setup
- **RTK Query**: Data fetching and caching extension for Redux Toolkit
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form handling with validation
- **Zod**: TypeScript-first schema validation
- **Radix UI**: Unstyled, accessible UI components
- **Mapbox GL**: Interactive mapping
- **Framer Motion**: Animation library

#### Backend
- **Express.js**: Web framework for Node.js
- **Node.js**: JavaScript runtime for server-side development
- **Multer**: Middleware for handling file uploads
- **Helmet**: Security middleware for Express
- **JWT**: JSON Web Tokens for authentication
- **Morgan**: HTTP request logger

### Database Technologies
- **PostgreSQL**: Primary relational database
- **PostGIS**: Spatial database extension for PostgreSQL
- **Prisma**: Next-generation ORM for database access and migrations

### Additional Technologies
- **AWS Cognito**: User authentication and authorization
- **AWS S3**: Cloud storage for property images
- **ESLint**: Static code analysis and style enforcement

## 7. Database Design

### Database Schema
The database schema is implemented using Prisma and includes the following main models:

#### Property
- Core entity for rental listings with details like price, amenities, and photos
- Relations to Location, Manager, and multiple tenants
```
model Property {
  id                Int          @id @default(autoincrement())
  name              String
  description       String
  pricePerMonth     Float
  securityDeposit   Float
  applicationFee    Float
  photoUrls         String[]
  amenities         Amenity[]
  highlights        Highlight[]
  isPetsAllowed     Boolean      @default(false)
  isParkingIncluded Boolean      @default(false)
  beds              Int
  baths             Float
  squareFeet        Int
  propertyType      PropertyType
  postedDate        DateTime     @default(now())
  averageRating     Float?       @default(0)
  numberOfReviews   Int?         @default(0)
  locationId        Int
  managerCognitoId  String

  location     Location      @relation(fields: [locationId], references: [id])
  manager      Manager       @relation(fields: [managerCognitoId], references: [cognitoId])
  leases       Lease[]
  applications Application[]
  favoritedBy  Tenant[]      @relation("TenantFavorites")
  tenants      Tenant[]      @relation("TenantProperties")
}
```

#### Manager
- Represents property owners/managers who list properties
```
model Manager {
  id          Int    @id @default(autoincrement())
  cognitoId   String @unique
  name        String
  email       String
  phoneNumber String

  managedProperties Property[]
}
```

#### Tenant
- Represents users looking for rental properties
```
model Tenant {
  id          Int    @id @default(autoincrement())
  cognitoId   String @unique
  name        String
  email       String
  phoneNumber String

  properties   Property[]    @relation("TenantProperties")
  favorites    Property[]    @relation("TenantFavorites")
  applications Application[]
  leases       Lease[]
}
```

#### Location
- Geographical information for properties, including coordinates for map display
```
model Location {
  id          Int                                   @id @default(autoincrement())
  address     String
  city        String
  state       String
  country     String
  postalCode  String
  coordinates Unsupported("geography(Point, 4326)")

  properties Property[]
}
```

#### Application
- Represents tenant applications for properties
```
model Application {
  id              Int               @id @default(autoincrement())
  applicationDate DateTime
  status          ApplicationStatus
  propertyId      Int
  tenantCognitoId String
  name            String
  email           String
  phoneNumber     String
  message         String?
  leaseId         Int?              @unique

  property Property @relation(fields: [propertyId], references: [id])
  tenant   Tenant   @relation(fields: [tenantCognitoId], references: [cognitoId])
  lease    Lease?   @relation(fields: [leaseId], references: [id])
}
```

#### Lease
- Represents rental agreements between tenants and property managers
```
model Lease {
  id              Int      @id @default(autoincrement())
  startDate       DateTime
  endDate         DateTime
  rent            Float
  deposit         Float
  propertyId      Int
  tenantCognitoId String

  property    Property     @relation(fields: [propertyId], references: [id])
  tenant      Tenant       @relation(fields: [tenantCognitoId], references: [cognitoId])
  application Application?
  payments    Payment[]
}
```

#### Payment
- Tracks rent payments for leases
```
model Payment {
  id            Int           @id @default(autoincrement())
  amountDue     Float
  amountPaid    Float
  dueDate       DateTime
  paymentDate   DateTime
  paymentStatus PaymentStatus
  leaseId       Int

  lease Lease @relation(fields: [leaseId], references: [id])
}
```

### Data Flow
1. **Property Listing Flow**:
   - Manager creates property with details, images, and location
   - Property data is stored in Property model with relations to Location and Manager
   - Photos are uploaded to S3, with URLs stored in the database

2. **Property Search Flow**:
   - User searches with filters (price, location, amenities)
   - Backend queries the database with filter parameters
   - Results are returned to the frontend with pagination

3. **Application Process Flow**:
   - Tenant submits application for a property
   - Application is stored in the database with "Pending" status
   - Manager reviews and updates application status
   - If approved, a lease can be created and linked to the application

4. **Payment Tracking Flow**:
   - System generates payment records based on lease terms
   - Tenant makes payments that update payment status
   - Historical payment data is maintained for reporting

## 8. Deployment and Maintenance

### Deployment Process
RentScape is deployed using a cloud-based infrastructure:

1. **Frontend Deployment**:
   - Next.js application deployed to Vercel or similar platform
   - Environment-specific configuration via environment variables
   - Static assets served via CDN for performance

2. **Backend Deployment**:
   - Node.js/Express API deployed as containers on a cloud provider
   - Load balancing for scalability and reliability
   - API gateway for request routing and security

3. **Database Deployment**:
   - PostgreSQL with PostGIS hosted on a managed database service
   - Regular backups and point-in-time recovery capability
   - Read replicas for scaling read operations

## 10. Security Considerations

### Authentication and Authorization
- **User Authentication**: Implemented using AWS Cognito for secure identity management
- **Role-Based Access Control**: Different permissions for tenants and property managers
- **JWT Token Authentication**: Secure, expiring tokens for API access
- **Password Policies**: Strong password requirements with regular rotation

### Data Protection
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **HTTPS**: All communications secured with TLS encryption
- **Input Validation**: Strict validation of all user inputs to prevent injection attacks
- **File Upload Security**: Validation of file types and scanning for malicious content
- **Personal Data Handling**: Compliance with data protection regulations

### Vulnerabilities and Mitigation
- **Regular Security Audits**: Scheduled scans for vulnerabilities
- **Dependency Management**: Regular updates to dependencies to address known vulnerabilities
- **Rate Limiting**: Protection against brute force and DDoS attacks
- **Cross-Site Scripting (XSS) Protection**: Content Security Policy implementation
- **Cross-Site Request Forgery (CSRF) Protection**: Anti-CSRF tokens for state-changing operations
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM

## 11. Conclusion

RentScape is a comprehensive property rental platform that addresses the needs of both property managers and tenants. By digitizing the entire rental process from property discovery to payment management, it provides significant value to all stakeholders.

The application leverages modern web technologies and cloud services to deliver a secure, scalable, and user-friendly experience. With its modular architecture and robust testing strategy, the platform is well-positioned for future enhancements and scaling.

Key strengths of the platform include:
- Intuitive property search with map integration
- Streamlined application and lease management
- Secure authentication and authorization
- Comprehensive payment tracking
- Responsive design for cross-device compatibility

Future development directions may include:
- Additional payment gateway integrations
- AI-powered property recommendations
- Virtual property tours
