# SafeReach AI — Comprehensive Architectural & Technical System Documentation

SafeReach AI is a production-grade, decentralized women’s safety and emergency navigation platform designed to provide rapid crisis response, intelligent safe haven discovery, verified data-backed safety scoring, and immediate emergency contact dispatch.

---

## 1. System Overview & Core Philosophy

SafeReach AI operates on three fundamental engineering principles:

1. **Zero-Latency Crisis Access**: Emergency actions (SOS dispatch, acoustic sirens, police dialers) require zero authentication, zero onboarding friction, and work instantaneously with single-tap execution.
2. **Deterministic Data Integrity**: Safe Scores and safety haven recommendations are computed purely from real-world, verified OpenStreetMap geospatial nodes and live GPS proximity—eliminating arbitrary or hallucinated claims.
3. **Absolute User Privacy & Zero Telemetry Tracking**: All personal coordinates, emergency contacts, and usage logs remain strictly client-side inside the user's browser `localStorage`. No user location data is ever persisted on any central database or cloud server.

---

## 2. Complete Technology Stack & Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SAFEREACH AI TECH STACK                       │
├───────────────────────┬─────────────────────────────────────────────────┤
│ Layer                 │ Technologies & Libraries                        │
├───────────────────────┼─────────────────────────────────────────────────┤
│ Framework & Runtime   │ Next.js 14 (App Router), React 18, Node.js      │
│ Language              │ TypeScript 5 (Strict Type Checking)             │
│ Styling & Aesthetics  │ Tailwind CSS, Lucide React, Glassmorphism CSS   │
│ Maps & GIS Engine     │ Leaflet.js, React-Leaflet Dynamic SSR Wrapper   │
│ Geospatial Data       │ OpenStreetMap Overpass QL API, Nominatim Geocode│
│ AI Intelligence Engine│ Google Gemini 3.7 Flash (@google/genai SDK)     │
│ Audio Synthesizer     │ Web Audio API (Dual Oscillator Acoustic Alarm)  │
│ Storage & State       │ Browser Web Storage API (localStorage, E2E)     │
│ Deployment Target     │ Vercel Edge Network / Node.js Serverless        │
└───────────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph Client [User Browser / Client Device]
        GPS[Browser Geolocation API / GPS Sensor]
        UI[Next.js 14 Dark-Mode UI / Radar HUD]
        Storage[Browser localStorage - E2E Encrypted Locally]
        Audio[Web Audio API - Dual Synthesizer Siren]
    end

    subgraph Server [Next.js Server / API Routes]
        PlacesAPI[/api/places - Geospatial Proxy]
        GeocodeAPI[/api/geocode - Nominatim Proxy]
        ChatAPI[/api/chat - Gemini 3.7 Flash Engine]
    end

    subgraph External [Decentralized & Cloud Services]
        OSM[OpenStreetMap Overpass API Cluster]
        Nominatim[Nominatim Geocoding Engine]
        Gemini[Google DeepMind Gemini API]
        WhatsApp[WhatsApp Universal Protocol Handler]
        Telecom[GSM / Direct Telephony 112 / 181]
    end

    GPS -->|Live Lat/Lng| UI
    UI -->|Coordinates + Radius| PlacesAPI
    UI -->|Search Query| GeocodeAPI
    UI -->|Emergency Prompts + Context| ChatAPI
    UI -->|1-Tap Trigger| Audio
    UI -->|Store Contacts / Logs| Storage
    UI -->|Pre-filled Geo Link| WhatsApp
    UI -->|Direct Tel Link| Telecom

    PlacesAPI -->|Overpass QL Queries| OSM
    GeocodeAPI -->|Address Resolution| Nominatim
    ChatAPI -->|System Instructions + Context| Gemini
