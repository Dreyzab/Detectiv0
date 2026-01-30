# PLAN-logging-system

> **Goal**: Develop a robust logging and debugging system for the development phase to track errors, game state changes, Visual Novel progression, and network requests, with persistence to `localStorage`.

## 🛑 User Review Required
- **Storage Limit**: We will limit persistent logs to the last 1000 entries to prevent `localStorage` quota issues.
- **Production Stripping**: Ensure this logging system can be disabled or stripped in production builds via environment variables (`VITE_ENABLE_LOGS=true`).

## 🧱 Architecture & Tech Stack

- **Core Logger**: TypeScript class with singleton pattern, supporting log levels and custom channels (System, Game, VN, Network).
- **Visualization**: Browser Console with CSS styling (`%c`).
- **Persistence**: `localStorage` ring buffer.
- **State Logging**: Custom Zustand middleware.
- **Network**: `fetch` proxy/wrapper.

## 📂 File Structure

```text
packages/
  shared/
    src/
      lib/
        debug/
          logger.ts          # Core logging logic & persistence
          store-middleware.ts # Zustand integration
          network-logger.ts   # Fetch wrapper
```

## 📋 Task Breakdown

### 1. Core Logger Implementation
**Agent**: `frontend-specialist` | **Skill**: `clean-code`

- [ ] **Create `Logger` Class**
    - **Input**: `packages/shared/src/lib/debug/logger.ts`
    - **Logic**:
        - Implement `info`, `warn`, `error`, `debug` methods.
        - Add specialized channels: `vn` (Visual Novel), `net` (Network), `store` (Zustand).
        - Implement CSS styling mapping for each channel (e.g., VN = purple, Net = blue).
        - **Persistence**: Save logs to `localStorage` key `game_logs` (array of objects with timestamp). Implement circular buffer (max 1000 items).
    - **Output**: Fully functional Logger class export.
    - **Verify**: Call `Logger.info('test')` -> check console colors and `localStorage` entry.

### 2. Zustand Middleware
**Agent**: `frontend-specialist` | **Skill**: `react-patterns`

- [ ] **Create Store Logger Middleware**
    - **Input**: `packages/shared/src/lib/debug/store-middleware.ts`
    - **Logic**:
        - Create a Zustand middleware named `logMiddleware`.
        - Intercept state updates.
        - Log `[Store] Action: [Name]` and `Prev/Next` state diffs using `console.groupCollapsed`.
    - **Output**: Middleware function.
    - **Verify**: Attach to a dummy store, trigger action, verify group log in console.

### 3. Network Interceptor
**Agent**: `frontend-specialist` | **Skill**: `api-patterns`

- [ ] **Implement Fetch Wrapper**
    - **Input**: `packages/shared/src/lib/debug/network-logger.ts`
    - **Logic**:
        - Create `fetchWithLog` that wraps native `window.fetch`.
        - Log Request (URL, Method, Body).
        - Log Response (Status, Duration).
        - Log Errors (Network failures).
    - **Output**: Wrappers function.
    - **Verify**: Make a request to a dummy API, check logs.

### 4. Integration - Visual Novel
**Agent**: `frontend-specialist` | **Skill**: `app-builder`

- [ ] **Instrument VN Engine**
    - **Input**: `apps/web/src/entities/visual-novel/model/engine.ts` (or equivalent)
    - **Logic**:
        - Import `Logger`.
        - Add `Logger.vn()` calls on:
            - Scene start
            - Dialogue step
            - Choice selection
            - Variable changes
    - **Output**: Instrumented VN code.
    - **Verify**: Play through a scene -> observe "VN" tagged logs in console.

### 5. Integration - App & State
**Agent**: `frontend-specialist` | **Skill**: `app-builder`

- [ ] **Apply to Global Store**
    - **Input**: `apps/web/src/shared/store.ts` (or wherever main store is)
    - **Logic**: Wrap the store creation with `logMiddleware`.
    - **Verify**: Change inventory/dossier -> observe "Store" tagged logs.

## ✅ Phase X: Verification Plan

### Automated Checks
- [ ] **Unit Test**: Test `Logger` circular buffer logic (ensure it drops old logs).
- [ ] **Lint**: `npm run lint`

### Manual Verification
1.  **Console Check**:
    - Open DevTools.
    - Perform actions: Move map, open dossier, play dialogue.
    - Confirm logs appear with correct colors (`VN` purple, `Store` gray, `System` green).
2.  **Persistence Check**:
    - reload page.
    - Check `localStorage.getItem('game_logs')`.
    - Confirm previous session logs are present.
3.  **Network Check**:
    - Trigger an API call (if any).
    - Confirm request/response timing is logged.
