# NebulaOS 🌌

Welcome to **NebulaOS**, a fully functional browser-based operating system designed with beautiful Glassmorphism, dynamic animations, and real-time multiplayer features.

## 🏗️ Architecture Overview

NebulaOS is split into two primary environments: a sleek, high-performance **Frontend** and a robust, stateful **Backend**.

### Frontend (`/vite-project`)
The frontend serves as the OS Shell. It is responsible for rendering the desktop, taskbar, windows, and built-in applications (File Explorer, Code Editor, Terminal, Web Browser, and Settings).
- **Framework**: React 18 built with Vite.
- **Styling**: Tailwind CSS for rapid utility-based styling.
- **Animations**: Framer Motion for buttery-smooth window drags, snaps, and UI micro-interactions.
- **Real-Time**: Socket.IO client for rendering live multiplayer cursors of other users online.
- **API Routing**: Configured dynamically. During local development (`npm run dev`), it connects to `http://localhost:5000`. In production (`npm run build`), it automatically scales up to the live Render backend URL.

### Backend (`/BE`)
The backend is the "kernel" of NebulaOS. It handles user authentication, persistent file-system operations, and real-time multiplayer broadcasts.
- **Server**: Node.js with Express.
- **Database**: MongoDB (using Mongoose) for storing User Profiles, Preferences, and the virtual File System tree.
- **Real-Time Engine**: Socket.IO for broadcasting cursor movements and active sessions.
- **Storage**: Multer + Cloudinary integration for safely handling user wallpaper uploads.
- **Code Execution**: Integrated with the OneCompiler API to securely compile and run user scripts from the Code Editor.

---

## 🚀 Local Setup Guide

To run NebulaOS locally, you will need to start both the backend server and the frontend development server.

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd BE
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `BE` directory and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a **second** terminal and navigate to the frontend directory:
   ```bash
   cd vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 🎨 Core Features
- **Authentic OS Feel**: Draggable, minimizable, and scalable windows with native-feeling Z-index management.
- **Virtual File System**: Create folders, text files, and code snippets natively stored in your MongoDB cluster.
- **Live Code Execution**: Write Python, C++, Node.js, and Java right in your browser, and instantly stream the output to the Nebula Terminal.
- **Multiplayer Mode**: See exactly where other registered users are hovering their cursors in real-time.
- **Deep Personalization**: Granular settings app allowing configuration of glassmorphism effects, background dimming, custom wallpapers, taskbar auto-hiding, 12/24h time, and UI element sizing.