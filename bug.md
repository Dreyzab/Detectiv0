# Bug Audit Log

Date: 2026-02-09
Scope: initial static audit (`apps/server`, `apps/web`, `packages/shared`)
Policy: findings only (no code fixes in this cycle)

## Critical

### BUG-001: Hardcoded production DB credentials in repository
- Type: security, secret leak
- Evidence: `apps/server/scripts/check-db-pg.ts:4`
- Details: the file contains a full Postgres connection string including username and plaintext password.
- Impact: credential compromise, direct unauthorized DB access risk.
- Status: open

### BUG-002: Authentication bypass via fallback identity and user-controlled headers
- Type: security, auth/authorization
- Evidence: `apps/server/src/middleware/auth.ts:20`, `apps/server/src/middleware/auth.ts:22`, `apps/server/src/lib/user-id.ts:14`, `apps/server/src/lib/user-id.ts:15`, `apps/server/src/lib/user-id.ts:44`
- Details: auth module can be disabled, and user identity is accepted from request headers (`x-user-id`, `x-demo-user-id`) with fallback to `demo_user`.
- Impact: identity spoofing, cross-user data access/modification, shared global account corruption.
- Status: open

### BUG-003: Admin endpoints are unauthenticated
- Type: security, access control
- Evidence: `apps/server/src/modules/admin.ts:31`, `apps/server/src/modules/admin.ts:36`, `apps/server/src/modules/admin.ts:96`
- Details: `/admin` routes allow reading/updating map points and wiping progress with no auth guard.
- Impact: unauthenticated destructive operations.
- Status: open

## High

### BUG-004: Sensitive internal error data returned to clients
- Type: security, information disclosure
- Evidence: `apps/server/src/modules/map.ts:223`, `apps/server/src/modules/map.ts:224`, `apps/server/src/modules/map.ts:225`
- Details: API error response includes raw exception message and stack trace.
- Impact: leaks internal paths, runtime details, and implementation internals.
- Status: open

### BUG-005: Disabled map points can still be unlocked by QR resolve endpoint
- Type: logic/security
- Evidence: `apps/server/src/modules/map.ts:168`, `apps/server/src/modules/map.ts:170`, `apps/server/src/modules/map.ts:249`, `apps/server/src/modules/map.ts:260`
- Details: QR lookup does not filter by `active = true` before unlocking state.
- Impact: hidden/inactive content can be activated if code is known.
- Status: open

### BUG-006: Client-controlled progression/state mutation without server-side trust boundary
- Type: security/integrity
- Evidence: `apps/server/src/modules/engine.ts:955`, `apps/server/src/modules/engine.ts:962`, `apps/server/src/modules/engine.ts:981`, `apps/server/src/modules/engine.ts:986`
- Details: endpoint applies client-provided XP, faction delta, relation delta directly.
- Impact: arbitrary progression tampering and balance corruption if endpoint is publicly reachable.
- Status: open

## Medium

### BUG-007: Migration script reports success even when migration fails
- Type: reliability/ops
- Evidence: `apps/server/src/db/migrate.ts:16`, `apps/server/src/db/migrate.ts:17`, `apps/server/src/db/migrate.ts:21`
- Details: failures are logged but process exits with code `0`.
- Impact: CI/CD or deploy scripts can treat failed migrations as successful.
- Status: open

### BUG-008: TLS certificate validation disabled in DB scripts
- Type: security
- Evidence: `apps/server/src/db/migrate.ts:9`, `apps/server/scripts/check-db-pg.ts:10`
- Details: `rejectUnauthorized: false` disables TLS peer verification.
- Impact: MITM risk on untrusted networks.
- Status: open

### BUG-009: Unbounded `ticks` in time advancement endpoint
- Type: reliability/game-state integrity
- Evidence: `apps/server/src/modules/engine.ts:729`, `apps/server/src/modules/engine.ts:755`, `apps/server/src/db/schema.ts:119`
- Details: `ticks` accepts any number and is stored in integer-based world clock.
- Impact: overflow/invalid state risk and abuse via extreme values.
- Status: open

### BUG-010: Save slot range is not enforced
- Type: logic/data integrity
- Evidence: `apps/server/src/modules/detective.ts:40`, `apps/server/src/modules/detective.ts:41`, `apps/server/src/modules/detective.ts:71`, `apps/server/src/modules/detective.ts:72`
- Details: slot only validated as numeric; expected slot domain (`0..9`) is not enforced.
- Impact: uncontrolled slot namespace growth and inconsistent save UX.
- Status: open

