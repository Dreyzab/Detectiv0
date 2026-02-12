# PLAN-sandbox-structure

> **Status**: DRAFT
> **Owner**: @project-planner
> **Goal**: Restructure `Sandbox_KA` graph to follow a "Hub & Spoke" model with a unified Entry Flow, Partner Mechanic, and standardized Quest Hubs.

---

## 1. Context & Vision

The user wants a **Non-Linear Sandbox** structure that visually and logically represents the game flow in Obsidian.

**Key Components:**
1.  **Unified Entry**: `Start` → `Language` → `Backstory` → `Map`.
2.  **Partner Mechanic**: A Map entity (Icon) that provides meta-guidance ("Talk to 3 clients").
3.  **Location Hubs**:
    -   Each major point (Bank, Rathaus, Estate) is a **HUB**.
    -   Hubs display: Quests, Interactions (Trade/Heal), Requirements.
4.  **Quest Flow**:
    -   From Hub → `Initial State Node` (BG, Text, Checks).
    -   Then → Standard `Case01` Plot Structure.
    -   End → `Exit to Map` Node.

---

## 2. Phase 1: Structure Definition (Obsidian)

We need to create a specific directory structure to support this flow.

### 2.1. File Hierarchy
```
Sandbox_KA/
├── Sandbox_KA_Flow.canvas    # The "Board"
├── 00_Entry/                 # The Linear Start
│   ├── scene_start.md
│   ├── scene_language_select.md
│   └── scene_backstory_select.md
├── 00_Global/                # Shared Entities
│   ├── char_partner.md       # The Partner Logic
│   └── map_karlsruhe.md      # The Main Map Node
├── 01_Hubs/                  # The Logic Hubs (NOT just locations)
│   ├── hub_agency.md         # Home Base
│   ├── hub_bank.md           # Banker's Case Start
│   ├── hub_rathaus.md        # Mayor's Case Start
│   └── hub_estate.md         # Ghost Case Start
└── 02_Cases/                 # The Narrative Content
    ├── 01_Banker/            # Standard Plot Structure
    ├── 02_Dog/
    └── 03_Ghost/
```

### 2.2. Node Types

**Partner Node (`mech_partner`)**:
-   **Type**: Narrative/Mechanic
-   **Function**: Proactive guidance.
-   **Visual**: Icon on Canvas.
-   **Content**: "Talk to 3 clients" (Meta-objective).

**Hub Node (`loc_hub`)**:
-   **Properties**: `services` (Heal, Trade), `quests` (List).
-   **Flow**: Connects `Map` -> `Quest Entry`.

**Quest Entry Node (`scene_quest_start`)**:
-   **Content**: Initial Background, Flavor Text, Passive Checks.
-   **Output**: First Choice (to enter Plot).

---

## 3. Implementation Steps

### Step 3.1: Create Entry Sequence
-   Create `00_Entry/` folder.
-   Create scenes for Start, Language, Backstory.
-   Link them sequentially in `Sandbox_KA_Flow.canvas`.

### Step 3.2: Implement Partner & Map
-   Create `00_Global/char_partner.md` with "Meta-Quest" dialogue.
-   Place Partner Node on Canvas near the Map center.

### Step 3.3: Build Hubs
-   Create `01_Hubs/` folder.
-   Create `hub_*.md` files for Bank, Rathaus, Estate.
-   Define metadata: `services: [trade, heal]`, `quests: [sandbox_banker]`.

### Step 3.4: Migrate & Refine Cases
-   Move existing `Plot/01_Banker` to `02_Cases/01_Banker`.
-   **Update Entry**: Ensure `hub_bank.md` leads to `scene_bank_intro.md` (Background/Checks).
-   **Update Exit**: Ensure `scene_bank_conclusion.md` links back to `map_karlsruhe.md`.

---

## 4. SOCRATIC QUESTIONS (Verification)

Before executing, please confirm:

1.  **Partner Implementation**: Should the Partner be a *clickable map point* in the game (Code) or just a *narrative voice* in the Graph (Obsidian)? (User said "record, without code" - implies Obsidian design first).
2.  **Backstory Selection**: Should this actually trigger gameplay state changes (Flags), or is it flavor for the Canvas?
3.  **Hub vs Location**: A "Hub" usually implies a menu. Is `hub_bank.md` the Map Point popup, or the first VN scene inside the bank? (User description sounds like the Map Point Description/Popup).

---

## 5. Next Actions

1.  Approve this structure?
2.  Answer Socratic questions.
3.  Run `/create` to build the folders and files.
