# YouPick

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

YouPick is a web application designed to help groups of friends easily plan hangouts. The platform suggests the best times when everyone is available and allows group members to swipe on proposed events, indicating their preferences. This collaborative approach makes it simple for indecisive groups to reach a decision together.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Components](#project-components)

## 🎯 Overview

YouPick is a full-stack web application that simplifies group hangout planning through:
- **AI-Powered Activity Suggestions**: Uses Google Gemini AI to suggest activities based on user preferences and location
- **Time Slot Selection**: Organizers can propose multiple date/time options, and participants can select their availability
- **Swipe-Based Voting**: Tinder-like interface for participants to swipe on activities they prefer
- **Group Collaboration**: Real-time updates as participants join, vote, and finalize hangout details
- **Email Notifications**: Automated email invitations sent to participants via EmailJS
- **Calendar Integration**: View and manage hangouts in a calendar interface

## ✨ Features

- 🔐 **Authentication**: Secure user authentication via Auth0
- 🤖 **AI Activity Suggestions**: Intelligent activity recommendations using Google Gemini
- 📅 **Time Management**: Multiple date/time slot selection and availability tracking
- 👆 **Swipe Interface**: Interactive card-based voting system for activities
- 📧 **Email Integration**: Send hangout invitations via EmailJS
- 📊 **Hangout Management**: View all hangouts, pending and finalized
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS and Radix UI components
- 🔄 **Real-time Updates**: Dynamic updates as participants join and vote

## 📁 Project Structure

```
YouPick/
├── frontend/              # React + TypeScript frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components (buttons, cards, etc.)
│   │   │   ├── HangoutCard.tsx
│   │   │   ├── LocationSelect.tsx
│   │   │   ├── navbar1.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/        # Application pages/routes
│   │   │   ├── Auth/     # Login and Signup pages
│   │   │   ├── Calendar/ # Calendar view for hangouts
│   │   │   ├── CreateHangout/ # Create and finalize hangout flows
│   │   │   ├── Hangouts/ # View all user hangouts
│   │   │   ├── Home/     # Landing and home pages
│   │   │   ├── JoinHangout/ # Join hangout by code
│   │   │   ├── Profile/  # User profile page
│   │   │   └── Swiping/  # Activity swiping interface
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
│   ├── public/           # Static assets (images for activities)
│   └── package.json
│
├── backend/              # Node.js + Express backend API
│   ├── index.ts         # Main server file with all API routes
│   ├── mongodb.ts       # MongoDB connection utilities
│   └── package.json
│
├── ai-service/          # Python FastAPI service for AI features
│   ├── app.py           # FastAPI application with AI endpoints
│   ├── requirements.txt # Python dependencies
│   └── Procfile         # Deployment configuration
│
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Auth0** - Authentication service
- **Axios** - HTTP client
- **EmailJS** - Email service integration
- **Supabase** - Storage for activity images

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Axios** - HTTP client for AI service communication
- **Nodemailer** - Email functionality

### AI Service
- **Python** - Programming language
- **FastAPI** - Web framework
- **Google Gemini** - AI model for activity suggestions
- **Supabase** - Image storage and retrieval
- **Uvicorn** - ASGI server

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Python** (v3.8 or higher) and pip
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** - For cloning the repository

### Required Services & API Keys

You'll need accounts and API keys for:
1. **Auth0** - For user authentication
2. **MongoDB Atlas** - For database (or local MongoDB)
3. **Google Gemini API** - For AI activity suggestions
4. **Supabase** - For activity image storage
5. **EmailJS** - For sending email invitations

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd YouPick
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the root directory (same level as `backend/` folder):

```env
MONGODB_URI=your_mongodb_connection_string_here
BACKEND_PORT=3000
AI_SERVICE=http://localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_AUTH0_DOMAIN=your_auth0_domain_here
VITE_AUTH0_CLIENT_ID=your_auth0_client_id_here
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_EMAILJS_KEY=your_emailjs_public_key_here
```

### 4. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
```

Create a `.env` file in the `ai-service/` directory:

```env
GEMINI_API=your_gemini_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_service_role_key_here
PORT=8000
```

## 🔐 Environment Variables

### Root `.env` (Backend Configuration)
- `MONGODB_URI` - MongoDB connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/`)
- `BACKEND_PORT` - Port for the backend server (default: `3000`)
- `AI_SERVICE` - URL of the AI service (default: `http://localhost:8000`)

### Frontend `.env`
- `VITE_AUTH0_DOMAIN` - Your Auth0 domain (e.g., `your-app.auth0.com`)
- `VITE_AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `VITE_BACKEND_URL` - Backend API URL (default: `http://localhost:3000`)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `VITE_EMAILJS_KEY` - Your EmailJS public key

### AI Service `.env`
- `GEMINI_API` - Google Gemini API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase service role key (for storage access)
- `PORT` - Port for the AI service (default: `8000`)

## ▶️ Running the Application

### Development Mode

You need to run all three services simultaneously:

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3000`

#### Terminal 2 - AI Service
```bash
cd ai-service
python -m uvicorn app:app --reload --port 8000
```
AI service will run on `http://localhost:8000`

#### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173` (or the port Vite assigns)

### Production Build

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📄 Project Components

### Frontend Pages

- **Landing Page** (`/`) - Welcome page for unauthenticated users
- **Login/Signup** (`/login`, `/signup`) - Authentication pages
- **Home** (`/home`) - Dashboard for authenticated users
- **Create Hangout** (`/createhangout`) - Form to create a new hangout with activity suggestions
- **Finalize** (`/finalize`) - Review and finalize hangout details before sending invitations
- **Join Hangout** (`/join-hangout`) - Join a hangout using a code
- **Choose Times** (`/choose-times`) - Select available time slots for a hangout
- **Swiping** (`/swiping`) - Swipe interface to vote on activities
- **My Hangouts** (`/user-hangouts`) - View all user's hangouts (pending and finalized)
- **Calendar** (`/calendar`) - Calendar view of all hangouts
- **Profile** (`/profile`) - User profile management

### Backend API Endpoints

#### User Management
- `POST /api/create-user` - Create a new user document
- `GET /api/get-user/:auth0Id` - Get user by Auth0 ID
- `PUT /api/update-user` - Update user profile

#### Hangout Management
- `POST /api/create-hangout` - Create a new hangout
- `GET /api/get-hangout/:generatedCode` - Get hangout by code
- `PUT /api/update-hangout` - Update hangout details
- `GET /api/user/hangouts/:email` - Get all hangouts for a user
- `GET /api/get-timeslots/:generatedCode` - Get available time slots

#### AI Services
- `GET /api/ai/get-activities` - Get AI-suggested activities
- `GET /api/ai/get-images` - Get images for activities

### AI Service Endpoints

- `GET /get-activities` - Generate activity suggestions based on user prompt and location
- `GET /get-images` - Match activities with appropriate images from Supabase storage
- `GET /health` - Health check endpoint

## 🎨 Key Features Explained

### Activity Suggestions
Users can describe what kind of activities they want (e.g., "outdoor activities near the beach"), and the AI service uses Google Gemini to suggest relevant activities with specific locations.

### Time Slot Selection
Organizers can propose up to 3 different date/time combinations. Participants can then select which times work for them, helping find the best time when everyone is available.

### Swipe Voting
Participants swipe right on activities they like and left on ones they don't. The system tracks votes and can finalize the most popular activity.

### Hangout Codes
Each hangout gets a unique code that participants can use to join. This code is displayed as a QR code for easy sharing.

## 📝 Notes

- The backend expects the `.env` file to be in the root directory (one level up from `backend/`)
- The frontend uses Vite, so all environment variables must be prefixed with `VITE_`
- The AI service may have cold start delays when deployed (handled with extended timeouts)
- Activity images are stored in Supabase storage and matched to activities by the AI service

## 🤝 Contributing

This is a project for helping groups plan hangouts together. Feel free to submit issues or pull requests!

