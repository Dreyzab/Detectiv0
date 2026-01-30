# Player Journey: The First 30 Minutes

## 1. Main Menu (The Hook)
*   **Visuals:** The game opens on the `HomePage`. A moody, animated background of 1905 Freiburg (fog, gas lamps).
*   **UI:** Minimalist menu. "Continue" (disabled if no save), "New Game", "Settings".
*   **Action:** Player clicks **"New Game"**.

## 2. Identity (Onboarding / The Telegram)
*   **Transition:** Screen fades to black. A sound of a telegraph ticker.
*   **UI:** A vintage Berlin police telegram form appears on screen.
*   **Context:** "URGENT. TO: INSPECTOR [_____]. BERLIN HQ."
*   **Interaction:** Player types their last name in the blank field.
*   **Confirmation:** Player clicks "ACCEPT ASSIGNMENT". The telegram is stamped "APPROVED".

## 3. Arrival (The Prologue)
*   **Scene:** `case1_briefing` (Arrival at Freiburg Station).
*   **Visuals:** Fullscreen Visual Novel mode. Steam, crowds, the silhouette of the Münster.
*   **Dialogue:** Inspector's internal monologue about the fresh start.
*   **Meeting:** A rookie officer (Gendarm Müller) greets the player.
*   **The Critical Choice:**
    *   *Option A:* "I go to the Bank first. Crises don't wait." (Pragmatic/Professional)
    *   *Option B:* "I should pay my respects to the Mayor first." (Political/Polite)

## 4. The World Opens (Map Transition)
*   **Transition:** The VN interface slides away. The **Map View** (`Munsterplatz`) scales up from the background.
*   **UI State:**
    *   **Bottom:** The "Detective's Desk" navbar appears (Dossier, Inventory slots, Map).
    *   **Center:** The hand-drawn map of Freiburg.
    *   **Top Right (New):** The **Quest Tracker** slides in.

### 4.1. Dynamic Quest Tracker
The content of the Quest Tracker depends on the *Critical Choice* made at the station:

**Scenario A (Chose Bank):**
> **Current Objective:**
> *   [!] Investigate Bankhaus Krebs
> *   [ ] (Optional) Report to Mayor Winterer later

**Scenario B (Chose Mayor):**
> **Current Objective:**
> *   [!] Report to City Hall (Rathaus)
> *   [ ] Investigate Bankhaus Krebs

## 5. The Investigation Loop
*   **Navigation:** Player clicks on the Map Point (`Bank` or `City Hall`).
*   **Travel:** A marker moves across the map. Time advances slightly.
*   **Location Entry:**
    *   The map blurs/fades.
    *   The location background loads (e.g., Bank Interior).
    *   **VN Overlay:** The dialogue interface returns, but now sits *over* the location art (non-fullscreen mode for gameplay).

### 5.1. Bank Gameplay (Example)
1.  **Arrival:**
    *   *If Solo (from Scenario A):* You enter alone. Victoria eventually interrupts.
    *   *If Together (from Scenario B):* You enter with Victoria.
2.  **Investigation:**
    *   Player has choices: "Inspect Safe", "Talk to Clerk", "Check Floor".
    *   **Skill Checks:** Choosing "Inspect Safe" triggers a **LOGIC [Medium]** roll.
        *   *Success:* "The lock wasn't forced. It was opened with a key." (Grants Clue: `Inside Job?`)
    *   **Evidence:** Choosing "Check Floor" grants Item: `Torn Red Velvet`.

## 6. Expanding The Horizon
Once the Bank Scene concludes:
*   **Reward:** "New Leads Added to Map".
*   **Map Update:** 3 new pins drop onto the map with an animation:
    1.  📍 **Tailor Shop** (linked to `Torn Velvet`)
    2.  📍 **University/Apothecary** (linked to chemical traces)
    3.  📍 **The Pub** (linked to witness rumors)
*   **Quest Tracker Update:**
    > **Current Objective:** Follow the leads.
    > *   [ ] Identify the velvet owner (Tailor)
    > *   [ ] Analyze the dust (Apothecary)
    > *   [ ] Find the witness (Pub)

## 7. Ongoing Loop (`Etc`)
*   Player freely chooses which lead to pursue.
*   Visiting locations consumes Time/Energy (future mechanic).
*   Gathering all 3 leads triggers the next major story event (e.g., "The First Arrest").

## 8. Future Concepts

### 8.1. The Red String (Deduction Visualizer)
*   **Concept:** A visual mechanic connecting visited locations within a specific Case.
*   **Context:** Only visible in a special "Investigation Window" or "Case View" (not the main travel map).
*   **Function:** Draws a red thread between points in the chronological order they were visited/investigated.
*   **Purpose:** Helps players visualize their journey and the sequence of events in a complex investigation.
