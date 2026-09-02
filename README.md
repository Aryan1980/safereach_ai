# SafeReach AI 🛡️ — Women's Safety & Emergency Navigation Platform

> **Your Safety. One Reach Away.**

SafeReach AI is a production-grade, privacy-first women's safety platform built to provide instant real-world safe place discovery, reliable GPS emergency dispatch via WhatsApp, 24/7 verified helplines, and intelligent crisis guidance powered by Google Gemini AI.

---

## 🌟 Key Features

### 1. 📍 Real-World Safe Place Locator
- **Live Geolocation**: Automatically requests and acquires high-accuracy GPS coordinates.
- **Real Infrastructure Queries**: Integrates with the **OpenStreetMap Overpass API** to discover verified:
  - 🚓 **Police Stations & Outposts**
  - 🏥 **24/7 Hospitals & Healthcare Clinics**
  - 💊 **Pharmacies & Medical Stores**
  - 🚒 **Fire & Rescue Stations**
- **Interactive Map**: Custom Leaflet map with dark theme, animated pulsing user beacon, category filters, and interactive popups.
- **Turn-by-Turn Directions**: One-tap deep links to Google Maps navigation for fast transit.
- **Resilient Fallbacks**: If location access is denied or unavailable, provides polite explanations and full manual geocoding search powered by OpenStreetMap Nominatim.

### 2. 🚨 Emergency WhatsApp SOS System
- **1-Tap SOS Dispatch**: Prepares a standardized emergency message with live Google Maps coordinate link:
  `🚨 EMERGENCY! I may need help. My current location is: https://maps.google.com/?q={lat},{lng}. Please check on me immediately.`
- **WhatsApp Deep Linking**: Opens WhatsApp directly on mobile or web with the pre-filled alert ready to send to your trusted contact in one tap.
- **Trusted Contact Management**: Add, validate, and store primary and backup emergency contacts locally in the browser with full Indian (`+91`) and international E.164 phone number validation.
- **Audible Emergency Siren**: Web Audio API dual-oscillator siren synthesizer to deter threats and draw bystander attention.
- **Flashing Strobe Beacon**: High-contrast visual distress strobe.

### 3. 🤖 Gemini AI Safety Assistant
- **Crisis Triage & De-escalation**: Prioritizes dialing **112** (National Emergency) or **181** (Women Helpline) if active danger is detected.
- **Tactical Safety Protocols**: Step-by-step guidance for cab ride checks, being followed on the street, solo travel preparation, and legal rights (such as Zero FIR in India).
- **Secure Backend API**: Server-side Next.js route using official `@google/genai` SDK with zero frontend API key leakage.

### 4. 📞 Direct Verified Helplines (India)
- 🚓 **112**: All-in-One National Emergency Response
- 👩 **181**: Women Helpline (24/7 Toll-Free)
- 🛡️ **1091**: Women in Distress
- 🚑 **108**: Emergency Medical & Ambulance
- 💻 **1930**: Cyber Crime Helpline
- 🚒 **101**: Fire Service

### 5. 🔒 Zero-Knowledge Privacy Architecture
- No location logging or user profiling on backend servers.
- Trusted contacts and emergency logs remain 100% inside your device's browser `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS & PostCSS |
| **Icons** | Lucide React |
| **Mapping Engine** | Leaflet & OpenStreetMap |
| **Geodata APIs** | OpenStreetMap Overpass QL API & Nominatim Geocoding |
| **Artificial Intelligence** | Google Gemini API (`@google/genai` SDK) |
| **Audio** | HTML5 Web Audio API (Dual Oscillator Synth) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ or 20+ (Node 24 LTS recommended)
- npm, yarn, or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-username/safereach-ai.git
cd safereach-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Set your Google Gemini API key inside `.env.local`:
```env
AI_API_KEY=your_gemini_api_key_here
```
*(Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
safereach-ai/
├── app/
│   ├── layout.tsx                # Root layout, theme, metadata & Navbar
│   ├── page.tsx                  # Landing Page ("Your Safety. One Reach Away.")
│   ├── safe-places/
│   │   └── page.tsx              # Safe Place Locator (Leaflet Map + Card List)
│   ├── emergency/
│   │   └── page.tsx              # SOS Command Center & Trusted Contacts
│   ├── assistant/
│   │   └── page.tsx              # Gemini AI Safety Companion
│   ├── safety-tips/
│   │   └── page.tsx              # Categorized tactical safety guides
│   ├── dashboard/
│   │   └── page.tsx              # Unified safety status dashboard
│   ├── about/
│   │   └── page.tsx              # Platform mission, tech & privacy policy
│   └── api/
│       ├── chat/
│       │   └── route.ts          # Server-side Gemini AI route
│       ├── places/
│       │   └── route.ts          # Server Overpass API proxy
│       └── geocode/
│           └── route.ts          # Server Nominatim search proxy
├── components/
│   ├── Navbar.tsx                # Navigation with GPS indicator & Quick SOS
│   ├── Footer.tsx                # Verified helplines & emergency protocols
│   ├── Map/
│   │   ├── SafeMap.tsx           # Dynamic Leaflet map with custom SVG markers
│   │   └── LocationSearch.tsx    # Nominatim search bar + GPS button
│   ├── Emergency/
│   │   ├── SOSButton.tsx         # Large pulsing SOS button with WhatsApp deep links
│   │   ├── TrustedContacts.tsx   # Local storage contact manager & validation
│   │   ├── AudioSiren.tsx        # Web Audio API emergency siren alarm & strobe
│   │   └── HelplineGrid.tsx      # Tap-to-call direct helpline numbers
│   ├── Places/
│   │   ├── PlaceCard.tsx         # Safe place card with directions & details
│   │   └── PlaceFilter.tsx       # Filter tabs (Police, Hospitals, Pharmacies, Fire)
│   └── Assistant/
│       ├── ChatWindow.tsx        # Interactive AI chat interface
│       └── SafetyPromptChips.tsx # Pre-built scenario chips
├── services/
│   ├── overpassService.ts        # Overpass API live query engine
│   ├── geocodingService.ts       # Nominatim forward & reverse geocoding
│   ├── contactsStorage.ts        # LocalStorage persistence manager
│   └── emergencyMessage.ts       # Emergency text & WhatsApp link builder
├── utils/
│   ├── audioAlarm.ts             # Web Audio API siren synthesis
│   └── phoneValidator.ts         # Indian & international phone validation
├── types/
│   ├── places.ts                 # SafePlace & coordinate types
│   ├── contact.ts                # Trusted contact & log types
│   └── chat.ts                   # Chat message & prompt types
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file
└── README.md                     # Documentation
```

---

## 🔒 Security & Privacy Practices
1. **No Backend Secret Exposure**: All AI calls occur inside `app/api/chat/route.ts`. API keys are never bundled into client JavaScript.
2. **Client-First Location Handling**: Geolocation coordinates are used solely to query public OpenStreetMap endpoints and build WhatsApp links on the user's device. No user location coordinates are permanently logged on servers.
3. **Deep Link Transparency**: All external actions (WhatsApp, Tel URIs, Google Maps) use explicit user-initiated browser triggers.

---

## 📄 License
MIT License. Built for personal safety, privacy, and empowerment.
