# TITAN Labs — Unbiased Hardware Truth & Product Intelligence

> **Deterministic 8-Dimension Evaluation Engine & Multi-Retailer Price Intelligence for Smartphones, Laptops, Tablets, and Tech Hardware.**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![Android Studio](https://img.shields.io/badge/Android%20Studio-Jellyfish%20%7C%20Koala-3DDC84?logo=androidstudio)](https://developer.android.com/studio)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0.21-7F52FF?logo=kotlin)](https://kotlinlang.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev)

---

## 🏛️ Repository Architecture (Unified Monorepo)

This repository is structured as a unified monorepo serving both **Web** (Vercel) and **Mobile** (Android Studio):

```
TITAN-LABS/
├── web/                       # 🌐 Consumer Web Application (React 18 + Vite + Tailwind)
│   ├── src/                   # Pages, Components, Engine & Context
│   ├── public/                # High-res Branding & Icons
│   ├── package.json           # Scripts & Dependencies
│   └── vite.config.ts         # Vite Configuration
│
├── android/                   # 📱 Native Android Mobile App (Jetpack Compose + Room)
│   ├── app/                   # Compose UI, DAOs, Room Entities & ViewModel
│   ├── gradle/                # Gradle wrapper & Version Catalog (libs.versions.toml)
│   └── gradlew.bat            # Gradle build tool
│
├── titan_orchestrator/        # 🤖 Autonomous Multi-Agent Swarm Studio & Control Tower
│   ├── scraper/               # Amazon, Flipkart, Croma live scraping pipeline
│   ├── engine.py              # 6-Phase Autonomous cycle runner
│   ├── fleet.py               # 9 Autonomous agent definitions & state machines
│   └── server.py              # REST API & Control Tower Web UI (port 8800)
│
├── data/                      # 📊 Intelligence Database & Feeds
│   ├── titan_intelligence.db  # Persistent SQLite database
│   └── catalog_feed.json      # Normalized JSON catalog feed
│
├── Screens/                   # 🎨 Reference UI Mockups & Screen Designs
├── vercel.json                # 🚀 Root Vercel deployment configuration
└── README.md                  # Project overview & guide
```

---

## 🚀 1. Deploying the Website on Vercel

This repository is pre-configured with root [`vercel.json`](vercel.json) to deploy straight to **Vercel** with zero extra setup:

1. Import this repository [`Muf3e/TITAN-LABS`](https://github.com/Muf3e/TITAN-LABS) in your [Vercel Dashboard](https://vercel.com/new).
2. **Framework Preset**: Vite
3. **Root Directory**: `./` (leave default, or set to `web`)
4. **Build Command**: `cd web && npm install && npm run build`
5. **Output Directory**: `web/dist`
6. Click **Deploy**!

### Local Development (Web)
```bash
cd web
npm install
npm run dev
```

---

## 📱 2. Running the Android App in Android Studio

1. Open **Android Studio**.
2. Select **Open** and select the [`android/`](android/) folder in this repository.
3. Allow Gradle to sync dependencies (`Room 2.6.1`, `KSP 2.0.21-1.0.28`, `Compose BOM 2024.12.01`).
4. Select your connected device or emulator (`Medium_Phone` / `emulator-5554`).
5. Click **Run** (`Shift + F10`).

### Running via Terminal
```bash
cd android
./gradlew testDebugUnitTest    # Run unit tests
./gradlew assembleDebug        # Build debug APK
```

---

## 🤖 3. Autonomous Swarm Studio & Live Scraping

The autonomous multi-agent swarm monitors codebase integrity, scrapes live prices, executes unit tests, and verifies screens on the emulator:

```bash
# Start the Swarm Control Center server (http://localhost:8800)
py -m titan_orchestrator.server

# Trigger an on-demand autonomous cycle
py -m titan_orchestrator.cli run-cycle

# Test the 9-agent fleet
py -m titan_orchestrator.cli test-fleet
```

---

## ⚖️ License & Ownership
Copyright © 2026 TITAN Labs. All rights reserved.
