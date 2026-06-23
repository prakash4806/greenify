# 🌿 Greenify — AI-Powered Plant Disease Detection & Care Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Fal AI](https://img.shields.io/badge/AI-Fal_Serverless-orange?style=for-the-badge)](https://fal.ai/)
[![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-green?style=for-the-badge)](https://next-auth.js.org/)

Greenify is a state-of-the-art, AI-powered web application designed to help farmers, gardeners, and plant enthusiasts identify, diagnose, and treat plant diseases in real time. Leveraging Next.js 15, Fal AI's deep learning plant disease detection models, and the expert-curated PlantVillage dataset, Greenify provides immediate and actionable treatment recommendations, preventive tips, and historical health analytics.

---

## ✨ Features

- **🔍 AI-Powered Disease Detection**
  - Instant diagnosis by uploading crop images (supports JPG, PNG, WebP).
  - Automated image compression on the client side for optimized bandwidth and rapid AI inference.
  - Multi-class confidence rating, severity levels (Critical, High, Medium, Low, None), and full list of symptoms & causes.

- **📚 Interactive Plant Disease Encyclopedia**
  - Explore 38 disease classes spanning 14 agricultural crop species (e.g., Apple, Tomato, Potato, Grape, Corn, Orange).
  - Searchable database featuring auto-suggested filters and animated placeholders for a premium search experience.
  - Sourced directly from the benchmark PlantVillage Dataset of over 50,000 expert-validated crop leaf images.

- **📊 Personal Plant Health Dashboard**
  - Track plant health metrics over time.
  - Manage scan history, success rate (Healthy vs. Diseased scans), and average confidence scoring.
  - Quick actions for single/bulk uploads and scheduling agricultural maintenance tasks.

- **🔐 Secure Google OAuth Authentication**
  - Protected dashboard and scan history features.
  - Google Account integration enabled via NextAuth.js middleware guards.

- **🌓 Premium UI & Dark Mode**
  - Beautiful custom design with modern typography (Outfit/Inter).
  - Glassmorphic card layouts, smooth gradients, and micro-animations.
  - Complete dark mode support via `next-themes`.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server Actions)
- **Library**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Fal AI Serverless Client](https://fal.ai/) (using `fal-ai/plant-disease-detection` model)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) (Google OAuth Provider)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & CSS Variables
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives, Lucide Icons, Embla Carousel, Sonner toast, Vaul drawers)

---

## 📂 Project Structure

```text
greenify-web-application/
├── app/                        # Next.js App Router
│   ├── about/                  # About page
│   ├── actions/                # Server Actions (e.g., Fal AI plant analysis)
│   ├── api/                    # API routes (Auth handlers & tests)
│   ├── auth/                   # Authentication sign-in/up views
│   ├── contact/                # Contact page
│   ├── dashboard/              # Protected User Dashboard
│   ├── disease-detection/      # Image upload & AI disease detection workflow
│   ├── disease-info/           # PlantVillage disease search & database
│   ├── globals.css             # Main styling & theme definitions
│   ├── layout.tsx              # Root Layout, Providers (Theme, Session)
│   └── page.tsx                # Landing Homepage
├── components/                 # Shared UI and Layout components
│   ├── ui/                     # Shadcn UI primitives (Buttons, Cards, Badges, etc.)
│   ├── navbar.tsx              # Header & Responsive Navigation
│   ├── footer.tsx              # Base Footer with links
│   └── env-validator.tsx       # Developer helper to check local env status
├── docs/                       # Technical & configuration guides
│   └── environment-setup.md    # Google OAuth client & redirect URI manual
├── hooks/                      # Custom React hooks
├── lib/                        # Helper utilities (image compressors, classes)
├── styles/                     # Supplementary CSS modules & variables
├── tailwind.config.ts          # Tailwind CSS theme configuration
└── package.json                # Project dependencies and script runner
```

---

## ⚙️ Environment Configuration

Greenify requires configuration of both **Google OAuth Credentials** for authentication and a **Fal AI API Key** for plant disease analysis. 

Create a `.env.local` file in your root directory and configure the variables as follows:

```env
# Fal AI Key (For plant disease detection analysis)
FAL_KEY=your_fal_ai_api_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000
```

> [!NOTE]
> For instructions on setting up Google Cloud Console and authorized redirect URIs, refer to the [Environment Setup Guide](file:///c:/Users/Hp/Downloads/greenify-web-application/docs/environment-setup.md).

---

## 🚀 Getting Started

To run Greenify locally, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js (v18 or higher)](https://nodejs.org/) installed.

### 2. Install Dependencies
Clone the repository, navigate to the folder, and install all required Node modules:
```bash
npm install
```

### 3. Run Development Server
Start the local server on [http://localhost:3000](http://localhost:3000):
```bash
npm run dev
```

### 4. Build for Production
To compile and test the production-optimized build:
```bash
# Build the application
npm run build

# Start the production build server
npm start
```

---

## 🔬 AI Analysis Workflow

1. **Client-side Compression**: When an image is uploaded via the **Disease Detection Page**, it is processed by the helper function in `lib/image-utils.ts` to shrink size and limit bandwidth usage.
2. **Serverless Upload**: The client calls the server action `analyzePlantImage` in `app/actions/analyze-plant.ts` containing the base64 string. The image is uploaded securely to Fal AI's CDN storage.
3. **Inference**: The server subscribes to `fal-ai/plant-disease-detection` with the image URL.
4. **Data Normalization**: Predictions are mapped against our localized severity and care databases to generate interactive treatment guides, preventing the display of raw machine-learning output to the end user.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the project.
2. Create a feature branch: `git checkout -b feature/NewFeature`.
3. Commit your changes: `git commit -m 'Add some NewFeature'`.
4. Push to the branch: `git push origin feature/NewFeature`.
5. Open a Pull Request.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Greenify is built to empower growers. If you like this project, please consider giving it a star! ⭐*
