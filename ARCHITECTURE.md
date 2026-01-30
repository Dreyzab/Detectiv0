# Project Architecture — Grezwanderer 4

## 🏗 High-Level Overview

Grezwanderer 4 is a multi-modal gaming platform built with a **Modular Monorepo** approach. It combines Visual Novel (VN) storytelling, Map-based exploration, and RPG combat mechanics.

The project is structured according to **Feature-Sliced Design (FSD)** principles on the frontend and a **Module-based** architecture on the backend.

---

## 📂 Directory Structure

### `apps/web` (Frontend: React + Vite)
Follows FSD (Feature-Sliced Design):
- **app/**: Global setup (providers, styles, entry point).
- **pages/**: Application screens (HomePage, MapPage, QRScanner, CharacterPage).
- **widgets/**: Composition layer (MapView, Dossier, CombatHUD).
- **features/**: User-facing capabilities (Detective Mode, Layer Toggles, Movement).
- **entities/**: Business logic and stores (User, Inventory, VisualNovel, Quest).
- **shared/**: Reusable UI components and pure logic (UI Kit, Mapbox Libs, i18n).

### `apps/server` (Backend: ElysiaJS + Bun + SQLite)
- **api/**: REST/Eden Treaty endpoints.
- **db/**: Drizzle schema, migrations, and seed data.
- **modules/**: Domain logic (Auth, Map, Progress, Combat).
- **lib/**: Utility functions (QR processing, Battle logic).

### `packages/shared`
- Shared types, constants, and localization files (`locales/`) used by both frontend and backend.

---

## 🕵️ Detective Mode Architecture
## Game Modes
Currently the project focuses on **Detective Mode** (Freiburg 1905).
-   **Detective Mode**: Narrative-heavy exploration of historical settings.
- **Content Pack**: Data specific to a case (e.g., *Freiburg 1905*). Includes POIs (Points of Interest), Scenario scripts (VN), Evidence data, and region-specific assets.

### Key Data Flows
1. **The Investigation Loop**: 
   `Map Exploration → Hardlink (QR Action) → VN Scenario → Evidence/Flag Unlock → Progression`.
2. **Persistence**: 
   Uses Zustand `persist` middleware with localStorage for offline-first investigation progress (Dossier Store).
3. **Visual Effects**: 
   Dynamic CSS filters (`sepia`, `contrast`) paired with high-resolution grain/paper textures to create historical immersion.

### Data Architecture (v2)

| Domain | Source | Status |
|--------|--------|--------|
| **Map Points** | SQLite (`map_points`) | ✅ Migrated |
| **User Progress** | SQLite (`user_map_point_states`) | ✅ Migrated |
| **Hardlinks (QR)** | `hardlinks.ts` | ⏳ Phase 2 → DB |
| **Cases/Chapters** | `cases.ts` | ⏳ Phase 2 → DB |
| **Deductions** | `deductions.ts` | ⏳ Phase 2 → DB |

> **Note**: `hardlinks.ts`, `cases.ts`, `deductions.ts` remain as static files. They will migrate to DB when a content editor is implemented.

---

## 🔄 State Management

- **Global UI/Game State**: Zustand (stores for `inventory`, `dossier`, `ui`).
- **Server Sync**: Eden Treaty (ElysiaJS client) with end-to-end type safety.
- **Persistence**: `gw4-inventory-storage` and `detective-dossier` in LocalStorage.

---

## 🗺 Mapbox Integration

- **Engine**: Mapbox v8.
- **Custom Styling**: In-house historical styles via Mapbox Studio.
- **Optimization**:
    - **Pathfinding**: Cached navigation requests to reduce API calls.
    - **Interpolation**: Client-side coordinate calculation for smooth marker movement without React re-renders.

---

## 🛠 Automation & Quality

- **Plop.js**: Scaffolding for FSD layers (`bun run generate`).
- **Husky + lint-staged**: Pre-commit hooks for linting and type checking.
- **Master Scripts**: `.agent/scripts/checklist.py` for comprehensive project audits.