### BUG-011: Runtime/config mismatch for DB URL example vs actual driver
- Type: configuration/maintainability
- Evidence: `.env.example:12`, `apps/server/src/db/index.ts:1`, `apps/server/src/db/index.ts:27`
- Details: example uses SQLite-like `file:./dev.db` while runtime always initializes Postgres client.
- Impact: broken setup paths, onboarding confusion, environment drift.
- Status: open

## Rudiments / Stubs / Technical debt

### BUG-012: Unimplemented gameplay actions in runtime handler
- Type: stub/functional gap
- Evidence: `apps/web/src/features/detective/lib/map-action-handler.ts:94`, `apps/web/src/features/detective/lib/map-action-handler.ts:102`
- Details: `start_battle` and `teleport` branches only log "not implemented yet".
- Impact: actions silently do nothing in production flow.
- Status: open

### BUG-013: Additional unfinished action path in VN runtime
- Type: stub/functional gap
- Evidence: `apps/web/src/pages/VisualNovelPage/VisualNovelPage.tsx:325`
- Details: `add_heat` action is explicitly not wired.
- Impact: scenario action contract is partially non-functional.
- Status: open

### BUG-014: Demo/legacy artifacts committed to repository
- Type: rudiment/repo hygiene
- Evidence: `apps/server/debug_output.txt:1`, `apps/server/debug_output_2.txt:1`, `apps/server/debug_output_3.txt:1`, `apps/server/debug_output_4.txt:1`, `packages/shared/data/parliament_legacy.ts.bak`, `apps/server/dev.db`
- Details: debug outputs, legacy backup, and local DB artifact are tracked.
- Impact: noise, accidental data leakage, and maintenance friction.
- Status: open

## Additional findings (pass 2)

### High

### BUG-015: VN save import loses `choiceHistory`
- Type: logic/data integrity
- Evidence: `apps/web/src/entities/visual-novel/model/store.ts:180`, `apps/web/src/entities/visual-novel/model/store.ts:185`, `apps/web/src/entities/visual-novel/model/store.ts:196`, `apps/web/src/entities/visual-novel/model/store.ts:201`
- Details: `exportSave` writes `choiceHistory`, but `importSave` restores only locale/scenario/scene/history and drops `choiceHistory`.
- Impact: visited-choice tracking resets after restore, allowing repeated gated choices and inconsistent narrative state.
- Status: open

### BUG-016: Quest action parser emits unsupported action type (`add_flag`)
- Type: logic/contract mismatch
- Evidence: `apps/web/src/features/quests/engine.ts:34`, `apps/web/src/features/quests/engine.ts:36`, `apps/web/src/features/detective/lib/map-action-handler.ts:72`, `apps/web/src/features/detective/lib/map-action-handler.ts:76`, `apps/web/src/features/detective/lib/map-action-handler.ts:110`
- Details: quest parser creates `{ type: 'add_flag' }`, while action handler supports `set_flag` and `add_flags`; unmatched actions fall into default warning branch.
- Impact: quest-triggered flag mutations can silently no-op and break progression.
- Status: open

### BUG-017: `/map/resolve-code` can downgrade progressed point state to `discovered`
- Type: logic/state regression
- Evidence: `apps/server/src/modules/map.ts:260`, `apps/server/src/modules/map.ts:263`, `apps/server/src/modules/map.ts:185`
- Details: QR resolve always upserts `state: 'discovered'` on conflict, regardless of existing `visited/completed` state.
- Impact: repeat scans can regress user progression for a map point.
- Status: open

### BUG-018: Multi-step engine mutations are non-transactional
- Type: reliability/data consistency
- Evidence: `apps/server/src/modules/engine.ts:831`, `apps/server/src/modules/engine.ts:832`, `apps/server/src/modules/engine.ts:839`, `apps/server/src/modules/engine.ts:890`, `apps/server/src/modules/engine.ts:898`, `apps/server/src/modules/engine.ts:959`, `apps/server/src/modules/engine.ts:967`, `apps/server/src/modules/engine.ts:981`, `apps/server/src/modules/engine.ts:1007`
- Details: endpoints perform multiple dependent writes/events sequentially with no DB transaction boundary; partial failure can leave inconsistent world/progression/event state.
- Impact: race/partial-write inconsistencies under concurrent or faulted requests.
- Status: open

### BUG-019: Cross-origin auth context is not forwarded by API client fetches
- Type: security/auth reliability
- Evidence: `apps/web/src/shared/api/baseUrl.ts:1`, `apps/web/src/shared/api/baseUrl.ts:62`, `apps/web/src/shared/api/client.ts:83`, `apps/web/src/shared/api/client.ts:89`
- Details: client defaults to `http://localhost:3000` in dev, but `fetch` requests do not set `credentials: 'include'`; cookie-based auth context can be dropped on cross-origin calls.
- Impact: authenticated sessions may degrade to fallback identity path, increasing spoofing/shared-user corruption risk.
- Status: open

