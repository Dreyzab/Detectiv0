# Plan: Supabase Migration, Map Contract, and Point Lifecycle

## 1. Goal
Build a stable, scalable Map Engine on Supabase with:
- strict API contracts between `apps/server` and `apps/web`;
- predictable point lifecycle for `global`, `case`, and `progression`;
- clear behavior for temporary and persistent unlocks;
- green baseline for build, lint, and tests.

This plan is focused on current blockers and the next architecture-safe implementation steps.

## 2. Current Problems (Baseline)
1. Build and type errors in server/frontend integration.
2. `MapPoint` data arrives as raw DB payload (`unknown` JSONB), not canonical DTO.
3. Client imports server app type directly (`web` depends on `server/src/index.ts`).
4. Tests are partially outdated (old endpoints/fields).
5. Seeding strategy is not yet aligned with long-lived vs case-only points.

## 3. Target Architecture

### 3.1 Data Ownership
- Supabase (PostgreSQL) is source of truth for map content and user point state.
- Client stores optimistic/local UX state only.
- Server resolves and returns canonical map DTO for UI.

### 3.2 Point Classes
- `global`: always available world services (merchant, healer, junk dealer).
- `case`: points tied to current investigation.
- `progression`: points unlocked during a case, then kept for long-term progression.

### 3.3 Persistence Policy
- `temporary`: visible while case is active or until case completion rules hide it.
- `persistent_on_unlock`: once unlocked by player, remains available.
- `permanent`: always available.

## 4. Database Design (Supabase)

## 4.1 `map_points` (extend)
Add columns:
- `scope text not null default 'case'` (`global|case|progression`)
- `case_id text null`
- `retention_policy text not null default 'temporary'` (`temporary|persistent_on_unlock|permanent`)
- `default_state text not null default 'locked'`
- `active boolean not null default true`

Recommended indexes:
- `(active, scope, case_id)`
- `(packId, active)`
- `(qr_code)` unique where needed

## 4.2 `user_map_point_user_states` (extend)
Add columns:
- `persistent_unlock boolean not null default false`
- `unlocked_by_case_id text null`
- `meta jsonb null`

Recommended indexes:
- `(user_id, point_id)` (already PK)
- `(user_id, persistent_unlock)`

## 4.3 Migration Skeleton (example)
```sql
alter table map_points
  add column if not exists scope text not null default 'case',
  add column if not exists case_id text,
  add column if not exists retention_policy text not null default 'temporary',
  add column if not exists default_state text not null default 'locked',
  add column if not exists active boolean not null default true;

alter table user_map_point_user_states
  add column if not exists persistent_unlock boolean not null default false,
  add column if not exists unlocked_by_case_id text,
  add column if not exists meta jsonb;
```

## 5. API Contract Strategy

### 5.1 Extract contracts into shared package
Create `packages/contracts`:
- `packages/contracts/map.ts`:
  - request/response schemas for `/map/points`, `/map/resolve-code/:code`;
  - canonical DTO types (`MapPointDto`, `UserPointStateDto`).
- Optionally zod schemas reused by server validation and client parsing.

### 5.2 Remove direct web -> server source dependency
Current anti-pattern:
- `apps/web/src/shared/api/client.ts` imports type from `apps/server/src/index.ts`.

Target:
- both `web` and `server` import API contract types from `packages/contracts`.
- web build no longer fails due to unrelated server compile errors.

## 6. Server Implementation Plan

## Phase A: Stabilization (blocking errors first)
1. Fix `apps/server/src/modules/admin.ts`
   - remove sqlite style `.all()` and `.run()`;
   - use postgres drizzle query style only.
2. Fix `apps/server/src/modules/map.ts`
   - `import type` for type-only imports (`verbatimModuleSyntax`);
   - remove dead imports/unused values.
3. Keep endpoint behavior stable:
   - `/map/points`
   - `/map/resolve-code/:code`

## Phase B: Canonical map response
1. Add server-side mapper:
   - `apps/server/src/modules/map.ts` or `apps/server/src/modules/map.mapper.ts`.
2. Parse and validate:
   - `category` -> enum;
   - `bindings` JSONB -> `MapPointBinding[]`;
   - `data` -> typed safe object.
3. Return canonical shape only:
   - `points: MapPointDto[]`
   - `userStates: Record<string, PointStateEnum>`

