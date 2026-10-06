# FitAdapt // Hyper-Personalized AI Fitness Architecture

> **Hackathon Theme:** Personalized AI Experiences  
> **Aesthetic:** Cyberpunk Fitness (Dark mode, Neon Green/Cyan Accents, Glassmorphism, Mobile-First)

---

## ⚡ Tech Stack

- **Frontend:** React.js, Vite, React Router (`react-router-dom`), Tailwind CSS, Axios, Socket.io-client, Lucide React.
- **Backend:** Node.js, Express.js, MongoDB (`mongoose`), JSON Web Token (`jsonwebtoken`), `bcryptjs`, `zod`, Socket.io, `cors`, `dotenv`.
- **AI Core:** Google Gemini API (`@google/generative-ai`), strictly configured on the backend.
- **Security Rule:** `GEMINI_API_KEY` is loaded exclusively from backend `.env` and never exposed to the frontend client.

---

## 📁 Foundational Directory Structure

```text
fitadapt/
├── package.json                   # Root orchestrator scripts
├── README.md                      # Architecture documentation & setup guide
├── backend/                       # Node.js + Express + Socket.io + Mongoose
│   ├── .env                       # Backend secrets (GEMINI_API_KEY, JWT_SECRET, MONGODB_URI)
│   ├── .env.example               # Example template
│   ├── package.json               # Backend dependencies & scripts
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB Mongoose connection handler
│       ├── models/
│       │   └── User.js            # User Schema (height, weight, age, goals, equipment)
│       ├── validators/
│       │   ├── authValidator.js   # Zod validation schemas for register/login
│       │   └── workoutValidator.js# Zod schema for AI workout generation payload
│       ├── middlewares/
│       │   ├── authMiddleware.js  # JWT Bearer token protection middleware
│       │   └── validateMiddleware.js # Zod validation handler
│       ├── services/
│       │   └── geminiService.js   # Gemini API engine with strict JSON schema
│       ├── controllers/
│       │   ├── authController.js  # Register, login, profile endpoints
│       │   └── workoutController.js # AI adaptive workout generation endpoint
│       ├── sockets/
│       │   └── healthSimulator.js # Socket.io 4s live smartwatch telemetry simulator
│       ├── routes/
│       │   ├── authRoutes.js      # /api/auth/register, /login, /me, /profile
│       │   └── workoutRoutes.js   # /api/workout/generate
│       └── server.js              # HTTP & Socket.io server entry point
└── frontend/                      # React.js + Vite + Tailwind CSS
    ├── index.html                 # HTML5 template with cyberpunk typography
    ├── vite.config.js             # Vite configuration with proxy
    ├── tailwind.config.js         # Cyberpunk theme colors & glassmorphism shadows
    ├── postcss.config.js          # PostCSS setup
    ├── package.json               # Frontend dependencies & scripts
    └── src/
        ├── index.css              # Cyberpunk styles, custom scrollbars & neon glows
        ├── main.jsx               # React DOM entry
        ├── App.jsx                # Router, AuthProvider, SocketProvider
        ├── api/
        │   └── axiosClient.js     # Axios client with JWT interceptor & API methods
        ├── context/
        │   ├── AuthContext.jsx    # Auth state management (JWT token & profile)
        │   └── SocketContext.jsx  # Socket.io connection & telemetry subscription
        ├── components/
        │   ├── Navbar.jsx         # Sticky cyberpunk header with live status
        │   ├── LiveHealthWidget.jsx # Smartwatch telemetry sync widget (HR, steps, kcal)
        │   ├── OnboardingModal.jsx # Multi-step biometric registration & edit modal
        │   ├── WorkoutCard.jsx    # Interactive AI workout protocol with rest timers
        │   ├── NutritionCard.jsx  # AI post-workout macros & recovery meal synthesizer
        │   └── ProtectedRoute.jsx # Route authentication guard
        └── pages/
            ├── Login.jsx          # Cyberpunk sign-in / registration page
            └── Dashboard.jsx      # Mobile-first interactive control room
```

---

## 🚀 Quick Setup & Execution

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongodb://localhost:27017/fitadapt`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) URI.
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitadapt
JWT_SECRET=cyberpunk_fitadapt_secret_jwt_key_2026_hackathon
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
Run backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# App will launch on http://localhost:5173
```

---

## 📡 Real-Time WebSocket Telemetry
- Connected to backend Socket.io server.
- Emits `live_health_metrics` event every **4 seconds**:
  - `heartRate`: Fluctuates realistically between 70–120 BPM.
  - `steps`: Dynamically increases throughout the session.
  - `activeCalories`: Dynamically accumulates based on step workload.
  - `spo2`: Real-time blood oxygen saturation.
  - `stressScore`: Biofeedback stress gauge.
- Includes a **"SPIKE HR"** button on the widget to simulate physical exertion during live demonstrations.

---

## 🤖 AI Core Endpoint (`POST /api/workout/generate`)
- **Protected:** Requires `Authorization: Bearer <token>`.
- **Payload:** Accepts user profile data + current `liveMetrics` from the WebSocket state.
- **AI Processing:** Google Gemini processes the user's real-time physical load and synthesizes:
  1. **Adaptation Diagnosis:** How current heart rate and step load influenced the routine.
  2. **Phase 1 Activation:** Dynamic warmup tailored to available gear.
  3. **Phase 2 Working Sets:** Interactive exercise matrix with sets, reps, tempos, and rest timers.
  4. **Phase 3 Cooldown:** Parasympathetic recovery and mobility stretches.
  5. **Nutrition Protocol:** Precise macro split (Protein, Carbs, Fats), recovery meal recipe, and hydration requirement.
