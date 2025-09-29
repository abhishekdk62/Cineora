🎬 Cineora Movie Ticketing Application (with Invites)
A full-stack, real-time movie ticket booking platform that introduces a unique group invite system for people who want to enjoy movies together—even with strangers.

This project reimagines the movie experience by combining booking, payments, real-time features, and social interactivity into one platform.

🚀 Introduction
Going to the movies alone can feel incomplete. Cineora solves this problem with an Invite System, where users can create open invites for screenings. These invites are visible to other users, who can join by paying their share and interact via live chat—making strangers into companions for a shared movie experience.

Key highlights:

Real-time seat locking to prevent double bookings.

Fraud-proof QR code scanning for theater entry.

Map-based theater search for convenience.

Secure payments & wallets handled via Razorpay.

Admin controls for theater approvals, movies, users, and analytics.

🛠️ Features
🎟️ Real-time Ticketing & Seat Locking – Instantly syncs bookings across all users with Socket.IO.

👥 Group Invites System – Post an invite, let others join by paying their share, and chat together in real time.

🔐 Secure Authentication – JWT access & refresh tokens with Redis-based blacklisting.

📍 Location-based Search – Find nearby theaters via integrated maps.

💳 Seamless Payments – Razorpay integration with wallet support for transactions and payouts.

📊 Admin Dashboard – Manage movies, theaters, users, analytics, coupons, and payouts.

📱 Responsive Frontend – Smooth and interactive UI with Next.js and Redux Toolkit.

🏗️ Architecture & Tech Stack
Frontend (Next.js + TypeScript)

Typed React components with Redux Toolkit for state management

Axios interceptors for secure API communication with token refresh

Responsive design for mobile and desktop

Backend (Node.js + Express + TypeScript)

Controller layer: API endpoints with strict typings

Service layer: Business logic (invites, payments, seat locking, wallet)

Repository layer: MongoDB via Mongoose with typed interfaces

Authentication: JWT with refresh tokens, Redis for blacklisting

Real-time: Socket.IO for chat, invites, and seat locking

Database & Storage

MongoDB for theaters, screens, bookings, payments, and refreshment menus

Efficient handling of nested JSON data for showtimes and seating layouts

Payments

Razorpay for transactions

Wallet for balances, refunds, and payouts

Deployment

AWS EC2 with Nginx reverse proxy for scalable deployment

CI/CD ready structure

⚡ Real-time Features (Socket.IO)
Invites: Create, join, and cancel invites in real-time.

Seat Locking: Prevents conflicts by instantly updating seat status across all users.

Chat: Group members can interact before and during the movie journey.

🔐 Authentication Flow
JWT (Access + Refresh tokens)

Refresh tokens securely managed with Redis

Blacklisting system for preventing token reuse

Frontend token refresh handled via typed Axios interceptors

🌐 Tech Stack Overview
Frontend: Next.js, React, Redux Toolkit, TypeScript

Backend: Node.js, Express.js, MongoDB, Redis, TypeScript

Payments: Razorpay + Wallet System

Deployment: AWS EC2, Nginx

Real-time: Socket.IO

