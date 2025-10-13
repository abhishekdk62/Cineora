
# 🎬 Movie Ticketing App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Redis](https://img.shields.io/badge/Redis-7.0+-red?style=for-the-badge&logo=redis)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0+-white?style=for-the-badge&logo=socket.io)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.0+-lightgrey?style=for-the-badge&logo=express)

**A production-ready, full-stack movie ticket booking platform with real-time seat selection, multi-tenant architecture, and advanced security features**

[Live Demo](#) | [Documentation](#) | [Report Bug](#) | [Request Feature](#)

</div>

---

## ✨ Features

### 🎨 Frontend Excellence
- **Next.js Server-Side Rendering (SSR)** - Lightning-fast page loads with optimal SEO
- **Responsive Theater Layouts** - CSS Grid-based multi-screen seat layouts that adapt to any device
- **Real-Time Seat Selection** - Socket.IO client integration for instant seat blocking and updates
- **Google OAuth Integration** - Secure authentication with Google sign-in
- **Intuitive User Interface** - Clean, modern design with smooth animations and transitions

### 🏗️ Backend Architecture
- **Multi-Tenant System** - Support for multiple theater owners, theaters, and screens
- **Complex Seat Management** - Dynamic seat allocation with concurrent booking prevention
- **Role-Based Access Control (RBAC)** - Four-tier access system (Users, Admins, Staff, Owners)
- **Dynamic Pricing Engine** - Flexible pricing based on seat categories, showtimes, and demand
- **Multi-Level Showtimes** - Hierarchical show management across theaters and screens

### 🔐 Security & Authentication
- **Redis Token Blacklisting** - Secure logout and session invalidation
- **JWT Authentication** - Stateless authentication with secure token management
- **QR Code Verification** - Staff ticket scanning system for entry validation
- **Environment-Based Secrets** - Secure handling of API keys and sensitive data

### 🚀 Advanced Features
- **📍 Location-Based Search** - Find nearby theaters using geolocation
- **💬 Real-Time Chat** - Socket.IO-powered messaging for group discussions
- **👥 Group Invitations** - Invite friends to join your movie plans
- **🔔 Notification System** - Real-time alerts for bookings, invitations, and updates
- **⚡ Redis Caching** - High-performance token caching and session management
- **🎟️ QR Code Generation** - Automatic ticket QR codes for seamless entry

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript 5.0+
- **Styling:** CSS Grid, CSS Modules
- **Real-Time:** Socket.IO Client
- **Authentication:** NextAuth.js with Google Provider

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js 4.0+
- **Language:** TypeScript
- **Database:** MongoDB (MERN Stack)
- **Cache/Session:** Redis 7.0+
- **Real-Time:** Socket.IO Server

### DevOps & Tools
- **Deployment:** AWS EC2, Vercel
- **Process Manager:** PM2
- **Web Server:** Nginx
- **Version Control:** Git & GitHub

---

## 📦 Installation

### Prerequisites
