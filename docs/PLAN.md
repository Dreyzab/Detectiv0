# Project Assessment & Roadmap: Grezwanderer 4

> [!WARNING]
> [ARCHIVED] Этот документ зафиксирован как исторический аудит и частично устарел.
> Для актуального состояния проекта используйте:
> - `README.md`
> - `ARCHITECTURE.md`
> - `update.md`
> - `Map.md`
> - `VisualNovel.md`

## 🏗 Executive Summary
Grezwanderer 4 is a high-quality, modular monorepo project implementing a deep RPG investigation engine. The project demonstrates strong architectural discipline using **Feature-Sliced Design (FSD)** and modern tech stack (React 19, Vite 7, ElysiaJS, Bun, Supabase). The aesthetic (Art Deco / historical Noir) is consistently applied.

> **Correction**: While utilizing ElysiaJS on the backend, the "Eden Treaty" (end-to-end type safety) is currently **planned** but not yet implemented on the client side.

---

## 🔍 Technical Assessment

### 🟢 Strengths (Verified)
- **Architecture**: Strict FSD on frontend ensures scalability.
- **Performance**: Use of `Bun` + `Vite 7` provides excellent dev/runtime speed.
- **Persistence**: Robust `zustand + persist` strategy for offline-first investigation.
- **Visuals**: Premium feel with custom Mapbox styles and `framer-motion`.

### 🟡 Technical Debt & Risks
- **Duplicate Logic**: The "Parliament of Voices" system is defined in two conflicting locations (`packages/shared/data/parliament.ts` vs `apps/web/src/features/detective/lib/parliament.ts`). This is a critical blocker for RPG mechanics.
- **Missing Infrastructure**: `Eden Treaty` is not set up on the client, meaning API calls are not yet type-safe.
- **Testing**: Playwright is installed but has no configuration or tests. Unit tests are fragmentary.
- **Static Content**: Core data (`cases`, `hardlinks`) remains in static files, limiting scalability.

---

## 🗺 Strategic Roadmap (Hybrid Approach)

### 🚩 Phase 1.5: Foundation & Migration (Blockers)
*Strict prerequisites for Content Tools.*
1.  **[Infra]** **Eden Treaty Integration**: Connect the client (`apps/web`) to real endpoints (e.g., `/map/points`) to prove type safety.
2.  **[Data]** **Critical Migration**: Move `cases`, `hardlinks`, and `deductions` from static files to Supabase.
3.  **[QA]** **E2E Tests**: Add `test:e2e` script and fix the failing smoke test.

### ⚙ Parallel Track: RPG Mechanics
*Can proceed using existing/legacy data.*
1.  **[Voices]** **Mind Palace Overlay**: Implement using the consolidated `packages/shared` Parliament data.
2.  **[Battle]** **Battle Polish**: Improve UI/UX using `battle.ts` static data (migrate to DB later).

### 🚩 Phase 2: Content Scalability (Blocked)
*Requires Phase 1.5 completion.*
1.  **[Admin]** **Content Dashboard**: Build the admin interface relying on the migrated DB data and Eden Treaty for types.

---

## ✅ Phase 1: Immediate Action Plan
We will start with **Phase 1: Foundation & Debt Elimination**.

**Priority Tasks:**
1.  Setup Eden Treaty Client.
2.  Consolidate Parliament files.
3.  Init Playwright Config.
