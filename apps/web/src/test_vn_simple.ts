
import { CASE1_BRIEFING_LOGIC } from './entities/visual-novel/scenarios/detective/case1_briefing.logic';
import { CASE1_BRIEFING_EN } from './entities/visual-novel/scenarios/detective/case1_briefing.en';
import { mergeScenario } from './entities/visual-novel/lib/localization';

console.log('BEGIN TEST');
console.log('Logic ID:', CASE1_BRIEFING_LOGIC.id);
console.log('Content Locale:', CASE1_BRIEFING_EN.locale);

const merged = mergeScenario(CASE1_BRIEFING_LOGIC, CASE1_BRIEFING_EN, CASE1_BRIEFING_EN);
console.log('Merged ID:', merged.id);
console.log('Merged Scenes:', Object.keys(merged.scenes));
console.log('Start Scene Text:', merged.scenes['start'].text);
console.log('END TEST');
