-- SEED DATA FOR SUPABASE SQL EDITOR

INSERT INTO "quests" ("id", "title", "description", "objectives", "completion_condition", "rewards") VALUES (
    'case01_act1',
    'Case 01: Shadows at the Bank - Act 1',
    'A mysterious robbery at Bankhaus J.A. Krebs. No witnesses, strange traces. Investigate the crime scene.',
    '[{"id":"inspect_safe","text":"Inspect the Vault","condition":{"type":"flag","flag":"EVIDENCE_SAFE_CRACKED"}},{"id":"interrogate_clerk","text":"Talk to the Teller","condition":{"type":"flag","flag":"INTERROGATION_CLERK_DONE"}}]',
    '{"type":"logic_and","conditions":[{"type":"flag","flag":"EVIDENCE_SAFE_CRACKED"},{"type":"flag","flag":"INTERROGATION_CLERK_DONE"}]}',
    '{"xp":150,"traits":["observant"]}'
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, objectives = EXCLUDED.objectives, completion_condition = EXCLUDED.completion_condition, rewards = EXCLUDED.rewards;

INSERT INTO "map_points" ("id", "packId", "title", "description", "lat", "lng", "category", "image", "qr_code", "bindings", "data", "schema_version") VALUES
('p_hbf', 'fbg1905', 'Hauptbahnhof', 'The steam and steel gateway to Freiburg. Travelers from Basel and Strasbourg arrive here.', 47.997791, 7.842609, 'INTEREST', '/images/detective/loc_hauptbahnhof.png', NULL, '[{"id":"vn_lw6c9","trigger":"marker_click","label":"Look around","priority":10,"actions":[{"type":"start_vn","scenarioId":"intro_arrival"}]}]', '{"voices":{"logic":"Trains arriving on time. A system in motion."}}', 1),
('p_bank', 'fbg1905', 'Bankhaus J.A. Krebs', 'The prestigious bank on Münsterplatz. Currently undergoing renovation by Architect Billing.', 47.995574, 7.852296, 'CRIME_SCENE', '/images/detective/loc_bankhaus.png', NULL, '[{"id":"bank_enter","trigger":"marker_click","label":"Investigate Crime Scene","priority":20,"actions":[{"type":"start_vn","scenarioId":"detective_case1_bank_scene"}]},{"id":"bank_qr","trigger":"qr_scan","label":"Scan Evidence","priority":30,"actions":[{"type":"start_vn","scenarioId":"detective_case1_bank_hidden_clue"}]}]', '{"voices":{"empathy":"The panic of the clerk still lingers in the air."}}', 1),
('p_munster', 'fbg1905', 'Freiburg Münster', 'The towering gothic cathedral. Its spire dominates the skyline.', 47.9955, 7.8529, 'INTEREST', '/images/detective/loc_munster.png', NULL, '[]', NULL, 1),
('p_rathaus', 'fbg1905', 'New Town Hall', 'Administrative center containing the City Archives.', 47.99609, 7.8495, 'QUEST', '/images/detective/loc_rathaus_archiv.png', NULL, '[{"id":"archive_enter","trigger":"marker_click","label":"Consult Archives","priority":10,"actions":[{"type":"start_vn","scenarioId":"detective_case1_archive_search"}]}]', NULL, 1),
('p_uni_chem', 'fbg1905', 'Kiliani Laboratory', 'Prof. Kiliani''s chemistry lab. Smells of sulfur and almonds.', 47.994, 7.846, 'QUEST', '/images/detective/loc_uni.png', NULL, '[{"id":"chem_analyze","trigger":"marker_click","label":"Request Analysis","priority":10,"conditions":[{"type":"flag_is","flagId":"has_strange_residue","value":true}],"actions":[{"type":"start_vn","scenarioId":"detective_case1_lab_analysis"}]}]', NULL, 1),
('p_uni_med', 'fbg1905', 'Institute of Hygiene', 'Dr. Uhlenhuth''s domain. Cutting edge forensic serology.', 47.9935, 7.847, 'QUEST', '/images/detective/loc_uni.png', NULL, '[{"id":"blood_analyze","trigger":"marker_click","label":"Analyze Blood Sample","priority":10,"conditions":[{"type":"flag_is","flagId":"has_blood_sample","value":true}],"actions":[{"type":"start_vn","scenarioId":"detective_case1_blood_analysis"}]}]', NULL, 1),
('p_student_house', 'fbg1905', 'Corps Suevia House', 'Fraternity house. Making noise even at this hour.', 47.99, 7.848, 'INTEREST', '/images/detective/loc_student_house.png', NULL, '[{"id":"corps_visit","trigger":"marker_click","label":"Question Students","priority":10,"actions":[{"type":"start_vn","scenarioId":"detective_case1_corps_interview"}]}]', NULL, 1),
('p_pub_deutsche', 'fbg1905', 'Zum Deutschen Haus', 'A labyrinthine inn popular with locals and travelers.', 47.992, 7.854, 'NPC', '/images/detective/loc_ganter_brauerei.png', NULL, '[{"id":"pub_gossip","trigger":"marker_click","label":"Listen for Rumors","priority":10,"actions":[{"type":"start_vn","scenarioId":"detective_case1_pub_gossip"}]}]', NULL, 1),
('p_red_light', 'fbg1905', 'Gerberau Canal', 'The tanners'' quarter. Shadows run deep here.', 47.993, 7.851, 'INTEREST', '/images/detective/loc_suburbs.png', NULL, '[]', NULL, 1),
('p_goods_station', 'fbg1905', 'Old Warehouse', 'Güterbahnhof storage. Dark, quiet, and smelling of coal.', 48.001, 7.838, 'CRIME_SCENE', '/images/detective/loc_stuhlinger_warehouse.png', NULL, '[{"id":"raid_start","trigger":"marker_click","label":"Inspect Warehouse","priority":100,"actions":[{"type":"start_vn","scenarioId":"detective_case1_warehouse_finale"}]}]', NULL, 1),
('p_workers_pub', 'fbg1905', 'Tavern "The Red Cog"', 'Meeting place for editors of the Volkswacht.', 47.999, 7.839, 'NPC', '/images/detective/loc_ganter_brauerei.png', NULL, '[{"id":"quest_victoria_entry","trigger":"marker_click","label":"Enter with Victoria","priority":20,"conditions":[{"type":"flag_is","flagId":"victoria_quest_active","value":true}],"actions":[{"type":"start_vn","scenarioId":"quest_victoria_poetry"}]},{"id":"socialist_talk","trigger":"marker_click","label":"Talk to Workers","priority":10,"actions":[{"type":"start_vn","scenarioId":"detective_case1_socialist_talk"}]}]', NULL, 1),
('p_martinstor', 'fbg1905', 'Martinstor', 'Ancient city gate.', 47.9936, 7.849, 'INTEREST', '/images/detective/loc_munster.png', NULL, '[]', NULL, 1),
('p_schwabentor', 'fbg1905', 'Schwabentor', 'Ancient city gate with the Boy with the Thorn.', 47.9928, 7.8545, 'INTEREST', '/images/detective/loc_munster.png', NULL, '[]', NULL, 1),
('loc_tailor', 'fbg1905', 'Schneider''s Workshop', 'Leopold Fein''s tailoring shop. Specializes in theatrical costumes and disguises.', 47.9935, 7.8525, 'INTEREST', '/images/detective/loc_tailor.png', NULL, '[{"id":"tailor_enter","trigger":"marker_click","label":"Enter Workshop","priority":10,"actions":[{"type":"start_vn","scenarioId":"lead_tailor"}]}]', '{"voices":{"perception":"Fabric samples everywhere. A man who notices details."}}', 1),
('loc_apothecary', 'fbg1905', 'Löwen-Apotheke', 'Adalbert Weiss''s pharmacy near the Münster. Remedies for any ailment... and other things.', 47.9952, 7.8535, 'INTEREST', '/images/detective/loc_apothecary.png', NULL, '[{"id":"apothecary_enter","trigger":"marker_click","label":"Enter Apotheke","priority":10,"actions":[{"type":"start_vn","scenarioId":"lead_apothecary"}]}]', '{"voices":{"forensics":"The scent of herbs and chemicals. A careful inventory."}}', 1),
('loc_pub', 'fbg1905', 'Gasthaus "Zum Schlappen"', 'Working-class tavern near Martinstor. Where the Bächleputzer drinks.', 47.9938, 7.8495, 'INTEREST', '/images/detective/loc_ganter_brauerei.png', NULL, '[{"id":"pub_enter","trigger":"marker_click","label":"Enter Tavern","priority":10,"actions":[{"type":"start_vn","scenarioId":"lead_pub"}]}]', '{"voices":{"charisma":"Rough crowd. They won''t talk to just anyone."}}', 1),
('p_street_event', 'fbg1905', 'Street Encounter', 'A commotion on the street.', 47.9945, 7.8505, 'INTEREST', '/images/detective/loc_streets.png', NULL, '[{"id":"trigger_interlude_a","trigger":"marker_click","label":"Investigate Commotion","priority":100,"actions":[{"type":"start_vn","scenarioId":"interlude_victoria_street"}]}]', NULL, 1),
('p_telephone', 'fbg1905', 'Telegraph Office', 'A message is waiting for you.', 47.9965, 7.8485, 'QUEST', '/images/detective/loc_rathaus_archiv.png', NULL, '[{"id":"trigger_interlude_b","trigger":"marker_click","label":"Answer Call","priority":100,"actions":[{"type":"start_vn","scenarioId":"interlude_lotte_warning"}]}]', NULL, 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, lat = EXCLUDED.lat, lng = EXCLUDED.lng, category = EXCLUDED.category, image = EXCLUDED.image, bindings = EXCLUDED.bindings, data = EXCLUDED.data;

-- Lifecycle defaults for Case 01 content
-- Most points remain case-scoped by default.
UPDATE "map_points"
SET "case_id" = 'case_01_bank',
    "scope" = 'case',
    "retention_policy" = 'temporary',
    "default_state" = COALESCE("default_state", 'locked')
WHERE "packId" = 'fbg1905';

-- Persistent world services (example: healer/apothecary)
UPDATE "map_points"
SET "scope" = 'global',
    "retention_policy" = 'permanent',
    "default_state" = 'discovered',
    "case_id" = NULL
WHERE "id" IN ('loc_apothecary');

-- Progression points: unlock in case, remain after unlock
UPDATE "map_points"
SET "scope" = 'progression',
    "retention_policy" = 'persistent_on_unlock'
WHERE "id" IN ('p_uni_chem', 'p_uni_med');

INSERT INTO "event_codes" ("code", "actions", "active", "description") VALUES
('CASE01_BRIEFING_01', '[{"type":"start_vn","scenarioId":"detective_case1_briefing"},{"type":"unlock_point","pointId":"p_hbf"},{"type":"add_flags","flags":["case01_started"]}]', true, 'Initial briefing for Case 01'),
('CASE01_BANK_02', '[{"type":"start_vn","scenarioId":"detective_case1_bank_scene"},{"type":"unlock_point","pointId":"p_bank"},{"type":"grant_evidence","evidenceId":"ev_torn_fabric"}]', true, 'Bank investigation + Evidence'),
('CASE01_PUB_03', '[{"type":"start_vn","scenarioId":"detective_case1_pub_rumors"},{"type":"unlock_point","pointId":"p_pub_deutsche"}]', true, 'Pub rumors event'),
('CASE01_ARCHIVE_04', '[{"type":"start_vn","scenarioId":"detective_case1_archive_search"},{"type":"unlock_point","pointId":"p_rathaus"},{"type":"unlock_point","pointId":"p_goods_station"}]', true, 'Archive search and warehouse unlock'),
('CASE01_WAREHOUSE_05', '[{"type":"start_vn","scenarioId":"detective_case1_warehouse_finale"}]', true, 'Finale event'),
('TEST_BATTLE_01', '[{"type":"start_battle","scenarioId":"detective_skirmish","deckType":"detective"}]', true, 'Debug battle trigger')
ON CONFLICT (code) DO UPDATE SET actions = EXCLUDED.actions;
