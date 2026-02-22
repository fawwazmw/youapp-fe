# YouApp Frontend

Welcome to the frontend application for **YouApp**, a platform to connect and share your interests. Built entirely on Next.js 16+, React 19, and Tailwind CSS.

## 🚀 Features

- **Next.js App Router**: Optimized routing and layouts for Profile, Login, Register, and Interests.
- **Tailwind CSS + Shadcn UI**: Sleek, customizable UI components and gradients.
- **React Hook Form & Zod**: Reliable, type-safe client-side form validation.
- **Axios Networking**: Centralized API request handling and error interception (`src/services/api.ts`).
- **Dynamic JWT**: Instantly decodes user tokens for optimistic fallback states.
- **WebSockets via Socket.io**: Ready to deploy real-time chat infrastructure.

## 🛠 Prerequisites

Make sure you have installed:
- Node.js (`>= 20.x`)
- npm (`>= 10.x`)

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the `youapp-fe/` directory with the following keys.

```bash
# Connects the frontend to your local or deployed NestJS backend
NEXT_PUBLIC_API_URL=https://api-dev.wardaya.my.id/api
NEXT_PUBLIC_SOCKET_URL=https://api-dev.wardaya.my.id
```

_Note: If developing locally against the NestJS backend, set these to `http://localhost:3000/api`._

## 📦 Installation & Setup

1. **Install dependencies**:
   ```bash
   cd youapp-fe
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧱 Project Structure

```bash
youapp-fe/
├── public/                 # Static assets (images, etc)
├── src/
│   ├── app/                # Next.js App Router pages (/, /login, /register, /profile, /interest)
│   ├── components/         # Reusable UI components (buttons, inputs, forms)
│   ├── services/           # Axios configurations, socket setup, and backend integrations
│   ├── types/              # Global TypeScript interfaces & DTOs
│   └── utils/              # Helper functions (e.g., Astrology calculators)
├── .env.local              # Local environment overrides
├── next.config.ts          # Next.js specific configuration
├── package.json            # NPM scripts & dependencies
└── tailwind.config.ts      # Tailwind styling definitions
```

## 🏗 Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

## 🧹 Linting

We enforce strict linting and type-checking via ESLint and TypeScript:

```bash
npm run lint
```