```

---

## 4. Deep-Dive into Core Engineering Subsystems

### 4.1. Dynamic Geolocation & Zero-Hardcoding Pipeline

SafeReach AI is built with an **entirely dynamic, user-independent coordinate pipeline**:

1. **Mount Calibration**: When a user opens any location-enabled route (`/safe-places`, `/emergency`, `/dashboard`), `navigator.geolocation.getCurrentPosition()` is invoked with `enableHighAccuracy: true` and `maximumAge: 0`.
2. **Origin Assignment**: The client receives that user's exact floating-point latitude, longitude, timestamp, and accuracy.
3. **No Developer Leakage**: The codebase contains zero fallback coordinates or developer test locations.
4. **Permission-Denied Graceful Degradation**: If browser GPS is denied, the system seamlessly transitions into manual search mode via Nominatim worldwide geocoding, prompting the user to type their locality or street.

---

### 4.2. OpenStreetMap Overpass Geospatial Discovery Engine

The Safe Place Locator queries real-time OpenStreetMap nodes and ways across 9 public safety classifications:

#### Query Strategy:
- **Transit Hubs (`railway=station`, `station=subway`, `amenity=bus_station`)**: CISF/police guards, CCTV coverage, intense public footfall.
- **Commercial Centers (`shop=mall`, `shop=department_store`, `shop=supermarket`)**: Entry security guards, metal detectors, continuous indoor lighting.
- **Law Enforcement Outposts (`amenity=police`, `amenity=police_booth`, `government=public_safety`)**: Sworn police officers on duty.
- **Hospitals & Clinics (`amenity=hospital`, `amenity=clinic`, `healthcare=hospital`)**: 24/7 emergency medical staff and trauma triage.
- **24/7 Fuel Stations (`amenity=fuel`)**: Illuminated forecourts with 24/7 staffed attendants.
- **Hotel Lobbies (`tourism=hotel`)**: Staffed front desks, doormen, and secure lobbies.
- **Banks & Guarded ATMs (`amenity=bank`, `amenity=atm`)**: Dedicated security guards and CCTV.
- **Pharmacies (`amenity=pharmacy`)**: Licensed healthcare personnel and first-aid supplies.
- **Fire & Rescue (`amenity=fire_station`)**: First responders on active duty.

#### Adaptive Auto-Expansion Pipeline:
1. The engine queries an initial radius of `5,000 meters` (`around:5000,lat,lng`).
2. If zero safe havens are returned (e.g. in quiet residential/suburban areas), the engine automatically executes an adaptive fallback query widening the radius up to `12,000 meters`.
3. To prevent single-point-of-failure outages, the request rotates through 4 decentralized Overpass API mirrors (`maps.mail.ru`, `overpass.private.coffee`, `overpass-api.de`, `overpass.kumi.systems`) with a 12-second abort timeout.

---

### 4.3. The 100-Point Safe Score Algorithm & Mathematics

SafeReach AI implements a transparent, deterministic multi-factor scoring model ($S \in [0, 100]$) computed dynamically for each venue relative to the active user:

$$\text{SafeScore} = \min\left(100, W_{\text{venue}} + W_{\text{proximity}} + W_{\text{hours}} + W_{\text{contact}} + W_{\text{infra}}\right)$$

#### 1. Facility Protection Weight ($W_{\text{venue}}$, Max 35 Pts):
- Police Station: **35 pts**
- Hospital / Emergency Care: **33 pts**
- Metro / Train Hub: **32 pts**
- Shopping Mall: **28 pts**
- Hotel Lobby: **26 pts**
- Fire Station: **25 pts**
- 24/7 Fuel Station: **24 pts**
- Guarded ATM / Bank: **22 pts**
- Pharmacy: **20 pts**

#### 2. Live Proximity & Reachability Weight ($W_{\text{proximity}}$, Max 30 Pts):
- $d \le 0.5\text{ km}$ ($\sim 5\text{ min walk}$): **30 pts**
- $0.5 < d \le 1.0\text{ km}$ ($\sim 10\text{ min walk}$): **24 pts**
- $1.0 < d \le 2.5\text{ km}$: **18 pts**
- $2.5 < d \le 5.0\text{ km}$: **12 pts**
- $d > 5.0\text{ km}$: **6 pts**

*Distance formula*: Haversine geodesic computation:
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$d = 2R \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right) \quad (\text{where } R = 6371\text{ km})$$

#### 3. 24/7 Operating Hours & Night Illumination ($W_{\text{hours}}$, Max 15 Pts):
- Verified 24/7 Continuous Operation: **15 pts**
- Verified Business Hours on Record: **10 pts**
- Standard Daytime Baseline: **6 pts**

#### 4. Contact & Governing Body Verification ($W_{\text{contact}}$, Max 10 Pts):
- Direct Verified Telephone on Record: **+5 pts**
- Registered Governing / Operating Body (e.g. DMRC, Police, Apollo): **+5 pts**

#### 5. Thoroughfare & Step-Free Accessibility ($W_{\text{infra}}$, Max 10 Pts):
- Mapped Street Address: **+5 pts**
- Verified Wheelchair / Step-Free Physical Entry: **+5 pts**

---

### 4.4. AI Crisis Triage & Safety Companion Engine (`/api/chat`)

Powered by Google DeepMind's **Gemini 3.7 Flash** model (`@google/genai` SDK):

1. **System Directive**: Operates under strict crisis protocol guidelines (concise tactical bullet points, immediate danger prioritization, dialer guidance for 112/181).
2. **Context Injection**: Dynamically injects the user's live coordinates and address so the assistant provides hyper-local situational instructions.
3. **Safety Filters & Tone**: Structured to maintain calm, authoritative, de-escalating communication during stalking, cab diversion, domestic threats, or harassment emergencies.

---

### 4.5. 1-Tap Emergency SOS & WhatsApp Deep-Link Dispatcher

When the user triggers the SOS button or quick-action modal:
1. **Live GPS Pinpoint**: Extracts the user's exact latitude and longitude with timestamp.
2. **Universal Geo Link Generation**: Creates a direct Google Maps navigation URL:
   `https://maps.google.com/?q={lat},{lng}`
