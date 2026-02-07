# AGENTS.md

## Obsidian Operating Rules (Detectiv Vault)

### Scope
These rules apply to `obsidian/Detectiv/**` for any AI-assisted edits.

### Mandatory preflight before edits
1. Check duplicate markdown basenames:
```powershell
$files = Get-ChildItem -Path obsidian/Detectiv -Recurse -File -Filter *.md
$files | Group-Object Name | Where-Object { $_.Count -gt 1 }
```
   - Exception: `READ_ME.md` duplicates are allowed (section-level entry notes).
2. Check duplicate frontmatter `id` values in `.md` files.
3. For Parliament updates, compare:
   - `obsidian/Detectiv/20_Game_Design/Voices/Voice_*.md`
   - links from `obsidian/Detectiv/20_Game_Design/Voices/MOC_Parliament.md`
   - runtime canonical roster in `packages/shared/data/parliament.ts`

### Parliament integrity policy
1. `MOC_Parliament.md` must have:
   - exactly 6 groups x 3 voices synced with `packages/shared/data/parliament.ts`
2. Canonical roster is fixed to:
   - Brain: `logic`, `perception`, `encyclopedia`
   - Soul: `intuition`, `empathy`, `imagination`
   - Character: `authority`, `charisma`, `volition`
   - Body: `endurance`, `agility`, `senses`
   - Shadow: `stealth`, `deception`, `intrusion`
   - Spirit: `occultism`, `tradition`, `gambling`
3. No orphan voice notes:
   - every active `Voice_*.md` must be linked from `MOC_Parliament.md`
4. Voices outside canonical roster must be archived as `.legacy.txt` (not `.md`).
5. If runtime roster changes in code, update `MOC_Parliament.md` in the same cycle.

### Link hygiene
1. For critical MOCs, use path-based wikilinks in hubs:
   - example: `[[20_Game_Design/Voices/MOC_Parliament|MOC_Parliament]]`
2. Avoid ambiguous bare links when basename duplicates exist.
3. Do not keep obsolete notes as `.md` if they create graph noise; move to `.legacy.txt`.

### Post-change validation
1. Re-run duplicate basename check.
2. Re-run Parliament integrity check (missing/extra voice links).
3. Report findings briefly in the task response:
   - duplicates found/not found
   - orphan notes found/fixed
   - changed files list