### Medium

### BUG-020: Map interaction `item_count` conditions are effectively disabled by inventory stub
- Type: stub/functional gap
- Evidence: `apps/web/src/widgets/map/map-view/MapView.tsx:177`, `apps/web/src/widgets/map/map-view/MapView.tsx:178`, `apps/web/src/widgets/map/map-view/MapView.tsx:187`
- Details: map view uses an always-empty in-memory inventory object (`{}`) with TODO note instead of real inventory state.
- Impact: bindings that require items via `item_count` are unreachable.
- Status: open

### BUG-021: `default_state` from DB schema is ignored in map marker fallback logic
- Type: logic/config drift
- Evidence: `apps/server/src/db/schema.ts:44`, `apps/web/src/widgets/map/map-view/MapView.tsx:392`
- Details: backend defines per-point `default_state` (default `locked`), but frontend fallback for missing user state is hardcoded to `discovered`.
- Impact: marker state can drift from canonical map configuration, causing visibility/progression inconsistencies.
- Status: open

### BUG-022: Bun web test run fails on Vite-only `import.meta.glob`
- Type: test infrastructure/runtime mismatch
- Evidence: `apps/web/src/entities/visual-novel/scenarios/registry.ts:13`, `apps/web/src/entities/visual-novel/scenarios/registry.ts:19`
- Details: `bun test apps/web/src` fails with `TypeError: import.meta.glob is not a function` when scenario registry is imported outside Vite transform context.
- Impact: full Bun suite is not runnable, hiding regressions in scenario localization checks.
- Status: open

### BUG-023: Bun web test run cannot resolve alias import in `TypedText` tests
- Type: test infrastructure/module resolution
- Evidence: `apps/web/src/shared/ui/TypedText/TypedText.tsx:2`, `apps/web/src/shared/ui/TypedText/__tests__/TypedText.test.tsx:4`
- Details: `bun test apps/web/src/shared/ui/TypedText/__tests__/TypedText.test.tsx` fails with `Cannot find module '@/shared/lib/audio/SoundManager'`.
- Impact: TypedText tests fail under Bun despite passing under Vitest, reducing CI signal quality.
- Status: open

### BUG-024: Vitest run fails on suites authored with `bun:test`
- Type: test infrastructure/runner fragmentation
- Evidence: `apps/web/src/pages/CharacterPage/psycheProfile.test.ts:1`, `apps/web/src/entities/visual-novel/model/__tests__/engine.test.ts:1`
- Details: `bun x vitest run` fails with `Cannot find package 'bun:test'` for two suites.
- Impact: no single runner can execute all web tests reliably.
- Status: open

### BUG-025: Test scripts are missing or intentionally failing in package scripts
- Type: quality gate/automation gap
- Evidence: `apps/server/package.json:6`, `apps/web/package.json:6`, `package.json:11`
- Details: server `test` script exits with error by design, web has no `test` script, workspace root exposes only e2e tests.
- Impact: unit/integration checks are easy to skip in CI and local workflows.
- Status: open

### BUG-026: Environment example is out of sync with runtime env keys
- Type: configuration drift
- Evidence: `.env.example:6`, `apps/web/src/widgets/map/map-view/MapView.tsx:23`, `apps/web/src/widgets/map/map-view/MapView.tsx:333`, `apps/web/src/shared/api/baseUrl.ts:41`
- Details: example exposes `MAPBOX_ACCESS_TOKEN`, while runtime expects `VITE_MAPBOX_TOKEN` and optional `VITE_API_BASE_URL`/`VITE_API_URL`.
- Impact: onboarding/deploy misconfiguration and false startup failures.
- Status: open

## Additional rudiments / repo hygiene

### BUG-027: Generated Playwright artifacts are tracked despite ignore rules
- Type: rudiment/repo hygiene
- Evidence: `.gitignore:126`, `.gitignore:127`, `playwright-report/index.html`, `test-results/.last-run.json`
- Details: generated test reports are present in tracked files even though they are listed in `.gitignore`.
- Impact: repository bloat and accidental inclusion of runtime/debug artifacts in history.
- Status: open

## Additional findings (pass 3)

### High

### BUG-028: Inventory fallback grants starter resources when server hydration fails
- Type: logic/economy integrity
- Evidence: `apps/web/src/entities/inventory/model/store.ts:243`, `apps/web/src/entities/inventory/model/store.ts:248`, `apps/web/src/entities/inventory/model/store.ts:249`
- Details: on hydration failure, client injects `STARTER_ITEM_STACKS` and `STARTER_MONEY` if local values are empty/zero.
- Impact: players can regain starter money/items after sync failures (economy inflation and state corruption).
- Status: open