3. **WhatsApp Protocol Formatting**: Constructs an encoded emergency dispatch text:
   ```text
   EMERGENCY SOS - I need immediate assistance!
   My live GPS location: https://maps.google.com/?q=28.6139,77.2090
   Please send help or contact emergency authorities right away!
   ```
4. **Direct WhatsApp API Link**: Opens `https://wa.me/{phone}?text={encodedMsg}` with one tap.

---

### 4.6. Web Audio API Acoustic Siren & Optical Strobe

A hardware-independent browser alarm synthesizer:
1. **Dual Oscillator Synthesis**: Creates an AudioContext with two oscillators running triangle and sawtooth waves frequency-modulated between **700 Hz and 1300 Hz** at **3.5 Hz cycle cadence** to emulate standard emergency vehicle sirens.
2. **High-Decibel Dynamic Gain Node**: Amplifies the acoustic signal to maximum browser output without distortion.
3. **Optical Strobe Beacon**: Flashes the screen between pure crimson (`#e11d48`) and pitch black (`#050508`) at **8 Hz** to draw immediate visual attention in dark or isolated areas.

---

### 4.7. Keyless High-Contrast Dark-Mode Map Architecture

- **Engine**: Leaflet.js wrapped inside a Next.js `ssr: false` dynamic loader to prevent hydration mismatch.
- **Tiles**: 100% Free, keyless standard OpenStreetMap raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Dark Matrix Filter**: Rendered with custom CSS:
  ```css
  .dark-map-tiles .leaflet-tile {
    filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.2) brightness(0.7);
  }
  ```
- **Zero Watermark**: Eliminates proprietary tile keys and third-party watermarks while delivering a near-black, futuristic aesthetic.

---

## 5. Directory Structure & Code Organization

```
safereach-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Gemini 3.7 Flash AI triage endpoint
│   │   ├── geocode/route.ts       # Nominatim reverse/forward geocoding
│   │   └── places/route.ts        # Overpass safe places query proxy
│   ├── about/page.tsx             # Mission & architectural overview
│   ├── assistant/page.tsx         # AI Safety Assistant interface
│   ├── dashboard/page.tsx         # Real-time telemetry & readiness dashboard
│   ├── emergency/page.tsx         # Emergency hub (SOS, siren, contacts, helplines)
│   ├── safe-places/page.tsx       # Live radar locator with Safe Scores
│   ├── safety-tips/page.tsx       # Tactical safety manual & field guides
│   ├── globals.css                # Futuristic design system & scanline textures
│   ├── layout.tsx                 # Root layout with animated background & vignette
│   └── page.tsx                   # Cinematic landing page & capability grid
├── components/
│   ├── Assistant/                 # AI Chat window & situational preset chips
│   ├── Emergency/                 # SOS Button, Trusted Circle, Siren, Helplines
│   ├── Map/                       # SafeMap (Leaflet) & LocationSearch
│   ├── Places/                    # PlaceCard, Safe Score badges, Methodology modal
│   ├── Footer.tsx                 # Telemetry & 24/7 national helplines
│   ├── Navbar.tsx                 # Navigation bar & quick SOS modal
│   └── RadarHeroVisual.tsx        # Interactive radar HUD visual
├── public/
│   └── background.gif             # Ambient animated turbulence background
├── services/
│   ├── contactsStorage.ts         # Browser localStorage privacy manager
│   ├── emergencyMessage.ts        # WhatsApp SOS message generator
│   ├── geocodingService.ts        # Nominatim geocoding client
│   ├── overpassService.ts         # OpenStreetMap Overpass client & fallback
│   └── safetyScoring.ts           # 100-point deterministic Safe Score engine
├── types/
│   ├── chat.ts                    # AI Chat message & prompt interfaces
│   ├── contact.ts                 # Trusted contact & settings models
│   └── places.ts                  # SafePlace, Coordinates, and SafeScore interfaces
├── utils/
│   ├── audioAlarm.ts              # Web Audio API dual oscillator synthesizer
│   └── phoneValidator.ts          # Indian & international phone sanitizer
├── tailwind.config.ts             # Custom palette & keyframe animations
└── tsconfig.json                  # Strict TypeScript configuration
```

---

## 6. Security, Privacy & Compliance Guarantees

1. **Zero Database Coordinate Storage**: SafeReach AI does not store user locations in any SQL/NoSQL database. All coordinate resolution is ephemeral and lives only in browser memory and local storage.
2. **Server-Side API Key Protection**: Gemini API keys (`AI_API_KEY`) are kept strictly on the Node.js server environment and are never leaked to client bundles.
3. **End-to-End Client Control**: Users can clear their trusted contacts and cached locations with one click at any time.
4. **HTTPS Enforcement**: Geolocation and Web Audio features mandate secure HTTPS in production to prevent man-in-the-middle tampering.
