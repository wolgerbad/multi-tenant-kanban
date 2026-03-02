# Flowboard [![Live Demo](https://img.shields.io/badge/-Live%20Demo-green?style=flat-square)](https://next-react-blogapp.vercel.app) [![Repo](https://img.shields.io/badge/-GitHub-black?style=flat-square&logo=github)](https://github.com/wolgerbad/blog)

Real-time multi-tenant Kanban board application where organizations can manage boards, columns, and cards.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat)
![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![SocketIO](https://img.shields.io/badge/library-socket.io-informational?style=flat&logo=npm&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?logo=tailwindcss&logoColor=06B6D4)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-blue?style=for-the-badge&logo=data:image/png;base64)

---

## 📖 Overview
Flowboard is a SaaS-style multi-tenant Kanban board application where organizations can manage boards, columns, and cards with real-time collaboration. Each tenant (organization/workspace) has isolated data access, secure authentication, and independent board management. I built this project to explore backend architecture, real-time systems and production ready application structure.

---

## ✨ Features
- 🏢 Multi-tenant architecture (workspace-based isolation)
- 🔐 JWT authentication with secure HTTP-only cookies
- 👥 Organization-based access control
- 📋 Boards, columns, and draggable cards
- ⚡ Real-time collaboration with Socket.io
- 🔄 Optimistic UI updates for instant UX
- 📎 File uploads using AWS S3 presigned URLs
- 🧱 Clean architecture (services / repositories / controllers)

---

## 🧠 Technical Implementation
Built with Next.js + React + TypeScript for the frontend and an Express.js backend API with Socket.IO integration.
### Backend Architecture
-Clean separation: Controllers → Services → Repositories
-MySQL database with Drizzle ORM
-JWT authentication using jose
-Password hashing with bcryptjs
-Tenant isolation enforced at query level (organization/workspace-based filtering)
-Real-time communication via Socket.io (board-level rooms)
-Presigned S3 uploads for secure file storage
### Frontend
-React Query for server-state management and caching
-Optimistic updates for drag-and-drop and card actions
-Protected routes with cookie-based authentication
-Modular component structure for scalability

---

## 🧩 Getting Started
1. Clone the repo  
   ```bash
   git clone https://github.com/wolgerbad/multi-tenant-kanban
2. Install dependencies
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
3. Run the application
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend
   cd ../frontend
   npm run dev

---

## 🌍 Live Demo
🔗 [Visit Live Site](https://multi-tenant-kanban.vercel.app/)
