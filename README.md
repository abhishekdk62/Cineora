Cineora Movie Ticketing Application (with Invites) Project Overview Documentation
Introduction
This app solves one of the common real world problem of not having any companion or friends to go for a movie with by having the invite others to join feature.This full-stack movie ticketing platform provides a secure, interactive, and user-friendly experience for moviegoers, theater owners, and administrators developed using Next js for frontend backend:Express,Node,Redis and MongoDb for database. It features a unique real-time group invitation system via Socket.IO, where users who do not have companions can post open movie invites. Other users within the app see these invites, join by paying their share, and chat together, enabling strangers to enjoy movies as a group instead of going alone.
Real-time seat locking prevents double bookings by instantly syncing seat availability across all users. At entry, staff exclusively scan QR codes on tickets ensuring fraud-proof, secure validation.
Users can search for nearby theaters based on location, aided by an integrated map interface for easy theater selection. The system efficiently handles complex nested JSON data structures for theaters, screens, seating layouts, showtimes, pricing, bookings, and refreshment menus.Also have integrated map and location based searching
Payments are processed securely via Razorpay and managed through user wallets. Admins manage users, theater approvals, movies, payouts, coupons, bookings, and analytics.
Repository Architecture and TypeScript Usage
The application is designed with a modular layered architecture using TypeScript for the entire codebase to enhance maintainability and type safety:
Controller Layer: Typed API endpoints managing client-server communication.
Service Layer: Business logic including invitations, seat locking, payments, and wallet functions implemented with strict typings.
Repository/Data Layer: MongoDB database access abstracted through Mongoose with TypeScript interfaces to ensure data consistency.
Authentication Module: Secure JWT access and refresh token system with Redis-based refresh token blacklisting, preventing unauthorized reuse. Token refreshing is handled on the frontend with typed Axios interceptors.
Socket.IO Layer: Strongly typed real-time events for invitations, seat locking, and chat functionalities.
Frontend (Next.js): Fully typed React components with Redux Toolkit async thunks for state and API management, delivering responsive user interfaces.
Technology Stack
Frontend: Next.js with TypeScript, React, Redux Toolkit
Backend: Node.js, Express.js, MongoDB (MERN stack) with TypeScript
Authentication: JWT access and refresh tokens, Redis for token blacklisting
Payments: Razorpay integration and Wallet support
Deployment: AWS EC2 with Nginx reverse proxy
Real-time features: Socket.IO for invites, seat locking, and chat
Deployment
Hosted on AWS EC2 and managed with Nginx, the application supports scalable, secure, and reliable operations. Integration with third-party payment gateways and mapping services enhances the user experience.


