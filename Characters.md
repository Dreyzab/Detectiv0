# 🗂️ Character Dossier (Index)

> **System Note**: Access individual dossiers in `10_Narrative/Characters/`.
> This view aggregates all known NPCs and their relationships.

## 🎭 The Cast (Dataview)

```dataview
TABLE without id
  file.link as "Name",
  aliases as "Alias",
  archetype as "Archetype",
  works_for as "Affiliation",
  knows as "Connections"
FROM "10_Narrative/Characters"
WHERE contains(tags, "npc")
SORT file.name ASC
```

## 🛠️ Relationship Matrix

```dataview
TABLE
  hates as "Enemies",
  loves as "Allies",
  investigating as "Target"
FROM "10_Narrative/Characters"
WHERE contains(tags, "npc")
```