### BUG-029: Player location is client-only and resets to default on reload
- Type: state integrity/desync
- Evidence: `apps/web/src/features/detective/engine/store.ts:27`, `apps/web/src/features/detective/engine/store.ts:96`, `apps/web/src/features/detective/engine/store.ts:125`, `apps/web/src/features/detective/engine/store.ts:132`
- Details: location defaults to `loc_hbf`, is not hydrated from server snapshot, and is reused as source for travel requests.
- Impact: travel origin can desync from real progression after refresh/reopen, enabling inconsistent route logic.
- Status: open

### BUG-030: Engine allows travel sessions for unknown/unrouted locations
- Type: logic/data integrity
- Evidence: `apps/server/src/modules/engine.ts:768`, `apps/server/src/modules/engine.ts:769`, `apps/server/src/modules/engine.ts:773`, `apps/server/src/modules/engine.ts:777`, `apps/server/src/modules/engine.ts:806`, `apps/server/src/modules/engine.ts:807`
- Details: if no route is found, endpoint still creates a session with default ETA and accepts arbitrary string location IDs.
- Impact: location graph constraints can be bypassed; arbitrary/invalid location states can be introduced.
- Status: open

### BUG-031: Case progression accepts arbitrary objective IDs without validation
- Type: logic/progression integrity
- Evidence: `apps/server/src/modules/engine.ts:890`, `apps/server/src/modules/engine.ts:893`, `apps/server/src/modules/engine.ts:933`, `apps/server/src/modules/engine.ts:935`
- Details: `/engine/case/advance` writes `nextObjectiveId` directly with no check that objective exists or belongs to the specified case.
- Impact: case state can be moved to non-existent/wrong objectives, breaking narrative flow and downstream UI.
- Status: open

### Medium

### BUG-032: Inventory sync ignores canonical normalized snapshot returned by server
- Type: client/server consistency
- Evidence: `apps/web/src/entities/inventory/model/store.ts:270`, `apps/web/src/entities/inventory/model/store.ts:285`, `apps/server/src/modules/inventory.ts:160`, `apps/server/src/modules/inventory.ts:173`
- Details: client posts snapshot and, on success, only clears sync flags; server-normalized values are not applied locally.
- Impact: local inventory can drift from server canonical state after normalization/sanitization.
- Status: open

### BUG-033: Save slot parsing is permissive and invalid slot errors return HTTP 200
- Type: API contract/input validation
- Evidence: `apps/server/src/modules/detective.ts:40`, `apps/server/src/modules/detective.ts:41`, `apps/server/src/modules/detective.ts:71`, `apps/server/src/modules/detective.ts:72`
- Details: `parseInt` accepts partial numeric strings (e.g. `1abc`), and invalid slot handling returns error payload without setting `400`.
- Impact: ambiguous slot IDs and weaker API error semantics for clients.
- Status: open

### BUG-034: Event code actions are returned without schema validation
- Type: data validation/integrity
- Evidence: `apps/server/src/modules/map.ts:163`, `apps/server/src/modules/map.ts:240`, `apps/server/src/modules/map.ts:245`
- Details: event-code actions from DB are cast to `MapAction[]` and returned directly, unlike map point bindings that are schema-validated.
- Impact: malformed actions can propagate to clients and produce silent no-op/undefined behavior.
- Status: open

### BUG-035: Admin map point update lacks deep binding validation
- Type: data integrity/admin safety
- Evidence: `apps/server/src/modules/admin.ts:49`, `apps/server/src/modules/admin.ts:50`, `apps/server/src/modules/admin.ts:80`, `apps/server/src/modules/map.ts:87`, `apps/server/src/modules/map.ts:89`
- Details: admin update only checks `bindings` is an array and leaves deep validation as TODO; invalid bindings are later dropped at runtime.
- Impact: malformed admin writes can silently disable map interactions.
- Status: open

### BUG-036: Quest snapshot API accepts arbitrary stage strings server-side
- Type: logic/contract drift
- Evidence: `apps/server/src/modules/quests.ts:49`, `apps/server/src/modules/quests.ts:51`, `packages/shared/data/quests.ts:28`, `packages/shared/data/quests.ts:44`, `packages/shared/data/quests.ts:58`
- Details: server normalizes stage to any non-empty string; canonical stage order checks on client/shared helpers treat unknown stages as invalid (`index = -1`).
- Impact: persisted quest states can become non-canonical, breaking stage-gated conditions and progression checks.
- Status: open
