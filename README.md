# 🌿 Greenify — AI-Powered Plant Disease Detection & Care Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

Greenify is a state-of-the-art, AI-powered web application designed to help farmers, gardeners, and plant enthusiasts identify, diagnose, and treat plant diseases in real time. Leveraging Next.js 15, a local FastAPI inference backend powered by PyTorch/Transformers, and Supabase Database & Auth, Greenify provides immediate crop leaf classification, organic/chemical treatment guides, scan analytics, and a comprehensive administration dashboard.

---

## ✨ Features

- **🔍 Two-Stage AI Inference Pipeline**
  - **Stage 1 (Leaf Validation)**: Lightweight MobileNetV2 classifier validates if the uploaded image contains a plant leaf, rejecting non-plant images (e.g. human faces, animals).
  - **Stage 2 (Disease Classification)**: Pretrained Hugging Face MobileNetV2 plant disease classifier categorizes crop foliage into 26 disease classes across 14 agricultural plant species.
  - Supports instant JPG, PNG, JPEG, and WebP uploads.

- **📊 Personal Plant Health Dashboard**
  - Track individual plant health metrics, disease histories, and scan confidence averages.
  - Interactive scans list with detailed dynamic report pages (`/dashboard/scans/[id]`) showing inline caret information (Symptoms, Causes, Treatment, and Prevention) fetched from a shared database.
  - Easy deletion of scan records.

- **🛡️ Complete Admin Panel (`/admin`)**
  - Access control: Restricts access to authenticated administrators (based on role database column and email whitelist rules). Redirects unauthorized queries to a 403 page.
  - Real-time statistics: Total registered users, total scans completed, diseased vs. healthy ratios, average model confidence, and database storage utilization.
  - User Directory: Search and filter profiles, inspect scan history lists per user, and delete user profiles with cascading diagnosis removal.

- **⚙️ Settings Page Integration**
  - Interactive profile picture container supporting avatar image uploads directly to Supabase storage.
  - Shortened unique User ID formatting to protect account metadata.

- **🔐 Supabase Google OAuth Authentication**
  - Unified **"Get Started"** button in the Navbar that triggers Google OAuth immediately.
  - Session guards (`AuthGuard`) protecting the Dashboard, Settings, and Admin Panel routes.

- **🌓 Premium UI & Dark Mode**
  - Custom dark and light themes using Outfit/Inter typography, smooth gradients, and glassmorphic micro-animations.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5 (App Router, Client & Server Components)
- **Backend API**: FastAPI (Python 3.10+ web framework)
- **Machine Learning**: PyTorch, Hugging Face `transformers` (MobileNetV2 models)
- **Authentication**: Supabase Auth (Google OAuth Provider)
- **Database & Storage**: Supabase Postgres & Storage buckets (`plant-images`)
- **Styling**: Tailwind CSS & CSS Variables
- **UI Components**: Shadcn UI (Lucide Icons, Sonner toast, Radix primitives)

---

## 📂 Project Structure

```text
greenify-web-application/
├── frontend/                   # Next.js 15 Client-Side Web App
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Administration panel (access-restricted)
│   │   ├── auth/               # OAuth callbacks and login redirects
│   │   ├── dashboard/          # User diagnosis statistics & scans detail views
│   │   ├── disease-detection/  # Two-stage AI leaf validation and analysis views
│   │   ├── disease-info/       # Crop disease lookup catalog
│   │   └── settings/           # User configuration, avatar image upload handlers
│   ├── components/             # Reusable UI & Navbar/Header links
│   ├── docs/                   # Configuration setups
│   ├── lib/                    # Helpers, admin check utils, shared catalog lookup
│   ├── public/                 # Static logo & hero banner graphics
│   ├── tailwind.config.ts      # Styles configuration
│   └── package.json            # Node project configuration
├── backend/                    # FastAPI AI Inference Server
│   ├── app.py                  # API endpoints, leaf validation validation, prediction routing
│   ├── leaf_classifier.py      # Leaf check MobileNetV2 loader & validator
│   ├── predict.py              # Crop disease MobileNetV2 predictor
│   ├── requirements.txt        # Backend dependencies (PyTorch CPU spec)
│   └── model/                  # Classification models configuration & weights
├── .gitignore                  # Multi-service recursive gitignores
└── README.md                   # Platform documentation
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside the `frontend/` directory:

```env
# Supabase Database Settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anonymous_key

# Local/Remote FastAPI Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 🚀 Getting Started

### 1. Start the FastAPI Backend
Navigate to the `backend/` directory, install requirements, and run the server:
```bash
# Navigate to backend
cd backend

# Install dependencies (CPU-optimized PyTorch specified)
pip install -r requirements.txt

# Run the Uvicorn development server
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

### 2. Start the Next.js Frontend
Navigate to the `frontend/` directory, install packages, and launch Next.js:
```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Run the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production (Frontend)
To compile and test the production-optimized frontend build:
```bash
# Navigate to frontend
cd frontend

# Build the application
npm run build

# Start the production build server
npm start
```

---

## 🔬 Inference & Data Pipeline

1. **Upload**: User uploads leaf image inside `/disease-detection`.
2. **Leaf Shape Check**: Next.js sends image to `POST /predict`. FastAPI backend delegates to `leaf_classifier.py` using `google/mobilenet_v2_1.0_224` to confirm leaf presence. If verification fails, it aborts.
3. **Classification**: If verification passes, it runs `predict.py` using the disease model, extracting predicted class, confidence, severity, and computed disease slug.
4. **Display**: Next.js receives slug, stores scan history into Supabase `diagnoses`, and retrieves detailed care guidance from the shared `diseaseDatabase` inline.
