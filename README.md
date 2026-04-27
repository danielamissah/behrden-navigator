# Behörden Navigator

> A mobile guide to German bureaucracy — step-by-step procedures, document checklists, AI assistant, and GPS-based office finder. Built for expats and immigrants navigating Germany for the first time.

Germany requires every resident to complete a specific sequence of government procedures after arrival. The order matters, the documents are specific, and the offices are hard to find. This app removes the guesswork — in English and German.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Built with Expo](https://img.shields.io/badge/built%20with-Expo-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## The Problem

Every person who moves to Germany must complete a specific sequence of bureaucratic procedures to establish their legal and practical life in the country. The dependencies are real and consequential:

* You cannot get a **Steuernummer** before you have an **Anmeldung**
* You cannot open a bank account at most banks without an **Anmeldebestätigung**
* You cannot apply for an **Aufenthaltstitel** without a registered address
* You cannot start work without a **Sozialversicherungsnummer**

Getting the order wrong means wasted trips, missed deadlines, and in serious cases — visa overstay. The official guidance is fragmented across dozens of government websites, written in official German that is opaque even to native speakers, and provides no personalised checklist or progress tracking.

This app solves that with a clear, step-by-step guide to every procedure — in plain English.

---

## Features

* **10 core procedures** — Anmeldung, Aufenthaltstitel, Steuernummer, Krankenversicherung, Bankkonto, Rundfunkbeitrag, Sozialversicherungsausweis, Führerschein exchange, Gewerbeanmeldung, and Elterngeld
* **Step-by-step progress tracking** — tap each step to mark it complete; progress bars update instantly; resume exactly where you left off
* **Document checklists** — every document listed with format requirements, where to obtain it, and whether you need an original or a copy
* **AI assistant** — powered by Groq (Llama 3.3 70B), answers any question about German bureaucracy in plain English or German
* **GPS office finder** — automatically detects your location on launch and sorts all offices by proximity using the Haversine formula; no search required
* **Animated onboarding** — full-screen teal gradient slides with spring-animated illustrations and expanding dot indicators
* **English and German** — full translation of all UI and procedure content; language toggle persists across sessions
* **Offline-first** — all procedure data is bundled with the app; no network required for browsing procedures or tracking progress
* **Fluid animations** — FadeInView, SlideUpView, ScalePressable, and StaggeredList primitives built on the React Native Animated API with useNativeDriver throughout

---

## Procedures Covered

| Procedure                                | Category     | Difficulty | Est. Time |
| ---------------------------------------- | ------------ | ---------- | --------- |
| Anmeldung (Address Registration)         | Registration | Easy       | 3 days    |
| Steuernummer (Tax Number)                | Work & Tax   | Easy       | 14 days   |
| Bankkonto (Bank Account)                 | Registration | Easy       | 7 days    |
| Aufenthaltstitel (Residence Permit)      | Visa         | Hard       | 60 days   |
| Krankenversicherung (Health Insurance)   | Work         | Easy       | 5 days    |
| Rundfunkbeitrag (Broadcasting Fee)       | Registration | Easy       | 2 days    |
| Sozialversicherungsausweis               | Work         | Easy       | 21 days   |
| Führerschein Exchange                   | Driving      | Medium     | 30 days   |
| Gewerbeanmeldung (Business Registration) | Business     | Medium     | 7 days    |
| Elterngeld (Parental Allowance)          | Family       | Medium     | 30 days   |

---

## Project Structure

```
behrden-navigator/
├── src/
│   ├── components/
│   │   ├── Animated.tsx             # Reusable animation primitives
│   │   ├── LanguageToggle.tsx       # EN / DE pill toggle
│   │   ├── OnboardingSlide.tsx      # Full-screen teal onboarding slide
│   │   └── ProcedureCard.tsx        # Card with progress bar + difficulty badge
│   ├── data/
│   │   └── procedures.ts            # All 10 procedures + office data (typed TS)
│   ├── i18n/
│   │   ├── translations.ts          # All UI strings in EN and DE
│   │   └── useTranslation.ts        # Hook: returns t + lang from Zustand store
│   ├── screens/
│   │   ├── AssistantScreen.tsx      # AI chat interface (Groq)
│   │   ├── HomeScreen.tsx           # Procedure list with search + category filter
│   │   ├── OfficesScreen.tsx        # GPS-sorted office directory
│   │   ├── OnboardingScreen.tsx     # 3-slide animated onboarding
│   │   ├── ProcedureDetailScreen.tsx # Step-by-step procedure view
│   │   └── ProgressScreen.tsx       # All active procedures with progress
│   ├── services/
│   │   └── chatService.ts           # Groq API integration + system prompt
│   ├── store/
│   │   └── useAppStore.ts           # Zustand global store (language, progress, location)
│   ├── theme/
│   │   ├── colors.ts                # Design token system — single source of truth
│   │   └── typography.ts            # Roboto font scale
│   └── utils/
│       └── distance.ts              # Haversine formula for GPS distance calculation
├── assets/
│   └── splash.png                   # Splash screen (1284×2778px, teal background)
├── .github/
│   ├── workflows/
│   │   └── ci.yml                   # Type check, lint, Expo export on every push
│   ├── dependabot.yml               # Weekly dependency updates
│   └── pull_request_template.md
├── App.tsx                          # Root — fonts, location, onboarding gate, tabs
├── app.json                         # Expo config — splash, icons, permissions
└── babel.config.js                  # Babel + Reanimated plugin
```

---

## Tech Stack

| Layer        | Technology                             | Why                                                                     |
| ------------ | -------------------------------------- | ----------------------------------------------------------------------- |
| Framework    | React Native (Expo)                    | Single codebase for iOS and Android                                     |
| Language     | TypeScript (strict)                    | Type-safe procedure data and store                                      |
| State        | Zustand                                | Lightweight global state — language, progress, location                |
| Navigation   | React Navigation (stack + bottom tabs) | Industry standard; stack enables drill-down to procedure detail         |
| Animations   | React Native Animated API              | useNativeDriver throughout — all animations at 60fps off the JS thread |
| AI assistant | Groq API (Llama 3.3 70B)               | Fast, free tier, excellent formal German and English                    |
| Geolocation  | Expo Location                          | Native GPS access; Balanced accuracy for battery efficiency             |
| Font         | Roboto via @expo-google-fonts          | Material Design standard; renders well on both platforms                |
| Onboarding   | expo-linear-gradient                   | Full-screen teal gradient matching professional reference design        |
| Persistence  | AsyncStorage                           | Onboarding seen state survives app restarts                             |
| CI           | GitHub Actions                         | Type check, lint, Expo export on every push and PR                      |

---

## Getting Started

### Prerequisites

* Node.js 18+
* Expo CLI (`npm install -g expo-cli`)
* Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
* A free [Groq API key](https://console.groq.com/)

### Installation

```bash
git clone https://github.com/danielamissah/behrden-navigator.git
cd behrden-navigator
npm install
```

### Environment variables

```bash
cp .env.example .env.local
```

```
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

### Run

```bash
npx expo start --clear
```

Scan the QR code with Expo Go. The app runs on your phone immediately.

---

## How the Key Features Work

### Procedure data architecture

All procedure data lives in `src/data/procedures.ts` — a single typed TypeScript file containing 10 procedures with their steps, documents, tips, and translations. This was a deliberate decision over a CMS or backend:

* The data is version-controlled and diff-readable
* Changes are reviewed through the same CI pipeline as code
* No API keys, no network dependency, no cold start

When the app grows to 50+ procedures across 16 Bundesländer, a CMS becomes justified. At the current scope, a TypeScript file is the right tool.

### GPS office sorting

On first launch, the app requests foreground location permission via Expo Location. The coordinates are stored in Zustand. The Offices screen subscribes to that store value and re-renders automatically when location resolves — no manual refresh needed.

Offices are sorted using the Haversine formula:

```
d = 2R × arcsin(√(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)))
```

This computes the great-circle distance between two GPS coordinates in kilometres. For sorting 10–20 offices by approximate proximity across Germany's geographic scale, it is accurate to within 0.1% of true surface distance and requires zero external API calls or rate limits.

### AI assistant

The Groq API is called client-side from React Native. The system prompt establishes the model as a bureaucracy specialist:

```
You are a helpful assistant specialising in German bureaucracy and government
procedures. Give clear, practical, step-by-step advice. Always mention which
office is responsible. Note when rules vary by Bundesland. Recommend official
sources for verification. Respond in the same language the user writes in.
```

Temperature is set to 0.4 — specific enough for consistent procedural advice, flexible enough for conversational follow-up questions.

---

## DevOps Setup

### CI Pipeline (GitHub Actions)

Every push and pull request to `main` runs:

1. **Type check** — `npx tsc --noEmit`
2. **Lint** — `npx eslint . --ext .ts,.tsx --max-warnings 0`
3. **Expo export** — `npx expo export --platform web` validates the full bundle compiles without errors

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint . --ext .ts,.tsx --max-warnings 0

  expo-build-check:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm install -g expo-cli
      - run: npx expo export --platform web
        env:
          CI: true
```

### Branch Protection

The `main` branch requires:

* Pull request before merging — no direct pushes
* All CI checks passing before merge
* No force pushes or branch deletion

### Dependabot

Weekly automated dependency PRs every Monday at 09:00 Berlin time. Minor and patch updates are grouped into a single PR. Expo SDK major versions are excluded and require manual review.

---

## Updating Procedure Data

All procedure content lives in `src/data/procedures.ts`. To update or add a procedure:

1. Edit the relevant procedure object in the `PROCEDURES` array
2. Update both `title_en`/`title_de`, `summary_en`/`summary_de`, and all step descriptions
3. Add any new documents to the `required_documents` array with `name_en`, `name_de`, `format`, and `where_to_get`
4. Open a pull request — CI validates the TypeScript compiles before merge
5. Note the official source in the PR description (e.g. "BAMF Merkblatt, January 2025")

---

## Adding a New Office

All offices are in the `OFFICES` array at the bottom of `src/data/procedures.ts`. Each office needs:

```typescript
{
  id: 'unique-id',
  name: 'Office display name',
  type: 'Bürgeramt / Einwohnermeldeamt',
  address: 'Full street address',
  city: 'Berlin',
  lat: 52.5186,    // GPS coordinates for distance sorting
  lng: 13.4147,
  phone: '+49 30 115',
  website: 'https://...',
  booking_url: 'https://...',
  hours: [
    { day: 'Monday', open: '08:00', close: '15:00' },
    // ...
  ],
}
```

---

## Roadmap

* [ ] Expand to all 16 Bundesländer with location-specific procedure variations
* [ ] Push notifications for appointment reminders and document expiry dates
* [ ] Document vault — encrypted storage for scanned documents with expiry tracking
* [ ] Sanity CMS integration for editorial procedure updates without code changes
* [ ] App Store and Play Store deployment
* [ ] Community tips — verified user-submitted advice per procedure and city
* [ ] Procedure dependency graph — visual map showing which procedures unlock others

---

## Contributing

Pull requests welcome, especially for:

* New procedure data (with official source citations)
* Additional city offices (with verified opening hours)
* Corrections to existing procedure steps
* New language support (Turkish, Arabic, Ukrainian are high priority)

Please open an issue first for significant changes. All procedure content changes require a source citation in the PR description.

---

## Disclaimer

Procedure information is based on official German government sources as of 2025. Rules vary by Bundesland, municipality, and individual circumstances. Always verify requirements directly with the relevant Behörde before attending an appointment. This app is for guidance only and does not constitute legal advice.

---

## About

This app was built as part of a four-app portfolio targeting full-stack and mobile developer roles in Germany. The portfolio was built under a genuine constraint — a visa deadline creating a hard deadline for employment — which shaped every technical decision: pragmatic where pragmatism was right, thorough where thoroughness mattered.

**Daniel Kwame Amissah** is a full-stack and mobile developer with experience across React Native, Next.js, TypeScript, and Node.js. The Germany App Portfolio demonstrates end-to-end product engineering — from architectural design documents through to deployed, production-grade software — across civic tech, legal tech, financial tools, and AI-assisted applications.

All four apps in the portfolio are publicly available:

| App                   | Platform | Link                                       |
| --------------------- | -------- | ------------------------------------------ |
| Mülltrennung Scanner | Mobile   | github.com/YOUR_USERNAME/mulltrennung-app  |
| Minijob Calculator    | Web      | minijob-calculator.vercel.app              |
| Mietrecht Assistant   | Web      | mietrecht-assistant.vercel.app             |
| Behörden Navigator   | Mobile   | github.com/YOUR_USERNAME/behrden-navigator |

---

## License

MIT — see [LICENSE](https://claude.ai/chat/LICENSE) for details.

---

*Part of the Germany App Portfolio — four apps built for people living in Germany.*