## Phase C: Lifecycle filtering
In `/map/points` service logic:
1. Load active points.
2. Include by rules:
   - all `global`;
   - `case` for active case;
   - `progression` if `persistent_unlock=true` or condition unlocked.
3. Apply retention policy rules.
4. Return final filtered list.

## 7. Frontend Implementation Plan

## Phase D: Typed consumption
1. Update `apps/web/src/features/detective/data/useMapPoints.ts`
   - consume typed DTO only;
   - remove unsafe assumptions and raw `unknown` usage.
2. Update `apps/web/src/widgets/map/map-view/MapView.tsx`
   - strict point type support;
   - typed `inventory: Record<string, number>`;
   - no fallback logic based on malformed category strings.
3. Fix path/type issues in Mind Palace:
   - `apps/web/src/features/detective/mind-palace/usePassiveChecks.ts` import path fix.

## Phase E: Contract isolation
1. Replace client typing in `apps/web/src/shared/api/client.ts`:
   - no import from `server/src/index.ts`;
   - use shared contracts package.

## 8. Seeding and Content Strategy

## 8.1 Seed model
Split map content by role:
- `global_points.ts`
- `case_01_points.ts` (and later by cases)
- `progression_points.ts`

## 8.2 Seed behavior
1. `global` points are upserted, never removed in case reseed.
2. `case` points can be replaced by case seed.
3. `progression` points are upserted and kept.
4. User persistent unlocks must survive content reseed.

## 8.3 Script updates
Update `apps/server/src/scripts/seed-map.ts`:
- remove stale import from deleted source (`@repo/shared/data/points`);
- use current content sources only;
- support idempotent upserts.

## 9. Test Plan

## 9.1 Unit
1. `packages/shared/lib/map-resolver.test.ts`
   - update old field checks (`isAvailable` -> `enabled`);
   - keep priority/condition tests.
2. Add tests for mapper normalization (category/bindings/data).

## 9.2 Server integration
1. Update `apps/server/test/modules/map.test.ts`:
   - use current endpoint `/map/resolve-code/:code`;
   - avoid direct dependency on remote Supabase in unit-like tests.
2. Update `apps/server/test/simple.test.ts` to avoid runtime enum assumptions.

## 9.3 Frontend
1. Fix test alias/mocks for TypedText:
   - mock `soundManager` in test setup.
2. Keep VN localization/engine tests as regression guards.

## 9.4 E2E
1. Ensure playwright browser install in CI:
   - `bun x playwright install chromium`.
2. Keep smoke flow stable and minimal.

## 10. Delivery Phases (Suggested Order)
1. **P0 Stabilization**: compile/lint blockers (`admin`, `map`, `mind-palace import`).
2. **P1 Contract Normalization**: canonical map DTO on server + typed web consumption.
3. **P2 Lifecycle Model**: DB migration + filtering rules (`scope`, `retention_policy`).
4. **P3 Seeding Refactor**: split global/case/progression, idempotent upserts.
5. **P4 Test Modernization**: unit/integration/e2e baseline green.
6. **P5 Hardening**: logging, metrics, and rollout safety.

## 11. Definition of Done
1. `bun run --filter web build` passes.
2. `bun run --filter web lint` passes.
3. `bun x tsc -p apps/server/tsconfig.json --noEmit` passes.
4. Updated tests pass for resolver + map module + typed text baseline.
5. `/map/points` returns canonical typed DTO only.
6. Point lifecycle behavior verified:
   - permanent global points visible;
   - case points follow case scope;
   - progression unlock persists across case completion/reseed.

## 12. Rollback and Safety
1. All schema changes through additive migrations first.
2. Backfill scripts for new columns with safe defaults.
3. Feature-flag lifecycle filtering if needed for staged rollout.
4. Keep old endpoint behavior compatible until client switch is complete.

## 13. Implementation Checklist (Actionable)
- [x] Fix server compile blockers in `admin.ts` and `map.ts`.
- [x] Fix mind-palace import path.
- [x] Add canonical map mapper and schema validation.
- [x] Create `packages/contracts` and move map API contracts there.
- [x] Refactor `api/client.ts` to use shared contracts (no direct server source import).
- [x] Implement DB migration for scope/retention/persistent unlock.
- [x] Update `/map/points` selection logic by lifecycle rules.
- [x] Refactor seed pipeline for global/case/progression.
- [ ] Update outdated tests and restore green baseline (partially done).
- [x] Add CI playwright install step and validate smoke test.
